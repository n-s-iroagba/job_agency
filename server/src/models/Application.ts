import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';
import { CONSTANTS } from '../constants';

export class Application extends Model {
    public id!: number;
    public userId!: number;
    public jobId!: number;
    public currentStageId!: number | null;
    public status!: string;
    public completionPercentage!: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Application.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    jobId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    currentStageId: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    status: {
        type: DataTypes.ENUM(
            CONSTANTS.APPLICATION_STATUSES.DRAFT,
            CONSTANTS.APPLICATION_STATUSES.ACTIVE,
            CONSTANTS.APPLICATION_STATUSES.COMPLETED,
            CONSTANTS.APPLICATION_STATUSES.REJECTED
        ),
        defaultValue: CONSTANTS.APPLICATION_STATUSES.DRAFT,
    },
    completionPercentage: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    }
}, {
    sequelize,
    tableName: 'applications',
    timestamps: true,
});
