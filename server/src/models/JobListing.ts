import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';

export class JobListing extends Model {
    declare id: number;
    declare title: string;
    declare description: string;
    declare location: string;
    declare employmentType: string;
    declare requirements: string;
    declare categoryId: number;
    declare isActive: boolean;
    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;

}

JobListing.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    benefitIds: {
        type: DataTypes.JSON
    },
    conditionIds: {
        type: DataTypes.JSON
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    location: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    employmentType: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    requirements: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    }
}, {
    sequelize,
    tableName: 'job_listings',
    timestamps: true,
});
