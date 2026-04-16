import { sequelize } from '../config/database';
import { applicationRepository } from '../repositories/ApplicationRepository';
import { jobRepository } from '../repositories/JobRepository';
import { paymentRepository } from '../repositories/PaymentRepository';
import { jobStageRepository } from '../repositories/JobStageRepository';
import { notificationRepository } from '../repositories/NotificationRepository';
import { CONSTANTS } from '../constants';

export class ApplicationService {
    // Maps to STK-APP-APPLIST-001
    public async getUserApplications(userId: number, limit?: number, offset?: number) {
        return applicationRepository.findByUserId(userId, { limit, offset });
    }

    // Maps to STK-APP-DASH-001..003 — dashboard aggregation with pending stages and unpaid payments
    public async getDashboardSummary(userId: number) {
        const applications = await applicationRepository.findByUserId(userId, {});
        const appsList = (applications as any).rows ?? applications;

        const pendingStages: any[] = [];
        const unpaidPayments: any[] = [];

        for (const app of appsList) {
            // Collect pending stages (active apps with a current stage)
            if (app.status === CONSTANTS.APPLICATION_STATUSES.ACTIVE && app.currentStageId) {
                const currentStage = await jobStageRepository.findById(app.currentStageId);
                pendingStages.push({
                    applicationId: app.id,
                    jobTitle: app.JobListing?.title,
                    stageId: app.currentStageId,
                    completionPercentage: app.completionPercentage,
                    requiresPayment: currentStage?.requiresPayment || false,
                    amount: currentStage?.amount,
                    currency: currentStage?.currency,
                    stageName: currentStage?.name,
                });
            }

            // STK-APP-DASH-001: current unpaid payments across all applications
            const payments = await paymentRepository.findAllAdmin({
                applicationId: app.id,
                status: CONSTANTS.PAYMENT_STATUSES.UNPAID,
            });
            const payList = (payments as any).rows ?? payments;
            unpaidPayments.push(...payList);
        }

        // STK-APP-DASH-001: full active job listings
        const activeJobs = await jobRepository.findAllActive({});

        return {
            pendingStages,      // STK-APP-DASH-001
            unpaidPayments,     // STK-APP-DASH-001
            activeJobs,         // STK-APP-DASH-001
            applicationCount: appsList.length,   // STK-APP-DASH-002
        };
    }

    // Maps to STK-ADM-APP-001, SCR-ADM-NEWAPPS-001
    public async getApplicationsByStatus(status: string, limit?: number, offset?: number) {
        return applicationRepository.findAllAdmin({ status, limit, offset });
    }

    // Maps to STK-ADM-APP-002, SCR-ADM-DRAFTS-001 — explicit draft filter
    public async getDraftApplications(limit?: number, offset?: number) {
        return applicationRepository.findAllAdmin({
            status: CONSTANTS.APPLICATION_STATUSES.DRAFT,
            limit,
            offset,
        });
    }

    // Maps to STK-APP-APPLY-002, SCR-APP-JOBAPPLY-001
    public async getApplicationDetails(id: number) {
        const app = await applicationRepository.findById(id);
        if (!app) throw new Error(CONSTANTS.ERROR_MESSAGES.RESOURCE_NOT_FOUND);
        return app;
    }

    // Maps to STK-APP-APPLY-001, TRUST-009 — Duplicate stages from JobTemplate to Application instance upfront
    public async startApplication(userId: number, jobId: number) {
        const t = await sequelize.transaction();
        try {
            const job = await jobRepository.findById(jobId, t);
            if (!job) throw new Error(CONSTANTS.ERROR_MESSAGES.RESOURCE_NOT_FOUND);

            // Clone template stages from job's stages JSON array
            const templateStages = job.stages || [];
            
            const newApp = await applicationRepository.create({
                userId,
                jobId,
                status: CONSTANTS.APPLICATION_STATUSES.ACTIVE,
                completionPercentage: 0,
                currentStageId: null
            }, t);

            let firstStageId: number | null = null;

            if (templateStages.length > 0) {
                for (const stage of templateStages) {
                    const clonedStage = await jobStageRepository.create({
                        applicationId: newApp.id,
                        name: stage.name,
                        description: stage.description,
                        orderPosition: stage.orderPosition || stage.order,
                        requiresPayment: stage.requiresPayment ?? stage.pay,
                        amount: stage.amount || stage.amt,
                        currency: stage.currency || 'USD',
                        instructions: stage.instructions,
                        deadlineDays: stage.deadlineDays,
                        notifyEmail: stage.notifyEmail ?? true,
                        notifyPush: stage.notifyPush ?? true
                    }, t);
                    
                    if (clonedStage.orderPosition === 1) {
                        firstStageId = clonedStage.id;
                    }
                }
                
                // DM-001: Set initial stage pointer
                await applicationRepository.update(newApp.id, { currentStageId: firstStageId }, t);
            }

            // DM-003: Immediate feedback on application start
            await notificationRepository.create({
                userId,
                subject: 'Application Started',
                message: `You have successfully started your application for "${job.title}".`,
                type: 'SYSTEM',
            }, t);

            await t.commit();
            return applicationRepository.findById(newApp.id);
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }

    // Maps to DM-001 (stage progress tracker), STK-APP-APPLY-005 (draft save & resume)
    public async advanceApplicationStage(applicationId: number) {
        const t = await sequelize.transaction();
        try {
            const app = await applicationRepository.findById(applicationId, t);
            if (!app) throw new Error(CONSTANTS.ERROR_MESSAGES.RESOURCE_NOT_FOUND);

            const stages = await jobStageRepository.findByApplicationId(applicationId, t);

            let nextStageId: number | null = null;
            let percentage = 100;
            let status = CONSTANTS.APPLICATION_STATUSES.COMPLETED;

            if (app.currentStageId) {
                const currentStageIndex = stages.rows.findIndex(s => s.id === app.currentStageId);
                if (currentStageIndex >= 0 && currentStageIndex < stages.rows.length - 1) {
                    nextStageId = stages.rows[currentStageIndex + 1].id;
                    // DM-001: exact completion percentage
                    percentage = Math.round(((currentStageIndex + 1) / stages.rows.length) * 100);
                    status = CONSTANTS.APPLICATION_STATUSES.ACTIVE;
                }
            }

            await applicationRepository.update(applicationId, {
                currentStageId: nextStageId,
                completionPercentage: percentage,
                status,
            }, t);
            
            const updatedApp = await applicationRepository.findById(applicationId, t);

            // Create unpaid payment record when next stage requires payment
            if (nextStageId) {
                const nextStage = stages.rows.find(s => s.id === nextStageId);
                if (nextStage && nextStage.requiresPayment) {
                    await paymentRepository.create({
                        applicationId,
                        stageId: nextStage.id,
                        status: CONSTANTS.PAYMENT_STATUSES.UNPAID,
                        amount: nextStage.amount,
                        currency: nextStage.currency,
                    }, t);
                }
            }

            // DM-007: Progress motivation on final stage completion
            if (status === CONSTANTS.APPLICATION_STATUSES.COMPLETED) {
                await notificationRepository.create({
                    userId: app.userId,
                    subject: 'Application Completed',
                    message: `Congratulations! Your application has successfully completed all ${stages.rows.length} stages.`,
                    type: 'SYSTEM',
                }, t);
            }

            await t.commit();
            return updatedApp;
        } catch (e) {
            await t.rollback();
            throw e;
        }
    }

    // New: Admin can inject ad-hoc stages into an application
    public async addStageToApplication(applicationId: number, stageData: any) {
        const t = await sequelize.transaction();
        try {
            const app = await applicationRepository.findById(applicationId, t);
            if (!app) throw new Error(CONSTANTS.ERROR_MESSAGES.RESOURCE_NOT_FOUND);

            const existingStages = await jobStageRepository.findByApplicationId(applicationId, t);
            const nextPosition = existingStages.rows.length > 0
                ? Math.max(...existingStages.rows.map(s => s.orderPosition)) + 1
                : 1;

            const newStage = await jobStageRepository.create({
                ...stageData,
                applicationId,
                orderPosition: stageData.orderPosition || nextPosition
            }, t);

            await t.commit();
            return newStage;
        } catch (e) {
            await t.rollback();
            throw e;
        }
    }

    public async getApplicationStage(stageId: number) {
        const stage = await jobStageRepository.findById(stageId);
        if (!stage) throw new Error(CONSTANTS.ERROR_MESSAGES.RESOURCE_NOT_FOUND);
        return stage;
    }

    public async updateApplicationStage(stageId: number, data: any) {
        const stage = await jobStageRepository.findById(stageId);
        if (!stage) throw new Error(CONSTANTS.ERROR_MESSAGES.RESOURCE_NOT_FOUND);
        await jobStageRepository.update(stageId, data);
        return jobStageRepository.findById(stageId);
    }

    public async deleteApplicationStage(stageId: number) {
        await jobStageRepository.delete(stageId);
    }
}

export const applicationService = new ApplicationService();
