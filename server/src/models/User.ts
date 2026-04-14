import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';
import { CONSTANTS } from '../constants';

export class User extends Model {
    declare id: number;
    declare fullName: string;
    declare email: string;
    declare passwordHash: string;
    declare role: string;
    declare preferences: object;
    declare isVerified: boolean;
    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;
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
        type: DataTypes.JSON,
        allowNull: true,
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
