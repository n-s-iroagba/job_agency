"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jobBenefitRepository = exports.JobBenefitRepository = void 0;
const models_1 = require("../models");
class JobBenefitRepository {
    // Maps to STK-ADM-BEN-001, STK-ADM-BEN-004, SCR-ADM-BEN-001
    async findAll(transaction) {
        return models_1.JobBenefit.findAndCountAll({
            order: [['benefitType', 'ASC']],
            transaction
        });
    }
    async findById(id, transaction) {
        return models_1.JobBenefit.findByPk(id, { transaction });
    }
    // Maps to STK-ADM-BEN-001, STK-ADM-BEN-002, SCR-ADM-BENFORM-001
    async create(data, transaction) {
        return models_1.JobBenefit.create(data, { transaction });
    }
    // Maps to STK-ADM-BEN-001
    async update(id, data, transaction) {
        return models_1.JobBenefit.update(data, { where: { id }, returning: true, transaction });
    }
    // Maps to STK-ADM-BEN-001
    async delete(id, transaction) {
        await models_1.JobBenefit.destroy({ where: { id }, transaction });
    }
}
exports.JobBenefitRepository = JobBenefitRepository;
exports.jobBenefitRepository = new JobBenefitRepository();
