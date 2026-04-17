import bcrypt from 'bcrypt';
import { userRepository } from '../repositories/UserRepository';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/token';
import { CONSTANTS } from '../constants';
import { sendAuthEmail } from '../utils/email';
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
        console.log(verificationToken);

        // Send Verification Email
        const verificationUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/verify-email?token=${verificationToken}`;
        const content = `
            <p>Welcome to JobNexe. We require a high-priority identity verification to activate your professional node.</p>
            <div class="cta-block">
                <a href="${verificationUrl}" class="button">Verify Identity</a>
            </div>
            <p style="margin-top: 20px; font-size: 12px; color: #64748b;">If the button above does not work, copy and paste this link: ${verificationUrl}</p>
        `;
        await sendAuthEmail(
            newUser.email,
            'Verify Your Account',
            content
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
        const content = `
            <p>A cryptographic reset sequence has been initialized for your JobNexe account.</p>
            <div class="cta-block">
                <a href="${resetUrl}" class="button">Reset Passphrase</a>
            </div>
            <p style="margin-top: 20px; font-size: 12px; color: #64748b;">If you did not trigger this protocol, please secure your node immediately.</p>
        `;
        await sendAuthEmail(
            user.email,
            'Password Reset Request',
            content
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
        const content = `
            <p>A new verification pulse has been dispatched. Please activate your professional identity using the secure link below.</p>
            <div class="cta-block">
                <a href="${verificationUrl}" class="button">Verify Identity</a>
            </div>
        `;
        await sendAuthEmail(
            user.email,
            'Verify Your Account',
            content
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
        } catch (error: any) {
            if (error.message === CONSTANTS.ERROR_MESSAGES.USER_NOT_FOUND) {
                throw error;
            }
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

    public async updateProfile(userId: number, data: any): Promise<any> {
        await userRepository.update(userId, data);
        const user = await userRepository.findById(userId);
        if (!user) {
            throw new Error(CONSTANTS.ERROR_MESSAGES.USER_NOT_FOUND);
        }
        return user;
    }

}

export const authService = new AuthService();
