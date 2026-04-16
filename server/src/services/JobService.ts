import { jobRepository, FindJobsOptions } from '../repositories/JobRepository';
import { jobStageRepository } from '../repositories/JobStageRepository';
import { CONSTANTS } from '../constants';
import { sequelize } from '../config/database';
import { JobListing, Application, JobCategory } from '../models';

export class JobService {
    // Maps to STK-APP-DASH-001
    public async getActiveJobs(limit?: number, offset?: number, categoryId?: number, employmentType?: string, searchQuery?: string) {
        return jobRepository.findAllActive({ limit, offset, categoryId, employmentType, searchQuery });
    }

    // Maps to STK-ADM-JOB-004
    public async getAllJobsAdmin(options: FindJobsOptions = {}) {
        return jobRepository.findAllAdmin(options);
    }

    public async getJobStats() {
        const totalListing = await JobListing.count();
        const activeRoles = await JobListing.count({ where: { isActive: true } });
        const inReview = await JobListing.count({ where: { isActive: false } });
        const appVolume = await Application.count();
        const categoryCount = await JobCategory.count();

        return {
            totalListing,
            activeRoles,
            inReview,
            appVolume,
            categoryCount
        };
    }

    // Maps to STK-APP-APPLY-001
    public async getJobDetails(id: number) {
        const job = await jobRepository.findById(id);
        if (!job) throw new Error(CONSTANTS.ERROR_MESSAGES.RESOURCE_NOT_FOUND);
        return job;
    }

    // Maps to STK-ADM-JOB-001, STK-ADM-JOB-003
    public async createJob(jobData: any, benefitsIds: number[], conditionsIds: number[]) {
        const t = await sequelize.transaction();
        try {
            const job = await jobRepository.create(jobData, t);
            if (benefitsIds && benefitsIds.length > 0) await (job as any).setJobBenefits(benefitsIds, { transaction: t });
            if (conditionsIds && conditionsIds.length > 0) await (job as any).setJobConditions(conditionsIds, { transaction: t });
            await t.commit();
            return job;
        } catch (e) {
            await t.rollback();
            throw e;
        }
    }

    // Maps to STK-ADM-JOB-005
    public async updateJob(id: number, data: any, benefitsIds?: number[], conditionsIds?: number[]) {
        const t = await sequelize.transaction();
        try {
            let job = await jobRepository.findById(id, t);
            if (!job) throw new Error(CONSTANTS.ERROR_MESSAGES.RESOURCE_NOT_FOUND);
            
            await jobRepository.update(id, data, t);

            job = await jobRepository.findById(id, t);
            if (!job) throw new Error(CONSTANTS.ERROR_MESSAGES.RESOURCE_NOT_FOUND);

            if (benefitsIds) await (job as any).setJobBenefits(benefitsIds, { transaction: t });
            if (conditionsIds) await (job as any).setJobConditions(conditionsIds, { transaction: t });

            await t.commit();
            return job;
        } catch (e) {
            await t.rollback();
            throw e;
        }
    }

    public async deleteJob(id: number) {
        await jobRepository.delete(id);
    }

    // ==========================
    // Stage Configuration Sub-logic
    // ==========================

    // Maps to STK-ADM-STAGE-002, SCR-ADM-STAGEFORM-001
    public async createStage(jobId: number, data: any) {
        return jobStageRepository.create({ ...data, jobId });
    }

    public async getStagesByJob(jobId: number) {
        return jobStageRepository.findByJobId(jobId);
    }

    public async updateStage(stageId: number, data: any) {
        const stage = await jobStageRepository.findById(stageId);
        if (!stage) throw new Error(CONSTANTS.ERROR_MESSAGES.RESOURCE_NOT_FOUND);
        await jobStageRepository.update(stageId, data);
        return jobStageRepository.findById(stageId);
    }

    public async deleteStage(stageId: number) {
        await jobStageRepository.delete(stageId);
    }
}

export const jobService = new JobService();
