import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';

export class JobStage extends Model {
    public id!: number;
    public jobId!: number;
    public name!: string;
    public description!: string;
    public orderPosition!: number;
    public requiresPayment!: boolean;
    public amount!: number | null;
    public currency!: string | null;
    public instructions!: string | null;
    public deadlineDays!: number | null;
    public notifyEmail!: boolean;
    public notifyPush!: boolean;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

JobStage.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    jobId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    orderPosition: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    requiresPayment: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
    },
    currency: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    instructions: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    deadlineDays: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    notifyEmail: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    notifyPush: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    }
}, {
    sequelize,
    tableName: 'job_stages',
    timestamps: true,
});
