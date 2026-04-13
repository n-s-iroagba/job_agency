import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';

export class JobBenefit extends Model {
    public id!: number;
    public benefitType!: string;
    public description!: string;
    public value!: string | null;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

JobBenefit.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    benefitType: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    value: {
        type: DataTypes.STRING,
        allowNull: true,
    }
}, {
    sequelize,
    tableName: 'job_benefits',
    timestamps: true,
});
