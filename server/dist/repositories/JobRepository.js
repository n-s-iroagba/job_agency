"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jobRepository = exports.JobRepository = void 0;
const sequelize_1 = require("sequelize");
const models_1 = require("../models");
class JobRepository {
    // Maps to STK-APP-DASH-001, STK-ADM-JOB-004
    async findAllActive(options = {}) {
        const whereClause = { isActive: true };
        if (options.categoryId)
            whereClause.categoryId = options.categoryId;
        if (options.employmentType)
            whereClause.employmentType = options.employmentType;
        if (options.searchQuery) {
            whereClause[sequelize_1.Op.or] = [
                { title: { [sequelize_1.Op.like]: `%${options.searchQuery}%` } },
                { location: { [sequelize_1.Op.like]: `%${options.searchQuery}%` } }
            ];
        }
        return models_1.JobListing.findAndCountAll({
            where: whereClause,
            limit: options.limit || 10,
            offset: options.offset || 0,
            include: [models_1.JobCategory, models_1.JobBenefit, models_1.JobCondition, models_1.JobStage],
            order: [['createdAt', 'DESC']]
        });
    }
    // Maps to STK-ADM-JOB-001, NFR-PERF-004
    async findAllAdmin(options = {}) {
        return models_1.JobListing.findAndCountAll({
            limit: options.limit || 20,
            offset: options.offset || 0,
            include: [models_1.JobCategory],
            order: [['createdAt', 'DESC']]
        });
    }
    // Maps to STK-APP-APPLY-001, STK-APP-PAY-001
    async findById(id, transaction) {
        return models_1.JobListing.findByPk(id, {
            include: [models_1.JobCategory, models_1.JobBenefit, models_1.JobCondition, {
                    model: models_1.JobStage,
                    order: [['orderPosition', 'ASC']]
                }],
            transaction
        });
    }
    // Maps to STK-ADM-JOB-001, STK-ADM-JOB-003, NFR-SEC-009
    async create(jobData, transaction) {
        return models_1.JobListing.create(jobData, { transaction });
    }
    // Maps to STK-ADM-JOB-001, STK-ADM-JOB-005
    async update(id, updateData, transaction) {
        return models_1.JobListing.update(updateData, { where: { id }, returning: true, transaction });
    }
    // Maps to STK-ADM-JOB-001
    async delete(id, transaction) {
        await models_1.JobListing.destroy({ where: { id }, transaction });
    }
}
exports.JobRepository = JobRepository;
exports.jobRepository = new JobRepository();
