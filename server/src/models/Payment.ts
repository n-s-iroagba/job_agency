import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';
import { CONSTANTS } from '../constants';

export class Payment extends Model {
    public id!: number;
    public applicationId!: number;
    public stageId!: number;
    public status!: string;
    public amount!: number;
    public currency!: string;
    public proofUrl!: string | null;
    public adminNote!: string | null;
    public verifiedById!: number | null;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Payment.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    applicationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    stageId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM(
            CONSTANTS.PAYMENT_STATUSES.PENDING,
            CONSTANTS.PAYMENT_STATUSES.VERIFIED,
            CONSTANTS.PAYMENT_STATUSES.REJECTED,
            CONSTANTS.PAYMENT_STATUSES.PAID,
            CONSTANTS.PAYMENT_STATUSES.UNPAID
        ),
        defaultValue: CONSTANTS.PAYMENT_STATUSES.UNPAID,
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    currency: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    proofUrl: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    adminNote: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    verifiedById: {
        type: DataTypes.INTEGER,
        allowNull: true,
    }
}, {
    sequelize,
    tableName: 'payments',
    timestamps: true,
});
