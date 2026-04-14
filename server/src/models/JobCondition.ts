import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';

export class JobCondition extends Model {
    declare id: number;
    declare name: string;
    declare description: string;
    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;
}

JobCondition.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    }
}, {
    sequelize,
    tableName: 'job_conditions',
    timestamps: true,
});
