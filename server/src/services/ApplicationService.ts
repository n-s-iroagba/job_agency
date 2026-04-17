import { sequelize } from '../config/database';
import { applicationRepository } from '../repositories/ApplicationRepository';
import { jobRepository } from '../repositories/JobRepository';
import { paymentRepository } from '../repositories/PaymentRepository';
import { jobStageRepository } from '../repositories/JobStageRepository';
import { notificationRepository } from '../repositories/NotificationRepository';
import { CONSTANTS } from '../constants';
import { sendEmail } from '../utils/email';

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
                const currentPaymentResult = await paymentRepository.findAllAdmin({
                    applicationId: app.id,
                    stageId: app.currentStageId,
                });
                const payment = currentPaymentResult.rows[0];

                pendingStages.push({
                    applicationId: app.id,
                    jobTitle: app.JobListing?.title,
                    jobCompany: app.JobListing?.company,
                    jobLocation: app.JobListing?.location,
                    jobSalary: app.JobListing?.salary,
                    stageId: app.currentStageId,
                    completionPercentage: app.completionPercentage,
                    requiresPayment: currentStage?.requiresPayment || false,
                    amount: currentStage?.amount,
                    currency: currentStage?.currency,
                    stageName: currentStage?.name,
                    stageDescription: currentStage?.description,
                    paymentStatus: payment?.status || 'Unpaid',
                });
            }

            // STK-APP-DASH-001: current unpaid payments across all applications
            const unpaidPaymentsResult = await paymentRepository.findAllAdmin({
                applicationId: app.id,
                status: CONSTANTS.PAYMENT_STATUSES.UNPAID,
            });
            unpaidPayments.push(...unpaidPaymentsResult.rows);
        }

        // Collect all payments for history
        const allPayments: any[] = [];
        for (const app of appsList) {
            const payments = await paymentRepository.findByApplicationId(app.id);
            allPayments.push(...payments);
        }

        const activeJobs = await jobRepository.findAllActive({ limit: 5 });

        return {
            pendingStages,      // STK-APP-DASH-001
            unpaidPayments,     // STK-APP-DASH-001
            allPayments,        // New: Support for full settlement history view
            activeJobs,         // STK-APP-DASH-001
            applicationCount: appsList.length,   // STK-APP-DASH-002
        };
    }

    // Maps to STK-ADM-APP-001, SCR-ADM-NEWAPPS-001
    public async getApplicationsByStatus(status: string, limit?: number, offset?: number, userId?: number) {
        return applicationRepository.findAllAdmin({ status, limit, offset, userId });
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

    // UPDATED: Only create "Credential Screening" on application start
    public async startApplication(userId: number, jobId: number) {
        const t = await sequelize.transaction();
        try {
            const job = await jobRepository.findById(jobId, t);
            if (!job) throw new Error(CONSTANTS.ERROR_MESSAGES.RESOURCE_NOT_FOUND);

            const newApp = await applicationRepository.create({
                userId,
                jobId,
                status: CONSTANTS.APPLICATION_STATUSES.ACTIVE,
                completionPercentage: 0,
                currentStageId: null
            }, t);

            // Create singular initial stage: Credential Screening
            const initialStage = await jobStageRepository.create({
                applicationId: newApp.id,
                name: 'Credential Screening',
                description: 'Initial verification of submitted talent credentials and documentation.',
                orderPosition: 1,
                requiresPayment: false,
                notifyEmail: true,
                notifyPush: true
            }, t);

            // Set initial stage pointer
            await applicationRepository.update(newApp.id, { 
                currentStageId: initialStage.id,
                completionPercentage: 10 // Start with some progress
            }, t);

            // Immediate feedback on application start
            await notificationRepository.create({
                userId,
                subject: 'Application Registered',
                message: `Your application for "${job.title}" has been successfully registered. Current Phase: Credential Screening.`,
                type: 'SYSTEM',
            }, t);

            await t.commit();
            return applicationRepository.findById(newApp.id);
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }

    // UPDATED: Support for conditional notification
    public async advanceApplicationStage(applicationId: number, shouldNotify: boolean = true) {
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

                // Notify if requested
                if (shouldNotify && nextStage) {
                    await notificationRepository.create({
                        userId: app.userId,
                        subject: 'Application Advanced',
                        message: `Your application has moved to the next phase: "${nextStage.name}".`,
                        type: 'SYSTEM',
                    }, t);
                }
            }

            // Progress motivation on final stage completion
            if (status === CONSTANTS.APPLICATION_STATUSES.COMPLETED) {
                await notificationRepository.create({
                    userId: app.userId,
                    subject: 'Application Completed',
                    message: `Congratulations! Your application has successfully completed all phases.`,
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

    // UPDATED: Support for immediate advancement, granular notification and payment auto-creation
    public async addStageToApplication(applicationId: number, stageData: any) {
        const t = await sequelize.transaction();
        try {
            const { notifyInApp, notifyEmail, setAsCurrent, ...rest } = stageData;
            
            const app = await applicationRepository.findById(applicationId, t);
            if (!app) throw new Error(CONSTANTS.ERROR_MESSAGES.RESOURCE_NOT_FOUND);

            const existingStages = await jobStageRepository.findByApplicationId(applicationId, t);
            const nextPosition = existingStages.rows.length > 0
                ? Math.max(...existingStages.rows.map(s => s.orderPosition)) + 1
                : 1;

            const newStage = await jobStageRepository.create({
                ...rest,
                applicationId,
                orderPosition: rest.orderPosition || nextPosition
            }, t);

            if (setAsCurrent) {
                await applicationRepository.update(applicationId, {
                    currentStageId: newStage.id,
                    status: CONSTANTS.APPLICATION_STATUSES.ACTIVE
                }, t);

                // Auto-create payment if required
                if (newStage.requiresPayment) {
                    await paymentRepository.create({
                        applicationId,
                        stageId: newStage.id,
                        status: CONSTANTS.PAYMENT_STATUSES.UNPAID,
                        amount: newStage.amount,
                        currency: newStage.currency,
                    }, t);
                }

                const nSubject = 'Process Activation';
                const nMessage = `A new phase has been activated for your application: "${newStage.name}".`;

                if (notifyInApp) {
                    await notificationRepository.create({
                        userId: app.userId,
                        subject: nSubject,
                        message: nMessage,
                        type: 'SYSTEM'
                    }, t);
                }

                if (notifyEmail) {
                    if (app.User?.email) {
                        await sendEmail(app.User.email, nSubject, `<p>${nMessage}</p>`);
                        console.log(`[ApplicationService] Email dispatch initiated for stage add: ${app.User.email}`);
                    } else {
                        console.log(`[ApplicationService] SKIP Email: User field missing or email empty for app ${applicationId}`);
                    }
                }
            }

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
        const { notifyInApp, notifyEmail, ...rest } = data;
        const stage = await jobStageRepository.findById(stageId);
        if (!stage) throw new Error(CONSTANTS.ERROR_MESSAGES.RESOURCE_NOT_FOUND);

        const app = await applicationRepository.findById(stage.applicationId);
        if (!app) throw new Error(CONSTANTS.ERROR_MESSAGES.RESOURCE_NOT_FOUND);

        await jobStageRepository.update(stageId, rest);
        const updatedStage = await jobStageRepository.findById(stageId);

        // If it's the current stage and requires payment, ensure payment record exists
        if (app.currentStageId === stageId && updatedStage?.requiresPayment) {
            const existingPayment = await paymentRepository.findAllAdmin({
                applicationId: app.id,
                stageId: stageId
            });
            if (existingPayment.count === 0) {
                await paymentRepository.create({
                    applicationId: app.id,
                    stageId: stageId,
                    status: CONSTANTS.PAYMENT_STATUSES.UNPAID,
                    amount: updatedStage.amount,
                    currency: updatedStage.currency,
                });
            }
        }

        const nSubject = 'Phase Update';
        const nMessage = `Details for your current phase "${updatedStage?.name}" have been updated by administration.`;

        if (notifyInApp) {
            await notificationRepository.create({
                userId: app.userId,
                subject: nSubject,
                message: nMessage,
                type: 'SYSTEM'
            });
        }

        if (notifyEmail) {
            if (app.User?.email) {
                await sendEmail(app.User.email, nSubject, `<p>${nMessage}</p>`);
                console.log(`[ApplicationService] Email dispatch initiated for stage update: ${app.User.email}`);
            } else {
                console.log(`[ApplicationService] SKIP Email: User field missing or email empty for app ${app.id}`);
            }
        }

        return updatedStage;
    }

    public async deleteApplicationStage(stageId: number) {
        await jobStageRepository.delete(stageId);
    }
}

export const applicationService = new ApplicationService();
