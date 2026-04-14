"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jobService = exports.JobService = void 0;
const JobRepository_1 = require("../repositories/JobRepository");
const JobStageRepository_1 = require("../repositories/JobStageRepository");
const constants_1 = require("../constants");
const database_1 = require("../config/database");
class JobService {
    // Maps to STK-APP-DASH-001
    async getActiveJobs(limit, offset, categoryId, employmentType, searchQuery) {
        return JobRepository_1.jobRepository.findAllActive({ limit, offset, categoryId, employmentType, searchQuery });
    }
    // Maps to STK-ADM-JOB-004
    async getAllJobsAdmin(limit, offset) {
        return JobRepository_1.jobRepository.findAllAdmin({ limit, offset });
    }
    // Maps to STK-APP-APPLY-001
    async getJobDetails(id) {
        const job = await JobRepository_1.jobRepository.findById(id);
        if (!job)
            throw new Error(constants_1.CONSTANTS.ERROR_MESSAGES.RESOURCE_NOT_FOUND);
        return job;
    }
    // Maps to STK-ADM-JOB-001, STK-ADM-JOB-003
    async createJob(jobData, benefitsIds, conditionsIds) {
        const t = await database_1.sequelize.transaction();
        try {
            const job = await JobRepository_1.jobRepository.create(jobData, t);
            if (benefitsIds && benefitsIds.length > 0)
                await job.setJobBenefits(benefitsIds, { transaction: t });
            if (conditionsIds && conditionsIds.length > 0)
                await job.setJobConditions(conditionsIds, { transaction: t });
            await t.commit();
            return job;
        }
        catch (e) {
            await t.rollback();
            throw e;
        }
    }
    // Maps to STK-ADM-JOB-005
    async updateJob(id, data, benefitsIds, conditionsIds) {
        const t = await database_1.sequelize.transaction();
        try {
            const [updatedCount, updatedJobs] = await JobRepository_1.jobRepository.update(id, data, t);
            if (updatedCount === 0)
                throw new Error(constants_1.CONSTANTS.ERROR_MESSAGES.RESOURCE_NOT_FOUND);
            const job = updatedJobs[0];
            if (benefitsIds)
                await job.setJobBenefits(benefitsIds, { transaction: t });
            if (conditionsIds)
                await job.setJobConditions(conditionsIds, { transaction: t });
            await t.commit();
            return job;
        }
        catch (e) {
            await t.rollback();
            throw e;
        }
    }
    async deleteJob(id) {
        await JobRepository_1.jobRepository.delete(id);
    }
    // ==========================
    // Stage Configuration Sub-logic
    // ==========================
    // Maps to STK-ADM-STAGE-002, SCR-ADM-STAGEFORM-001
    async createStage(jobId, data) {
        return JobStageRepository_1.jobStageRepository.create({ ...data, jobId });
    }
    async getStagesByJob(jobId) {
        return JobStageRepository_1.jobStageRepository.findByJobId(jobId);
    }
    async updateStage(stageId, data) {
        const [updatedCount, stages] = await JobStageRepository_1.jobStageRepository.update(stageId, data);
        if (!updatedCount)
            throw new Error(constants_1.CONSTANTS.ERROR_MESSAGES.RESOURCE_NOT_FOUND);
        return stages[0];
    }
    async deleteStage(stageId) {
        await JobStageRepository_1.jobStageRepository.delete(stageId);
    }
}
exports.JobService = JobService;
exports.jobService = new JobService();
