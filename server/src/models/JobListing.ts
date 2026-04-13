import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';

export class JobListing extends Model {
    public id!: number;
    public title!: string;
    public description!: string;
    public location!: string;
    public employmentType!: string;
    public requirements!: string;
    public categoryId!: number;
    public isActive!: boolean;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

JobListing.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
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
