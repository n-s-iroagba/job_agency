import { Request, Response } from 'express';
import { authService } from '../services/AuthService';
import { CONSTANTS } from '../constants';

export class AuthController {
    public async register(req: Request, res: Response): Promise<void> {
        try {
            const { user, token } = await authService.register(req.body);
            res.status(CONSTANTS.HTTP_STATUS.CREATED).json({
                message: CONSTANTS.SUCCESS_MESSAGES.REGISTER_SUCCESS,
                user: { id: user.id, email: user.email, role: user.role },
                token
            });
        } catch (error: any) {
            if (error.message === CONSTANTS.ERROR_MESSAGES.EMAIL_EXISTS) {
                res.status(CONSTANTS.HTTP_STATUS.BAD_REQUEST).json({ error: error.message });
                return;
            }
            res.status(CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: CONSTANTS.ERROR_MESSAGES.INTERNAL_ERROR });
        }
    }

    public async registerAdmin(req: Request, res: Response): Promise<void> {
        try {
            const { user, token } = await authService.registerAdmin(req.body);
            res.status(CONSTANTS.HTTP_STATUS.CREATED).json({
                message: CONSTANTS.SUCCESS_MESSAGES.REGISTER_SUCCESS,
                user: { id: user.id, email: user.email, role: user.role },
                token
            });
        } catch (error: any) {
            if (error.message === CONSTANTS.ERROR_MESSAGES.EMAIL_EXISTS) {
                res.status(CONSTANTS.HTTP_STATUS.BAD_REQUEST).json({ error: error.message });
                return;
            }
            res.status(CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: CONSTANTS.ERROR_MESSAGES.INTERNAL_ERROR });
        }
    }

    public async verifyEmail(req: Request, res: Response): Promise<void> {
        try {
            const { token } = req.query;
            await authService.verifyEmail(token as string);
            res.status(CONSTANTS.HTTP_STATUS.OK).json({
                message: CONSTANTS.SUCCESS_MESSAGES.VERIFY_SUCCESS
            });
        } catch (error: any) {
            res.status(CONSTANTS.HTTP_STATUS.BAD_REQUEST).json({ error: error.message });
        }
    }

    public async forgotPassword(req: Request, res: Response): Promise<void> {
        try {
            const { email } = req.body;
            await authService.forgotPassword(email);
            res.status(CONSTANTS.HTTP_STATUS.OK).json({
                message: CONSTANTS.SUCCESS_MESSAGES.FORGOT_PASSWORD_SUCCESS
            });
        } catch (error: any) {
            res.status(CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: CONSTANTS.ERROR_MESSAGES.INTERNAL_ERROR });
        }
    }

    public async resetPassword(req: Request, res: Response): Promise<void> {
        try {
            const { token, password } = req.body;
            await authService.resetPassword(token, password);
            res.status(CONSTANTS.HTTP_STATUS.OK).json({
                message: CONSTANTS.SUCCESS_MESSAGES.RESET_PASSWORD_SUCCESS
            });
        } catch (error: any) {
            res.status(CONSTANTS.HTTP_STATUS.BAD_REQUEST).json({ error: error.message });
        }
    }

    public async resendVerification(req: Request, res: Response): Promise<void> {
        try {
            const { email } = req.body;
            await authService.resendVerification(email);
            res.status(CONSTANTS.HTTP_STATUS.OK).json({
                message: 'Verification link resent successfully.'
            });
        } catch (error: any) {
            res.status(CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: CONSTANTS.ERROR_MESSAGES.INTERNAL_ERROR });
        }
    }

    public async login(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body;
            const { user, token } = await authService.login(email, password);

            res.status(CONSTANTS.HTTP_STATUS.OK).json({
                message: CONSTANTS.SUCCESS_MESSAGES.LOGIN_SUCCESS,
                user: { id: user.id, email: user.email, role: user.role },
                token
            });
        } catch (error: any) {
            if (error.message === CONSTANTS.ERROR_MESSAGES.INVALID_CREDENTIALS) {
                res.status(CONSTANTS.HTTP_STATUS.UNAUTHORIZED).json({ error: error.message });
                return;
            }
            if (error.message === CONSTANTS.ERROR_MESSAGES.EMAIL_NOT_VERIFIED) {
                res.status(CONSTANTS.HTTP_STATUS.FORBIDDEN).json({ error: error.message });
                return;
            }
            res.status(CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: CONSTANTS.ERROR_MESSAGES.INTERNAL_ERROR });
        }
    }
}

export const authController = new AuthController();
