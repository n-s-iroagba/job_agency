import { Transaction, Op } from 'sequelize';
import { JobListing, JobCategory, JobBenefit, JobCondition, JobStage } from '../models';

export interface FindJobsOptions {
    limit?: number;
    offset?: number;
    categoryId?: number;
    employmentType?: string;
    searchQuery?: string;
}

export class JobRepository {
    // Maps to STK-APP-DASH-001, STK-ADM-JOB-004
    public async findAllActive(options: FindJobsOptions = {}): Promise<{ rows: JobListing[]; count: number }> {
        const whereClause: any = { isActive: true };

        if (options.categoryId) whereClause.categoryId = options.categoryId;
        if (options.employmentType) whereClause.employmentType = options.employmentType;
        if (options.searchQuery) {
            whereClause[Op.or] = [
                { title: { [Op.like]: `%${options.searchQuery}%` } },
                { location: { [Op.like]: `%${options.searchQuery}%` } }
            ];
        }

        return JobListing.findAndCountAll({
            where: whereClause,
            limit: options.limit || 10,
            offset: options.offset || 0,
            include: [JobCategory, JobBenefit, JobCondition, JobStage],
            order: [['createdAt', 'DESC']]
        });
    }

    // Maps to STK-ADM-JOB-001, NFR-PERF-004
    public async findAllAdmin(options: FindJobsOptions = {}): Promise<{ rows: JobListing[]; count: number }> {
        return JobListing.findAndCountAll({
            limit: options.limit || 20,
            offset: options.offset || 0,
            include: [JobCategory],
            order: [['createdAt', 'DESC']]
        });
    }

    // Maps to STK-APP-APPLY-001, STK-APP-PAY-001
    public async findById(id: number, transaction?: Transaction): Promise<JobListing | null> {
        return JobListing.findByPk(id, {
            include: [JobCategory, JobBenefit, JobCondition, {
                model: JobStage,
                order: [['orderPosition', 'ASC']]
            }],
            transaction
        });
    }

    // Maps to STK-ADM-JOB-001, STK-ADM-JOB-003, NFR-SEC-009
    public async create(jobData: any, transaction?: Transaction): Promise<JobListing> {
        return JobListing.create(jobData, { transaction });
    }

    // Maps to STK-ADM-JOB-001, STK-ADM-JOB-005
    public async update(id: number, updateData: any, transaction?: Transaction): Promise<[number, JobListing[]]> {
        return JobListing.update(updateData, { where: { id }, returning: true, transaction });
    }

    // Maps to STK-ADM-JOB-001
    public async delete(id: number, transaction?: Transaction): Promise<void> {
        await JobListing.destroy({ where: { id }, transaction });
    }
}

export const jobRepository = new JobRepository();
