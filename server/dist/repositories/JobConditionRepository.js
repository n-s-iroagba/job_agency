"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jobConditionRepository = exports.JobConditionRepository = void 0;
const models_1 = require("../models");
class JobConditionRepository {
    // Maps to STK-ADM-COND-001, STK-ADM-COND-003, SCR-ADM-COND-001
    async findAll(transaction) {
        return models_1.JobCondition.findAndCountAll({
            order: [['name', 'ASC']],
            transaction
        });
    }
    async findById(id, transaction) {
        return models_1.JobCondition.findByPk(id, { transaction });
    }
    // Maps to STK-ADM-COND-001, STK-ADM-COND-002, SCR-ADM-CONDFORM-001
    async create(data, transaction) {
        return models_1.JobCondition.create(data, { transaction });
    }
    // Maps to STK-ADM-COND-001
    async update(id, data, transaction) {
        return models_1.JobCondition.update(data, { where: { id }, returning: true, transaction });
    }
    // Maps to STK-ADM-COND-001
    async delete(id, transaction) {
        await models_1.JobCondition.destroy({ where: { id }, transaction });
    }
}
exports.JobConditionRepository = JobConditionRepository;
exports.jobConditionRepository = new JobConditionRepository();
