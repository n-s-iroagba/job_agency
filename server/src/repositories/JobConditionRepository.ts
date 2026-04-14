import { Transaction } from 'sequelize';
import { JobCondition } from '../models';

export class JobConditionRepository {
    // Maps to STK-ADM-COND-001, STK-ADM-COND-003, SCR-ADM-COND-001
    public async findAll(transaction?: Transaction): Promise<{ rows: JobCondition[], count: number }> {
        return JobCondition.findAndCountAll({
            order: [['name', 'ASC']],
            transaction
        });
    }

    public async findById(id: number, transaction?: Transaction): Promise<JobCondition | null> {
        return JobCondition.findByPk(id, { transaction });
    }

    // Maps to STK-ADM-COND-001, STK-ADM-COND-002, SCR-ADM-CONDFORM-001
    public async create(data: any, transaction?: Transaction): Promise<JobCondition> {
        return JobCondition.create(data, { transaction });
    }

    // Maps to STK-ADM-COND-001
    public async update(id: number, data: any, transaction?: Transaction): Promise<[number, JobCondition[]]> {
        return JobCondition.update(data, { where: { id }, returning: true, transaction });
    }

    // Maps to STK-ADM-COND-001
    public async delete(id: number, transaction?: Transaction): Promise<void> {
        await JobCondition.destroy({ where: { id }, transaction });
    }
}

export const jobConditionRepository = new JobConditionRepository();
