import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';

export class Notification extends Model {
    public id!: number;
    public userId!: number;
    public subject!: string;
    public message!: string;
    public isRead!: boolean;
    public type!: string; // e.g.EMAIL, PUSH
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Notification.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    subject: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    isRead: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    type: {
        type: DataTypes.STRING,
        defaultValue: 'SYSTEM',
    }
}, {
    sequelize,
    tableName: 'notifications',
    timestamps: true,
});
