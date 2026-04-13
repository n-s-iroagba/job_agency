import { Request, Response } from 'express';
import { adminService } from '../services/AdminService';
import { CONSTANTS } from '../constants';

export class AdminController {
    // Maps to STK-ADM-HEALTH-001..003 — extended health metrics
    public async getHealth(req: Request, res: Response): Promise<void> {
        const health = await adminService.getSystemHealth();
        res.status(CONSTANTS.HTTP_STATUS.OK).json(health);
    }

    // ==========================
    // Financial Configurations — STK-ADM-BANK-001..004, STK-ADM-CRYPTO-001..003
    // ==========================
    public async getFinancialConfigs(req: Request, res: Response): Promise<void> {
        res.status(CONSTANTS.HTTP_STATUS.OK).json(await adminService.getFinancialConfigurations());
    }

    // STK-ADM-BANK-003: get bank accounts filtered by payment amount
    public async getBankAccountsForAmount(req: Request, res: Response): Promise<void> {
        const amount = parseFloat(req.query.amount as string);
        const accounts = await adminService.getBankAccountForAmount(amount);
        res.status(CONSTANTS.HTTP_STATUS.OK).json(accounts);
    }

    // STK-ADM-CRYPTO-003: active wallets for applicant display
    public async getActiveCryptoWallets(req: Request, res: Response): Promise<void> {
        const wallets = await adminService.getActiveCryptoWallets();
        res.status(CONSTANTS.HTTP_STATUS.OK).json(wallets);
    }

    // Bank Account CRUD — STK-ADM-BANK-001
    public async createBankAccount(req: Request, res: Response): Promise<void> {
        res.status(CONSTANTS.HTTP_STATUS.CREATED).json(await adminService.createBankAccount(req.body));
    }
    public async updateBankAccount(req: Request, res: Response): Promise<void> {
        res.status(CONSTANTS.HTTP_STATUS.OK).json(await adminService.updateBankAccount(parseInt(req.params.id as string, 10), req.body));
    }
    public async deleteBankAccount(req: Request, res: Response): Promise<void> {
        await adminService.deleteBankAccount(parseInt(req.params.id as string, 10));
        res.status(CONSTANTS.HTTP_STATUS.OK).json({ message: CONSTANTS.SUCCESS_MESSAGES.DELETED });
    }

    // Crypto Wallets CRUD — STK-ADM-CRYPTO-001
    public async createCryptoWallet(req: Request, res: Response): Promise<void> {
        res.status(CONSTANTS.HTTP_STATUS.CREATED).json(await adminService.createCryptoWallet(req.body));
    }
    public async updateCryptoWallet(req: Request, res: Response): Promise<void> {
        res.status(CONSTANTS.HTTP_STATUS.OK).json(await adminService.updateCryptoWallet(parseInt(req.params.id as string, 10), req.body));
    }
    public async deleteCryptoWallet(req: Request, res: Response): Promise<void> {
        await adminService.deleteCryptoWallet(parseInt(req.params.id as string, 10));
        res.status(CONSTANTS.HTTP_STATUS.OK).json({ message: CONSTANTS.SUCCESS_MESSAGES.DELETED });
    }

    // ==========================
    // Job Configurations — STK-ADM-CAT-001, STK-ADM-BEN-001, STK-ADM-COND-001
    // ==========================
    public async getJobConfigs(req: Request, res: Response): Promise<void> {
        res.status(CONSTANTS.HTTP_STATUS.OK).json(await adminService.getJobConfigurations());
    }

    // Categories — STK-ADM-CAT-001
    public async createCategory(req: Request, res: Response): Promise<void> {
        res.status(CONSTANTS.HTTP_STATUS.CREATED).json(await adminService.createCategory(req.body));
    }
    public async updateCategory(req: Request, res: Response): Promise<void> {
        res.status(CONSTANTS.HTTP_STATUS.OK).json(await adminService.updateCategory(parseInt(req.params.id as string, 10), req.body));
    }
    public async deleteCategory(req: Request, res: Response): Promise<void> {
        await adminService.deleteCategory(parseInt(req.params.id as string, 10));
        res.status(CONSTANTS.HTTP_STATUS.OK).json({ message: CONSTANTS.SUCCESS_MESSAGES.DELETED });
    }

    // Conditions — STK-ADM-COND-001
    public async createCondition(req: Request, res: Response): Promise<void> {
        res.status(CONSTANTS.HTTP_STATUS.CREATED).json(await adminService.createCondition(req.body));
    }
    public async updateCondition(req: Request, res: Response): Promise<void> {
        res.status(CONSTANTS.HTTP_STATUS.OK).json(await adminService.updateCondition(parseInt(req.params.id as string, 10), req.body));
    }
    public async deleteCondition(req: Request, res: Response): Promise<void> {
        await adminService.deleteCondition(parseInt(req.params.id as string, 10));
        res.status(CONSTANTS.HTTP_STATUS.OK).json({ message: CONSTANTS.SUCCESS_MESSAGES.DELETED });
    }

    // Benefits — STK-ADM-BEN-001
    public async createBenefit(req: Request, res: Response): Promise<void> {
        res.status(CONSTANTS.HTTP_STATUS.CREATED).json(await adminService.createBenefit(req.body));
    }
    public async updateBenefit(req: Request, res: Response): Promise<void> {
        res.status(CONSTANTS.HTTP_STATUS.OK).json(await adminService.updateBenefit(parseInt(req.params.id as string, 10), req.body));
    }
    public async deleteBenefit(req: Request, res: Response): Promise<void> {
        await adminService.deleteBenefit(parseInt(req.params.id as string, 10));
        res.status(CONSTANTS.HTTP_STATUS.OK).json({ message: CONSTANTS.SUCCESS_MESSAGES.DELETED });
    }

    // ==========================
    // Admin Communication — STK-ADM-APP-003, STK-ADM-APP-004
    // ==========================
    public async sendMailToApplicant(req: Request, res: Response): Promise<void> {
        try {
            const { applicantId, subject, message, sendPushNotification } = req.body;
            const result = await adminService.sendMailToApplicant(
                parseInt(applicantId, 10),
                subject,
                message,
                sendPushNotification ?? false
            );
            res.status(CONSTANTS.HTTP_STATUS.OK).json(result);
        } catch (error: any) {
            if (error.message === CONSTANTS.ERROR_MESSAGES.RESOURCE_NOT_FOUND) {
                res.status(CONSTANTS.HTTP_STATUS.NOT_FOUND).json({ error: error.message });
                return;
            }
            res.status(CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: CONSTANTS.ERROR_MESSAGES.INTERNAL_ERROR });
        }
    }

    // ==========================
    // User Views — REG-004
    // ==========================
    public async getAllApplicants(req: Request, res: Response): Promise<void> {
        try {
            const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;
            const offset = req.query.offset ? parseInt(req.query.offset as string, 10) : 0;
            const users = await adminService.getAllApplicants(limit, offset);
            res.status(CONSTANTS.HTTP_STATUS.OK).json(users);
        } catch (error) {
            res.status(CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: CONSTANTS.ERROR_MESSAGES.INTERNAL_ERROR });
        }
    }
}

export const adminController = new AdminController();
