import { Transaction } from 'sequelize';
import { JobBenefit } from '../models';

export class JobBenefitRepository {
    // Maps to STK-ADM-BEN-001, STK-ADM-BEN-004, SCR-ADM-BEN-001
    public async findAll(transaction?: Transaction): Promise<JobBenefit[]> {
        return JobBenefit.findAll({
            order: [['benefitType', 'ASC']],
            transaction
        });
    }

    public async findById(id: number, transaction?: Transaction): Promise<JobBenefit | null> {
        return JobBenefit.findByPk(id, { transaction });
    }

    // Maps to STK-ADM-BEN-001, STK-ADM-BEN-002, SCR-ADM-BENFORM-001
    public async create(data: any, transaction?: Transaction): Promise<JobBenefit> {
        return JobBenefit.create(data, { transaction });
    }

    // Maps to STK-ADM-BEN-001
    public async update(id: number, data: any, transaction?: Transaction): Promise<[number, JobBenefit[]]> {
        return JobBenefit.update(data, { where: { id }, returning: true, transaction });
    }

    // Maps to STK-ADM-BEN-001
    public async delete(id: number, transaction?: Transaction): Promise<void> {
        await JobBenefit.destroy({ where: { id }, transaction });
    }
}

export const jobBenefitRepository = new JobBenefitRepository();
