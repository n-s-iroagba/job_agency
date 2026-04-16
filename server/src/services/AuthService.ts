import bcrypt from 'bcrypt';
import { userRepository } from '../repositories/UserRepository';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/token';
import { CONSTANTS } from '../constants';
import { sendEmail } from '../utils/email';
import crypto from 'crypto';


export class AuthService {
    // Maps to STK-APP-AUTH-004, SCR-PUB-REGISTER-001
    public async register(userData: any): Promise<{ user: any; accessToken: string; refreshToken: string }> {
        const existingUser = await userRepository.findByEmail(userData.email);
        if (existingUser) {
            throw new Error(CONSTANTS.ERROR_MESSAGES.EMAIL_EXISTS);
        }

        const hashedPassword = await bcrypt.hash(userData.password, 12);
        const verificationToken = crypto.randomBytes(32).toString('hex');

        const newUser = await userRepository.create({
            ...userData,
            passwordHash: hashedPassword,
            role: CONSTANTS.ROLES.APPLICANT,
            verificationToken,
            isVerified: false,
        });

        // Send Verification Email
        const verificationUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/verify-email?token=${verificationToken}`;
        await sendEmail(
            newUser.email,
            'Verify Your Account',
            this.getPremiumTemplate(
                'Identity Verification',
                'Welcome to JobNexa. We require a high-priority identity verification to activate your professional node. Please use the secure link below to proceed.',
                'Verify Identity',
                verificationUrl
            )
        );

        const accessToken = generateAccessToken({ id: newUser.id, role: newUser.role });
        const refreshToken = generateRefreshToken({ id: newUser.id, role: newUser.role });
        return { user: newUser, accessToken, refreshToken };
    }

    public async registerAdmin(userData: any): Promise<{ user: any; accessToken: string; refreshToken: string }> {
        const existingUser = await userRepository.findByEmail(userData.email);
        if (existingUser) {
            throw new Error(CONSTANTS.ERROR_MESSAGES.EMAIL_EXISTS);
        }

        const hashedPassword = await bcrypt.hash(userData.password, 12);
        const newUser = await userRepository.create({
            ...userData,
            passwordHash: hashedPassword,
            role: CONSTANTS.ROLES.ADMIN,
            isVerified: true, // Manual admin registration can be auto-verified or follow the same flow
        });

        const accessToken = generateAccessToken({ id: newUser.id, role: newUser.role });
        const refreshToken = generateRefreshToken({ id: newUser.id, role: newUser.role });
        return { user: newUser, accessToken, refreshToken };
    }

    public async verifyEmail(token: string): Promise<void> {
        const user = await userRepository.findByVerificationToken(token);
        if (!user) {
            throw new Error(CONSTANTS.ERROR_MESSAGES.INVALID_TOKEN);
        }

        await userRepository.update(user.id, {
            isVerified: true,
            verificationToken: null
        });
    }

    public async forgotPassword(email: string): Promise<void> {
        const user = await userRepository.findByEmail(email);
        if (!user) {
            // We don't want to leak if a user exists or not, but for admin we might.
            // Requirement says "forgot password with email", so we'll just return if not found.
            return;
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetExpires = new Date(Date.now() + 3600000); // 1 hour

        await userRepository.update(user.id, {
            resetPasswordToken: resetToken,
            resetPasswordExpires: resetExpires
        });

        const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
        await sendEmail(
            user.email,
            'Password Reset Request',
            this.getPremiumTemplate(
                'Access Recovery',
                'A cryptographic reset sequence has been initialized for your JobNexa account. If you did not trigger this protocol, please secure your node immediately.',
                'Reset Passphrase',
                resetUrl
            )
        );
    }

    public async resetPassword(token: string, newPassword: string): Promise<void> {
        const user = await userRepository.findByResetToken(token);

        if (!user || !user.resetPasswordExpires || user.resetPasswordExpires < new Date()) {
            throw new Error(CONSTANTS.ERROR_MESSAGES.INVALID_TOKEN);
        }

        const hashedPassword = await bcrypt.hash(newPassword, 12);
        await userRepository.update(user.id, {
            passwordHash: hashedPassword,
            resetPasswordToken: null,
            resetPasswordExpires: null
        });
    }

    public async resendVerification(email: string): Promise<void> {
        const user = await userRepository.findByEmail(email);
        if (!user || user.isVerified) {
            return; // Don't leak or send to verified users
        }

        const verificationToken = crypto.randomBytes(32).toString('hex');
        await userRepository.update(user.id, { verificationToken });

        const verificationUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/verify-email?token=${verificationToken}`;
        await sendEmail(
            user.email,
            'Verify Your Account',
            this.getPremiumTemplate(
                'Relay Identity Verification',
                'A new verification pulse has been dispatched. Please activate your professional identity using the secure link below.',
                'Verify Identity',
                verificationUrl
            )
        );
    }

    // Maps to STK-APP-AUTH-005, SCR-PUB-LOGIN-001, NFR-SEC-008
    public async login(email: string, password: string): Promise<{ user: any; accessToken: string; refreshToken: string }> {
        const user = await userRepository.findByEmail(email);
        if (!user) {
            throw new Error(CONSTANTS.ERROR_MESSAGES.INVALID_CREDENTIALS);
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            throw new Error(CONSTANTS.ERROR_MESSAGES.INVALID_CREDENTIALS);
        }

        if (!user.isVerified) {
            throw new Error(CONSTANTS.ERROR_MESSAGES.EMAIL_NOT_VERIFIED);
        }

        const accessToken = generateAccessToken({ id: user.id, role: user.role });
        const refreshToken = generateRefreshToken({ id: user.id, role: user.role });
        return { user, accessToken, refreshToken };
    }

    public async refresh(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
        try {
            const payload = verifyRefreshToken(refreshToken);
            const user = await userRepository.findById(payload.id);

            if (!user) {
                throw new Error(CONSTANTS.ERROR_MESSAGES.USER_NOT_FOUND);
            }

            const newAccessToken = generateAccessToken({ id: user.id, role: user.role });
            const newRefreshToken = generateRefreshToken({ id: user.id, role: user.role });

            return { accessToken: newAccessToken, refreshToken: newRefreshToken };
        } catch (error) {
            throw new Error(CONSTANTS.ERROR_MESSAGES.INVALID_TOKEN);
        }
    }

    public async getMe(userId: number): Promise<any> {
        const user = await userRepository.findById(userId);
        if (!user) {
            throw new Error(CONSTANTS.ERROR_MESSAGES.USER_NOT_FOUND);
        }
        return user;
    }

    public async updateProfile(userId: number, data: { fullName?: string }): Promise<any> {
        return userRepository.update(userId, data);
    }

    private getPremiumTemplate(title: string, message: string, buttonLabel: string, buttonUrl: string): string {
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <style>
                    body { font-family: 'Inter', system-ui, -apple-system, sans-serif; line-height: 1.6; color: #1a1c1e; margin: 0; padding: 0; background-color: #f8fafc; }
                    .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 40px -10px rgba(0,0,0,0.05); border: 1px solid #f1f5f9; }
                    .header { background: #0f172a; padding: 48px 40px; text-align: center; }
                    .header h1 { color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.025em; text-transform: uppercase; font-style: italic; }
                    .content { padding: 48px 40px; }
                    .content h2 { font-size: 20px; font-weight: 800; margin-top: 0; color: #0f172a; letter-spacing: -0.01em; }
                    .content p { font-size: 15px; color: #475569; margin-bottom: 32px; font-weight: 500; }
                    .button { display: inline-block; background: #0f172a; color: #ffffff !important; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: 700; font-size: 13px; text-transform: uppercase; letter-spacing: 0.1em; transition: all 0.2s; }
                    .footer { padding: 32px 40px; background: #f8fafc; text-align: center; border-top: 1px solid #f1f5f9; }
                    .footer p { margin: 0; font-size: 10px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.2em; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>JobNexa</h1>
                    </div>
                    <div class="content">
                        <h2>${title}</h2>
                        <p>${message}</p>
                        <a href="${buttonUrl}" class="button">${buttonLabel}</a>
                    </div>
                    <div class="footer">
                        <p>© 2024 JobNexa · Secure Identity Management</p>
                    </div>
                </div>
            </body>
            </html>
        `;
    }
}

export const authService = new AuthService();
