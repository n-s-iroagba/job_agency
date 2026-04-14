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
                pendingStages.push({
                    applicationId: app.id,
                    jobTitle: app.JobListing?.title,
                    stageId: app.currentStageId,
                    completionPercentage: app.completionPercentage,
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

    // Maps to STK-APP-APPLY-001, TRUST-009 — disclose all stages upfront before applicant commits
    public async startApplication(userId: number, jobId: number) {
        const t = await sequelize.transaction();
        try {
            const job = await jobRepository.findById(jobId, t);
            if (!job) throw new Error(CONSTANTS.ERROR_MESSAGES.RESOURCE_NOT_FOUND);

            const stages = await jobStageRepository.findByJobId(jobId, t);
            const firstStageId = stages.rows.length > 0 ? stages.rows[0].id : null;

            const newApp = await applicationRepository.create({
                userId,
                jobId,
                currentStageId: firstStageId,
                status: CONSTANTS.APPLICATION_STATUSES.DRAFT,
                completionPercentage: stages.rows.length === 0 ? 100 : 0,
            }, t);

            // If the first stage requires payment, create a pending payment record
            if (stages.rows.length > 0 && stages.rows[0].requiresPayment && firstStageId) {
                await paymentRepository.create({
                    applicationId: newApp.id,
                    stageId: firstStageId,
                    status: CONSTANTS.PAYMENT_STATUSES.UNPAID,
                    amount: stages.rows[0].amount,
                    currency: stages.rows[0].currency,
                }, t);
            }

            // DM-003: Immediate feedback on application start
            await notificationRepository.create({
                userId,
                subject: 'Application Started',
                message: `You have successfully started your application for "${job.title}".`,
                type: 'SYSTEM',
            }, t);

            await t.commit();
            return newApp;
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

            const stages = await jobStageRepository.findByJobId(app.jobId, t);

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

            const [, updatedApps] = await applicationRepository.update(applicationId, {
                currentStageId: nextStageId,
                completionPercentage: percentage,
                status,
            }, t);

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
            return updatedApps[0];
        } catch (e) {
            await t.rollback();
            throw e;
        }
    }
}

export const applicationService = new ApplicationService();
