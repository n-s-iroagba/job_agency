import { Transaction } from 'sequelize';
import { JobStage } from '../models';

export class JobStageRepository {
    // Maps to STK-ADM-STAGE-001, STK-ADM-STAGE-005, SCR-ADM-STAGE-001
    public async findByJobId(jobId: number, transaction?: Transaction): Promise<JobStage[]> {
        return JobStage.findAll({
            where: { jobId },
            order: [['orderPosition', 'ASC']],
            transaction
        });
    }

    public async findById(id: number, transaction?: Transaction): Promise<JobStage | null> {
        return JobStage.findByPk(id, { transaction });
    }

    // Maps to STK-ADM-STAGE-001, STK-ADM-STAGE-002, SCR-ADM-STAGEFORM-001
    public async create(data: any, transaction?: Transaction): Promise<JobStage> {
        return JobStage.create(data, { transaction });
    }

    // Maps to STK-ADM-STAGE-001, STK-ADM-STAGE-003, STK-ADM-STAGE-004
    public async update(id: number, data: any, transaction?: Transaction): Promise<[number, JobStage[]]> {
        return JobStage.update(data, { where: { id }, returning: true, transaction });
    }

    // Maps to STK-ADM-STAGE-001
    public async delete(id: number, transaction?: Transaction): Promise<void> {
        await JobStage.destroy({ where: { id }, transaction });
    }
}

export const jobStageRepository = new JobStageRepository();
