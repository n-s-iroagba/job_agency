import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';
import { CONSTANTS } from '../constants';

export class Application extends Model {
    declare id: number;
    declare userId: number;
    declare jobId: number;
    declare currentStageId: number | null;
    declare status: string;
    declare completionPercentage: number;
    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;
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
