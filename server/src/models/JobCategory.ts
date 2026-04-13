import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';

export class JobCategory extends Model {
    public id!: number;
    public name!: string;
    public description!: string | null;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

JobCategory.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    }
}, {
    sequelize,
    tableName: 'job_categories',
    timestamps: true,
});
