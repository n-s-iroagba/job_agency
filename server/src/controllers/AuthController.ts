import { Request, Response } from 'express';
import { authService } from '../services/AuthService';
import { CONSTANTS } from '../constants';

export class AuthController {
    public async register(req: Request, res: Response): Promise<void> {
        try {
            const { user, accessToken, refreshToken } = await authService.register(req.body);
            this.setRefreshTokenCookie(res, refreshToken);
            res.status(CONSTANTS.HTTP_STATUS.CREATED).json({
                message: CONSTANTS.SUCCESS_MESSAGES.REGISTER_SUCCESS,
                user: { id: user.id, email: user.email, role: user.role, fullName: user.fullName },
                accessToken
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
            const { user, accessToken, refreshToken } = await authService.registerAdmin(req.body);
            this.setRefreshTokenCookie(res, refreshToken);
            res.status(CONSTANTS.HTTP_STATUS.CREATED).json({
                message: CONSTANTS.SUCCESS_MESSAGES.REGISTER_SUCCESS,
                user: { id: user.id, email: user.email, role: user.role, fullName: user.fullName },
                accessToken
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
            const { user, accessToken, refreshToken } = await authService.login(email, password);

            this.setRefreshTokenCookie(res, refreshToken);
            res.status(CONSTANTS.HTTP_STATUS.OK).json({
                message: CONSTANTS.SUCCESS_MESSAGES.LOGIN_SUCCESS,
                user: { id: user.id, email: user.email, role: user.role, fullName: user.fullName },
                accessToken
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

    public async refresh(req: Request, res: Response): Promise<void> {
        try {
            const refreshToken = req.cookies.refreshToken;
            if (!refreshToken) {
                res.status(CONSTANTS.HTTP_STATUS.UNAUTHORIZED).json({ error: 'Refresh token missing' });
                return;
            }

            const { accessToken, refreshToken: newRefreshToken } = await authService.refresh(refreshToken);
            this.setRefreshTokenCookie(res, newRefreshToken);
            res.status(CONSTANTS.HTTP_STATUS.OK).json({ accessToken });
        } catch (error: any) {
            res.status(CONSTANTS.HTTP_STATUS.UNAUTHORIZED).json({ error: error.message });
        }
    }

    public async getMe(req: Request, res: Response): Promise<void> {
        try {
            // req.user is populated by requireAuth middleware
            const userId = (req as any).user.id;
            const user = await authService.getMe(userId);
            res.status(CONSTANTS.HTTP_STATUS.OK).json({
                user: {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                    fullName: user.fullName
                }
            });
        } catch (error: any) {
            res.status(CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
    }

    public async logout(req: Request, res: Response): Promise<void> {
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
        });
        res.status(CONSTANTS.HTTP_STATUS.OK).json({ message: 'Logged out successfully' });
    }

    private setRefreshTokenCookie(res: Response, token: string): void {
        res.cookie('refreshToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });
    }
}

export const authController = new AuthController();
