"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminController = exports.AdminController = void 0;
const AdminService_1 = require("../services/AdminService");
const constants_1 = require("../constants");
class AdminController {
    // Maps to STK-ADM-HEALTH-001..003 — extended health metrics
    async getHealth(req, res) {
        const health = await AdminService_1.adminService.getSystemHealth();
        res.status(constants_1.CONSTANTS.HTTP_STATUS.OK).json(health);
    }
    // ==========================
    // Financial Configurations — STK-ADM-BANK-001..004, STK-ADM-CRYPTO-001..003
    // ==========================
    async getFinancialConfigs(req, res) {
        res.status(constants_1.CONSTANTS.HTTP_STATUS.OK).json(await AdminService_1.adminService.getFinancialConfigurations());
    }
    async getAllBankAccounts(req, res) {
        res.status(constants_1.CONSTANTS.HTTP_STATUS.OK).json(await AdminService_1.adminService.getAllBankAccounts());
    }
    async getAllCryptoWallets(req, res) {
        res.status(constants_1.CONSTANTS.HTTP_STATUS.OK).json(await AdminService_1.adminService.getAllCryptoWallets());
    }
    // STK-ADM-BANK-003: get bank accounts filtered by payment amount
    async getBankAccountsForAmount(req, res) {
        const amount = parseFloat(req.query.amount);
        const accounts = await AdminService_1.adminService.getBankAccountForAmount(amount);
        res.status(constants_1.CONSTANTS.HTTP_STATUS.OK).json(accounts);
    }
    // STK-ADM-CRYPTO-003: active wallets for applicant display
    async getActiveCryptoWallets(req, res) {
        const wallets = await AdminService_1.adminService.getActiveCryptoWallets();
        res.status(constants_1.CONSTANTS.HTTP_STATUS.OK).json(wallets);
    }
    // Bank Account CRUD — STK-ADM-BANK-001
    async createBankAccount(req, res) {
        res.status(constants_1.CONSTANTS.HTTP_STATUS.CREATED).json(await AdminService_1.adminService.createBankAccount(req.body));
    }
    async updateBankAccount(req, res) {
        res.status(constants_1.CONSTANTS.HTTP_STATUS.OK).json(await AdminService_1.adminService.updateBankAccount(parseInt(req.params.id, 10), req.body));
    }
    async deleteBankAccount(req, res) {
        await AdminService_1.adminService.deleteBankAccount(parseInt(req.params.id, 10));
        res.status(constants_1.CONSTANTS.HTTP_STATUS.OK).json({ message: constants_1.CONSTANTS.SUCCESS_MESSAGES.DELETED });
    }
    // Crypto Wallets CRUD — STK-ADM-CRYPTO-001
    async createCryptoWallet(req, res) {
        res.status(constants_1.CONSTANTS.HTTP_STATUS.CREATED).json(await AdminService_1.adminService.createCryptoWallet(req.body));
    }
    async updateCryptoWallet(req, res) {
        res.status(constants_1.CONSTANTS.HTTP_STATUS.OK).json(await AdminService_1.adminService.updateCryptoWallet(parseInt(req.params.id, 10), req.body));
    }
    async deleteCryptoWallet(req, res) {
        await AdminService_1.adminService.deleteCryptoWallet(parseInt(req.params.id, 10));
        res.status(constants_1.CONSTANTS.HTTP_STATUS.OK).json({ message: constants_1.CONSTANTS.SUCCESS_MESSAGES.DELETED });
    }
    // ==========================
    // Job Configurations — STK-ADM-CAT-001, STK-ADM-BEN-001, STK-ADM-COND-001
    // ==========================
    async getJobConfigs(req, res) {
        res.status(constants_1.CONSTANTS.HTTP_STATUS.OK).json(await AdminService_1.adminService.getJobConfigurations());
    }
    async getAllCategories(req, res) {
        res.status(constants_1.CONSTANTS.HTTP_STATUS.OK).json(await AdminService_1.adminService.getAllCategories());
    }
    async getAllConditions(req, res) {
        res.status(constants_1.CONSTANTS.HTTP_STATUS.OK).json(await AdminService_1.adminService.getAllConditions());
    }
    async getAllBenefits(req, res) {
        res.status(constants_1.CONSTANTS.HTTP_STATUS.OK).json(await AdminService_1.adminService.getAllBenefits());
    }
    // Categories — STK-ADM-CAT-001
    async createCategory(req, res) {
        res.status(constants_1.CONSTANTS.HTTP_STATUS.CREATED).json(await AdminService_1.adminService.createCategory(req.body));
    }
    async updateCategory(req, res) {
        res.status(constants_1.CONSTANTS.HTTP_STATUS.OK).json(await AdminService_1.adminService.updateCategory(parseInt(req.params.id, 10), req.body));
    }
    async deleteCategory(req, res) {
        await AdminService_1.adminService.deleteCategory(parseInt(req.params.id, 10));
        res.status(constants_1.CONSTANTS.HTTP_STATUS.OK).json({ message: constants_1.CONSTANTS.SUCCESS_MESSAGES.DELETED });
    }
    // Conditions — STK-ADM-COND-001
    async createCondition(req, res) {
        res.status(constants_1.CONSTANTS.HTTP_STATUS.CREATED).json(await AdminService_1.adminService.createCondition(req.body));
    }
    async updateCondition(req, res) {
        res.status(constants_1.CONSTANTS.HTTP_STATUS.OK).json(await AdminService_1.adminService.updateCondition(parseInt(req.params.id, 10), req.body));
    }
    async deleteCondition(req, res) {
        await AdminService_1.adminService.deleteCondition(parseInt(req.params.id, 10));
        res.status(constants_1.CONSTANTS.HTTP_STATUS.OK).json({ message: constants_1.CONSTANTS.SUCCESS_MESSAGES.DELETED });
    }
    // Benefits — STK-ADM-BEN-001
    async createBenefit(req, res) {
        res.status(constants_1.CONSTANTS.HTTP_STATUS.CREATED).json(await AdminService_1.adminService.createBenefit(req.body));
    }
    async updateBenefit(req, res) {
        res.status(constants_1.CONSTANTS.HTTP_STATUS.OK).json(await AdminService_1.adminService.updateBenefit(parseInt(req.params.id, 10), req.body));
    }
    async deleteBenefit(req, res) {
        await AdminService_1.adminService.deleteBenefit(parseInt(req.params.id, 10));
        res.status(constants_1.CONSTANTS.HTTP_STATUS.OK).json({ message: constants_1.CONSTANTS.SUCCESS_MESSAGES.DELETED });
    }
    // ==========================
    // Admin Communication — STK-ADM-APP-003, STK-ADM-APP-004
    // ==========================
    async sendMailToApplicant(req, res) {
        try {
            const { applicantId, subject, message, sendPushNotification } = req.body;
            const result = await AdminService_1.adminService.sendMailToApplicant(parseInt(applicantId, 10), subject, message, sendPushNotification ?? false);
            res.status(constants_1.CONSTANTS.HTTP_STATUS.OK).json(result);
        }
        catch (error) {
            if (error.message === constants_1.CONSTANTS.ERROR_MESSAGES.RESOURCE_NOT_FOUND) {
                res.status(constants_1.CONSTANTS.HTTP_STATUS.NOT_FOUND).json({ error: error.message });
                return;
            }
            res.status(constants_1.CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: constants_1.CONSTANTS.ERROR_MESSAGES.INTERNAL_ERROR });
        }
    }
    // ==========================
    // User Views — REG-004
    // ==========================
    async getAllApplicants(req, res) {
        try {
            const limit = req.query.limit ? parseInt(req.query.limit, 10) : 20;
            const offset = req.query.offset ? parseInt(req.query.offset, 10) : 0;
            const users = await AdminService_1.adminService.getAllApplicants(limit, offset);
            res.status(constants_1.CONSTANTS.HTTP_STATUS.OK).json(users);
        }
        catch (error) {
            res.status(constants_1.CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: constants_1.CONSTANTS.ERROR_MESSAGES.INTERNAL_ERROR });
        }
    }
}
exports.AdminController = AdminController;
exports.adminController = new AdminController();
