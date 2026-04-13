import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import { CONSTANTS } from '../constants';

interface CryptoWalletAttributes {
    id: number;
    currencyName: string;
    networkType: string;
    walletAddress: string;
    memoTag?: string;
    isActive: boolean;
    displayLabel: string;
    createdAt?: Date;
    updatedAt?: Date;
}

interface CryptoWalletCreationAttributes extends Optional<CryptoWalletAttributes, 'id'> { }

export class CryptoWallet extends Model<CryptoWalletAttributes, CryptoWalletCreationAttributes> implements CryptoWalletAttributes {
    public id!: number;
    public currencyName!: string;
    public networkType!: string;
    public walletAddress!: string;
    public memoTag?: string;
    public isActive!: boolean;
    public displayLabel!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

CryptoWallet.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        currencyName: {
            type: DataTypes.ENUM(...(Object.values(CONSTANTS.CRYPTO_TYPES) as string[])),
            allowNull: false,
        },
        networkType: {
            type: DataTypes.ENUM(...(Object.values(CONSTANTS.CRYPTO_NETWORKS) as string[])),
            allowNull: false,
        },
        walletAddress: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        memoTag: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        displayLabel: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: 'crypto_wallets',
        timestamps: true,
    }
);
