"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applicationService = exports.ApplicationService = void 0;
const database_1 = require("../config/database");
const ApplicationRepository_1 = require("../repositories/ApplicationRepository");
const JobRepository_1 = require("../repositories/JobRepository");
const PaymentRepository_1 = require("../repositories/PaymentRepository");
const JobStageRepository_1 = require("../repositories/JobStageRepository");
const NotificationRepository_1 = require("../repositories/NotificationRepository");
const constants_1 = require("../constants");
class ApplicationService {
    // Maps to STK-APP-APPLIST-001
    async getUserApplications(userId, limit, offset) {
        return ApplicationRepository_1.applicationRepository.findByUserId(userId, { limit, offset });
    }
    // Maps to STK-APP-DASH-001..003 — dashboard aggregation with pending stages and unpaid payments
    async getDashboardSummary(userId) {
        const applications = await ApplicationRepository_1.applicationRepository.findByUserId(userId, {});
        const appsList = applications.rows ?? applications;
        const pendingStages = [];
        const unpaidPayments = [];
        for (const app of appsList) {
            // Collect pending stages (active apps with a current stage)
            if (app.status === constants_1.CONSTANTS.APPLICATION_STATUSES.ACTIVE && app.currentStageId) {
                pendingStages.push({
                    applicationId: app.id,
                    jobTitle: app.JobListing?.title,
                    stageId: app.currentStageId,
                    completionPercentage: app.completionPercentage,
                });
            }
            // STK-APP-DASH-001: current unpaid payments across all applications
            const payments = await PaymentRepository_1.paymentRepository.findAllAdmin({
                applicationId: app.id,
                status: constants_1.CONSTANTS.PAYMENT_STATUSES.UNPAID,
            });
            const payList = payments.rows ?? payments;
            unpaidPayments.push(...payList);
        }
        // STK-APP-DASH-001: full active job listings
        const activeJobs = await JobRepository_1.jobRepository.findAllActive({});
        return {
            pendingStages, // STK-APP-DASH-001
            unpaidPayments, // STK-APP-DASH-001
            activeJobs, // STK-APP-DASH-001
            applicationCount: appsList.length, // STK-APP-DASH-002
        };
    }
    // Maps to STK-ADM-APP-001, SCR-ADM-NEWAPPS-001
    async getApplicationsByStatus(status, limit, offset) {
        return ApplicationRepository_1.applicationRepository.findAllAdmin({ status, limit, offset });
    }
    // Maps to STK-ADM-APP-002, SCR-ADM-DRAFTS-001 — explicit draft filter
    async getDraftApplications(limit, offset) {
        return ApplicationRepository_1.applicationRepository.findAllAdmin({
            status: constants_1.CONSTANTS.APPLICATION_STATUSES.DRAFT,
            limit,
            offset,
        });
    }
    // Maps to STK-APP-APPLY-002, SCR-APP-JOBAPPLY-001
    async getApplicationDetails(id) {
        const app = await ApplicationRepository_1.applicationRepository.findById(id);
        if (!app)
            throw new Error(constants_1.CONSTANTS.ERROR_MESSAGES.RESOURCE_NOT_FOUND);
        return app;
    }
    // Maps to STK-APP-APPLY-001, TRUST-009 — disclose all stages upfront before applicant commits
    async startApplication(userId, jobId) {
        const t = await database_1.sequelize.transaction();
        try {
            const job = await JobRepository_1.jobRepository.findById(jobId, t);
            if (!job)
                throw new Error(constants_1.CONSTANTS.ERROR_MESSAGES.RESOURCE_NOT_FOUND);
            const stages = await JobStageRepository_1.jobStageRepository.findByJobId(jobId, t);
            const firstStageId = stages.rows.length > 0 ? stages.rows[0].id : null;
            const newApp = await ApplicationRepository_1.applicationRepository.create({
                userId,
                jobId,
                currentStageId: firstStageId,
                status: constants_1.CONSTANTS.APPLICATION_STATUSES.DRAFT,
                completionPercentage: stages.rows.length === 0 ? 100 : 0,
            }, t);
            // If the first stage requires payment, create a pending payment record
            if (stages.rows.length > 0 && stages.rows[0].requiresPayment && firstStageId) {
                await PaymentRepository_1.paymentRepository.create({
                    applicationId: newApp.id,
                    stageId: firstStageId,
                    status: constants_1.CONSTANTS.PAYMENT_STATUSES.UNPAID,
                    amount: stages.rows[0].amount,
                    currency: stages.rows[0].currency,
                }, t);
            }
            // DM-003: Immediate feedback on application start
            await NotificationRepository_1.notificationRepository.create({
                userId,
                subject: 'Application Started',
                message: `You have successfully started your application for "${job.title}".`,
                type: 'SYSTEM',
            }, t);
            await t.commit();
            return newApp;
        }
        catch (error) {
            await t.rollback();
            throw error;
        }
    }
    // Maps to DM-001 (stage progress tracker), STK-APP-APPLY-005 (draft save & resume)
    async advanceApplicationStage(applicationId) {
        const t = await database_1.sequelize.transaction();
        try {
            const app = await ApplicationRepository_1.applicationRepository.findById(applicationId, t);
            if (!app)
                throw new Error(constants_1.CONSTANTS.ERROR_MESSAGES.RESOURCE_NOT_FOUND);
            const stages = await JobStageRepository_1.jobStageRepository.findByJobId(app.jobId, t);
            let nextStageId = null;
            let percentage = 100;
            let status = constants_1.CONSTANTS.APPLICATION_STATUSES.COMPLETED;
            if (app.currentStageId) {
                const currentStageIndex = stages.rows.findIndex(s => s.id === app.currentStageId);
                if (currentStageIndex >= 0 && currentStageIndex < stages.rows.length - 1) {
                    nextStageId = stages.rows[currentStageIndex + 1].id;
                    // DM-001: exact completion percentage
                    percentage = Math.round(((currentStageIndex + 1) / stages.rows.length) * 100);
                    status = constants_1.CONSTANTS.APPLICATION_STATUSES.ACTIVE;
                }
            }
            const [, updatedApps] = await ApplicationRepository_1.applicationRepository.update(applicationId, {
                currentStageId: nextStageId,
                completionPercentage: percentage,
                status,
            }, t);
            // Create unpaid payment record when next stage requires payment
            if (nextStageId) {
                const nextStage = stages.rows.find(s => s.id === nextStageId);
                if (nextStage && nextStage.requiresPayment) {
                    await PaymentRepository_1.paymentRepository.create({
                        applicationId,
                        stageId: nextStage.id,
                        status: constants_1.CONSTANTS.PAYMENT_STATUSES.UNPAID,
                        amount: nextStage.amount,
                        currency: nextStage.currency,
                    }, t);
                }
            }
            // DM-007: Progress motivation on final stage completion
            if (status === constants_1.CONSTANTS.APPLICATION_STATUSES.COMPLETED) {
                await NotificationRepository_1.notificationRepository.create({
                    userId: app.userId,
                    subject: 'Application Completed',
                    message: `Congratulations! Your application has successfully completed all ${stages.rows.length} stages.`,
                    type: 'SYSTEM',
                }, t);
            }
            await t.commit();
            return updatedApps[0];
        }
        catch (e) {
            await t.rollback();
            throw e;
        }
    }
}
exports.ApplicationService = ApplicationService;
exports.applicationService = new ApplicationService();
