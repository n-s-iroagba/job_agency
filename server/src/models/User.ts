import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';
import { CONSTANTS } from '../constants';

export class User extends Model {
    public id!: number;
    public fullName!: string;
    public email!: string;
    public passwordHash!: string;
    public role!: string;
    public preferences!: object;
    public isVerified!: boolean;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

User.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    fullName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    passwordHash: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.ENUM(CONSTANTS.ROLES.ADMIN, CONSTANTS.ROLES.APPLICANT),
        defaultValue: CONSTANTS.ROLES.APPLICANT,
        allowNull: false,
    },
    preferences: {
        type: DataTypes.JSONB,
        defaultValue: { pushNotifications: true, emailNotifications: true },
    },
    isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    }
}, {
    sequelize,
    tableName: 'users',
    timestamps: true,
});
