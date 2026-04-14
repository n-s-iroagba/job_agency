import { bankAccountRepository } from '../repositories/BankAccountRepository';
import { cryptoWalletRepository } from '../repositories/CryptoWalletRepository';
import { jobCategoryRepository } from '../repositories/JobCategoryRepository';
import { jobConditionRepository } from '../repositories/JobConditionRepository';
import { jobBenefitRepository } from '../repositories/JobBenefitRepository';
import { userRepository } from '../repositories/UserRepository';
import { notificationRepository } from '../repositories/NotificationRepository';
import { sendEmail } from '../utils/email';
import { sequelize } from '../config/database';
import { CONSTANTS } from '../constants';

export class AdminService {
    // ==========================
    // Health Monitoring — STK-ADM-HEALTH-001..003
    // ==========================
    public async getSystemHealth() {
        // STK-ADM-HEALTH-001: CPU, Memory, Uptime
        const memUsage = process.memoryUsage();
        let dbStatus = 'Connected';
        let poolInfo: any = {};

        try {
            await sequelize.authenticate();
            // STK-ADM-HEALTH-002: DB connection pool status
            poolInfo = {
                max: (sequelize as any).config?.pool?.max ?? 30,
                idle: (sequelize as any).config?.pool?.idle ?? 30000,
                acquire: (sequelize as any).config?.pool?.acquire ?? 10000,
            };
        } catch (e: any) {
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
    public async getFinancialConfigurations() {
        return {
            bankAccounts: await bankAccountRepository.findAll(),
            cryptoWallets: await cryptoWalletRepository.findAll(),
        };
    }

    public async getAllBankAccounts() { return bankAccountRepository.findAll(); }
    public async getAllCryptoWallets() { return cryptoWalletRepository.findAll(); }

    // STK-ADM-BANK-003: get bank account by amount threshold
    public async getBankAccountForAmount(amount: number) {
        const allAccounts = await bankAccountRepository.findAll();
        const type = amount >= CONSTANTS.SEED_DEFAULTS.HIGH_VALUE_THRESHOLD
            ? CONSTANTS.BANK_ACCOUNT_TYPES.NORMAL
            : CONSTANTS.BANK_ACCOUNT_TYPES.OPEN_BENEFICIARY;
        return (allAccounts as any[]).filter(a => a.accountType === type);
    }

    // Bank Account CRUD — STK-ADM-BANK-001
    public async createBankAccount(data: any) { return bankAccountRepository.create(data); }
    public async updateBankAccount(id: number, data: any) {
        const [updatedCount, accounts] = await bankAccountRepository.update(id, data);
        if (!updatedCount) throw new Error(CONSTANTS.ERROR_MESSAGES.RESOURCE_NOT_FOUND);
        return accounts[0];
    }
    public async deleteBankAccount(id: number) { await bankAccountRepository.delete(id); }

    // Crypto Wallet CRUD — STK-ADM-CRYPTO-001
    public async createCryptoWallet(data: any) { return cryptoWalletRepository.create(data); }
    public async updateCryptoWallet(id: number, data: any) {
        const [updatedCount, wallets] = await cryptoWalletRepository.update(id, data);
        if (!updatedCount) throw new Error(CONSTANTS.ERROR_MESSAGES.RESOURCE_NOT_FOUND);
        return wallets[0];
    }
    public async deleteCryptoWallet(id: number) { await cryptoWalletRepository.delete(id); }

    // Active crypto wallets for display — STK-ADM-CRYPTO-003
    public async getActiveCryptoWallets() {
        const all = await cryptoWalletRepository.findAll();
        return (all as any[]).filter(w => w.isActive);
    }

    // ==========================
    // Job Configurations
    // ==========================
    public async getJobConfigurations() {
        return {
            categories: await jobCategoryRepository.findAll(),
            conditions: await jobConditionRepository.findAll(),
            benefits: await jobBenefitRepository.findAll(),
        };
    }

    public async getAllCategories() { return jobCategoryRepository.findAll(); }
    public async getAllConditions() { return jobConditionRepository.findAll(); }
    public async getAllBenefits() { return jobBenefitRepository.findAll(); }

    // Category CRUD — STK-ADM-CAT-001
    public async createCategory(data: any) { return jobCategoryRepository.create(data); }
    public async updateCategory(id: number, data: any) {
        const [updatedCount, records] = await jobCategoryRepository.update(id, data);
        if (!updatedCount) throw new Error(CONSTANTS.ERROR_MESSAGES.RESOURCE_NOT_FOUND);
        return records[0];
    }
    public async deleteCategory(id: number) { await jobCategoryRepository.delete(id); }

    // Condition CRUD — STK-ADM-COND-001
    public async createCondition(data: any) { return jobConditionRepository.create(data); }
    public async updateCondition(id: number, data: any) {
        const [updatedCount, records] = await jobConditionRepository.update(id, data);
        if (!updatedCount) throw new Error(CONSTANTS.ERROR_MESSAGES.RESOURCE_NOT_FOUND);
        return records[0];
    }
    public async deleteCondition(id: number) { await jobConditionRepository.delete(id); }

    // Benefit CRUD — STK-ADM-BEN-001
    public async createBenefit(data: any) { return jobBenefitRepository.create(data); }
    public async updateBenefit(id: number, data: any) {
        const [updatedCount, records] = await jobBenefitRepository.update(id, data);
        if (!updatedCount) throw new Error(CONSTANTS.ERROR_MESSAGES.RESOURCE_NOT_FOUND);
        return records[0];
    }
    public async deleteBenefit(id: number) { await jobBenefitRepository.delete(id); }

    // ==========================
    // Admin Communication — STK-ADM-APP-003, STK-ADM-APP-004
    // ==========================
    public async sendMailToApplicant(
        applicantId: number,
        subject: string,
        message: string,
        sendPushNotification: boolean = false
    ) {
        const user = await userRepository.findById(applicantId);
        if (!user) throw new Error(CONSTANTS.ERROR_MESSAGES.RESOURCE_NOT_FOUND);

        // Send email — STK-ADM-APP-003
        await sendEmail((user as any).email, subject, `<p>${message}</p>`);

        // Optionally create push notification — STK-ADM-APP-004, TRUST-008
        if (sendPushNotification) {
            await notificationRepository.create({
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
    public async getAllApplicants(limit?: number, offset?: number) {
        return userRepository.findAndCountAll({ role: CONSTANTS.ROLES.APPLICANT, limit, offset });
    }
}

export const adminService = new AdminService();
