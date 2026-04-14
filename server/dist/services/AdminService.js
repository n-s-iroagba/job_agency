"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminService = exports.AdminService = void 0;
const BankAccountRepository_1 = require("../repositories/BankAccountRepository");
const CryptoWalletRepository_1 = require("../repositories/CryptoWalletRepository");
const JobCategoryRepository_1 = require("../repositories/JobCategoryRepository");
const JobConditionRepository_1 = require("../repositories/JobConditionRepository");
const JobBenefitRepository_1 = require("../repositories/JobBenefitRepository");
const UserRepository_1 = require("../repositories/UserRepository");
const NotificationRepository_1 = require("../repositories/NotificationRepository");
const email_1 = require("../utils/email");
const database_1 = require("../config/database");
const constants_1 = require("../constants");
class AdminService {
    // ==========================
    // Health Monitoring — STK-ADM-HEALTH-001..003
    // ==========================
    async getSystemHealth() {
        // STK-ADM-HEALTH-001: CPU, Memory, Uptime
        const memUsage = process.memoryUsage();
        let dbStatus = 'Connected';
        let poolInfo = {};
        try {
            await database_1.sequelize.authenticate();
            // STK-ADM-HEALTH-002: DB connection pool status
            poolInfo = {
                max: database_1.sequelize.config?.pool?.max ?? 30,
                idle: database_1.sequelize.config?.pool?.idle ?? 30000,
                acquire: database_1.sequelize.config?.pool?.acquire ?? 10000,
            };
        }
        catch (e) {
            dbStatus = `Disconnected: ${e.message}`;
        }
        return {
            // STK-ADM-HEALTH-001
            serverUptime: process.uptime(),
            memoryUsage: {
                heapUsedMb: Math.round(memUsage.heapUsed / 1024 / 1024),
                heapTotalMb: Math.round(memUsage.heapTotal / 1024 / 1024),
                rssMb: Math.round(memUsage.rss / 1024 / 1024),
            },
            // STK-ADM-HEALTH-002
            database: {
                status: dbStatus,
                pool: poolInfo,
            },
            timestamp: new Date().toISOString(),
        };
    }
    // ==========================
    // Financial Configurations
    // ==========================
    // STK-ADM-BANK-001, STK-ADM-CRYPTO-001 (Read)
    async getFinancialConfigurations() {
        const banks = await BankAccountRepository_1.bankAccountRepository.findAll();
        const wallets = await CryptoWalletRepository_1.cryptoWalletRepository.findAll();
        return {
            bankAccounts: banks.rows,
            cryptoWallets: wallets.rows,
        };
    }
    async getAllBankAccounts() { return BankAccountRepository_1.bankAccountRepository.findAll(); }
    async getAllCryptoWallets() { return CryptoWalletRepository_1.cryptoWalletRepository.findAll(); }
    // STK-ADM-BANK-003: get bank account by amount threshold
    async getBankAccountForAmount(amount) {
        const result = await BankAccountRepository_1.bankAccountRepository.findAll();
        const type = amount >= constants_1.CONSTANTS.SEED_DEFAULTS.HIGH_VALUE_THRESHOLD
            ? constants_1.CONSTANTS.BANK_ACCOUNT_TYPES.NORMAL
            : constants_1.CONSTANTS.BANK_ACCOUNT_TYPES.OPEN_BENEFICIARY;
        return result.rows.filter(a => a.accountType === type);
    }
    // Bank Account CRUD — STK-ADM-BANK-001
    async createBankAccount(data) { return BankAccountRepository_1.bankAccountRepository.create(data); }
    async updateBankAccount(id, data) {
        const [updatedCount, accounts] = await BankAccountRepository_1.bankAccountRepository.update(id, data);
        if (!updatedCount)
            throw new Error(constants_1.CONSTANTS.ERROR_MESSAGES.RESOURCE_NOT_FOUND);
        return accounts[0];
    }
    async deleteBankAccount(id) { await BankAccountRepository_1.bankAccountRepository.delete(id); }
    // Crypto Wallet CRUD — STK-ADM-CRYPTO-001
    async createCryptoWallet(data) { return CryptoWalletRepository_1.cryptoWalletRepository.create(data); }
    async updateCryptoWallet(id, data) {
        const [updatedCount, wallets] = await CryptoWalletRepository_1.cryptoWalletRepository.update(id, data);
        if (!updatedCount)
            throw new Error(constants_1.CONSTANTS.ERROR_MESSAGES.RESOURCE_NOT_FOUND);
        return wallets[0];
    }
    async deleteCryptoWallet(id) { await CryptoWalletRepository_1.cryptoWalletRepository.delete(id); }
    // Active crypto wallets for display — STK-ADM-CRYPTO-003
    async getActiveCryptoWallets() {
        const result = await CryptoWalletRepository_1.cryptoWalletRepository.findAll();
        return result.rows.filter(w => w.isActive);
    }
    // ==========================
    // Job Configurations
    // ==========================
    async getJobConfigurations() {
        const cats = await JobCategoryRepository_1.jobCategoryRepository.findAll();
        const conds = await JobConditionRepository_1.jobConditionRepository.findAll();
        const bens = await JobBenefitRepository_1.jobBenefitRepository.findAll();
        return {
            categories: cats.rows,
            conditions: conds.rows,
            benefits: bens.rows,
        };
    }
    async getAllCategories() { return JobCategoryRepository_1.jobCategoryRepository.findAll(); }
    async getAllConditions() { return JobConditionRepository_1.jobConditionRepository.findAll(); }
    async getAllBenefits() { return JobBenefitRepository_1.jobBenefitRepository.findAll(); }
    // Category CRUD — STK-ADM-CAT-001
    async createCategory(data) { return JobCategoryRepository_1.jobCategoryRepository.create(data); }
    async updateCategory(id, data) {
        const [updatedCount, records] = await JobCategoryRepository_1.jobCategoryRepository.update(id, data);
        if (!updatedCount)
            throw new Error(constants_1.CONSTANTS.ERROR_MESSAGES.RESOURCE_NOT_FOUND);
        return records[0];
    }
    async deleteCategory(id) { await JobCategoryRepository_1.jobCategoryRepository.delete(id); }
    // Condition CRUD — STK-ADM-COND-001
    async createCondition(data) { return JobConditionRepository_1.jobConditionRepository.create(data); }
    async updateCondition(id, data) {
        const [updatedCount, records] = await JobConditionRepository_1.jobConditionRepository.update(id, data);
        if (!updatedCount)
            throw new Error(constants_1.CONSTANTS.ERROR_MESSAGES.RESOURCE_NOT_FOUND);
        return records[0];
    }
    async deleteCondition(id) { await JobConditionRepository_1.jobConditionRepository.delete(id); }
    // Benefit CRUD — STK-ADM-BEN-001
    async createBenefit(data) { return JobBenefitRepository_1.jobBenefitRepository.create(data); }
    async updateBenefit(id, data) {
        const [updatedCount, records] = await JobBenefitRepository_1.jobBenefitRepository.update(id, data);
        if (!updatedCount)
            throw new Error(constants_1.CONSTANTS.ERROR_MESSAGES.RESOURCE_NOT_FOUND);
        return records[0];
    }
    async deleteBenefit(id) { await JobBenefitRepository_1.jobBenefitRepository.delete(id); }
    // ==========================
    // Admin Communication — STK-ADM-APP-003, STK-ADM-APP-004
    // ==========================
    async sendMailToApplicant(applicantId, subject, message, sendPushNotification = false) {
        const user = await UserRepository_1.userRepository.findById(applicantId);
        if (!user)
            throw new Error(constants_1.CONSTANTS.ERROR_MESSAGES.RESOURCE_NOT_FOUND);
        // Send email — STK-ADM-APP-003
        await (0, email_1.sendEmail)(user.email, subject, `<p>${message}</p>`);
        // Optionally create push notification — STK-ADM-APP-004, TRUST-008
        if (sendPushNotification) {
            await NotificationRepository_1.notificationRepository.create({
                userId: applicantId,
                subject,
                message,
                type: 'ADMIN',
            });
        }
        return { success: true };
    }
    // ==========================
    // User Management — REG-004 (right to data deletion)
    // ==========================
    async getAllApplicants(limit, offset) {
        return UserRepository_1.userRepository.findAndCountAll({ role: constants_1.CONSTANTS.ROLES.APPLICANT, limit, offset });
    }
}
exports.AdminService = AdminService;
exports.adminService = new AdminService();
