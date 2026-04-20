"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = exports.AuthService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const UserRepository_1 = require("../repositories/UserRepository");
const token_1 = require("../utils/token");
const constants_1 = require("../constants");
const email_1 = require("../utils/email");
const crypto_1 = __importDefault(require("crypto"));
class AuthService {
    // Maps to STK-APP-AUTH-004, SCR-PUB-REGISTER-001
    async register(userData) {
        const existingUser = await UserRepository_1.userRepository.findByEmail(userData.email);
        if (existingUser) {
            throw new Error(constants_1.CONSTANTS.ERROR_MESSAGES.EMAIL_EXISTS);
        }
        const hashedPassword = await bcrypt_1.default.hash(userData.password, 12);
        const verificationToken = crypto_1.default.randomBytes(32).toString('hex');
        const newUser = await UserRepository_1.userRepository.create({
            ...userData,
            passwordHash: hashedPassword,
            role: constants_1.CONSTANTS.ROLES.APPLICANT,
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
        await (0, email_1.sendAuthEmail)(newUser.email, 'Verify Your Account', content);
        const accessToken = (0, token_1.generateAccessToken)({ id: newUser.id, role: newUser.role });
        const refreshToken = (0, token_1.generateRefreshToken)({ id: newUser.id, role: newUser.role });
        return { user: newUser, accessToken, refreshToken };
    }
    async registerAdmin(userData) {
        const existingUser = await UserRepository_1.userRepository.findByEmail(userData.email);
        if (existingUser) {
            throw new Error(constants_1.CONSTANTS.ERROR_MESSAGES.EMAIL_EXISTS);
        }
        const hashedPassword = await bcrypt_1.default.hash(userData.password, 12);
        const newUser = await UserRepository_1.userRepository.create({
            ...userData,
            passwordHash: hashedPassword,
            role: constants_1.CONSTANTS.ROLES.ADMIN,
            isVerified: true, // Manual admin registration can be auto-verified or follow the same flow
        });
        const accessToken = (0, token_1.generateAccessToken)({ id: newUser.id, role: newUser.role });
        const refreshToken = (0, token_1.generateRefreshToken)({ id: newUser.id, role: newUser.role });
        return { user: newUser, accessToken, refreshToken };
    }
    async verifyEmail(token) {
        const user = await UserRepository_1.userRepository.findByVerificationToken(token);
        if (!user) {
            throw new Error(constants_1.CONSTANTS.ERROR_MESSAGES.INVALID_TOKEN);
        }
        await UserRepository_1.userRepository.update(user.id, {
            isVerified: true,
            verificationToken: null
        });
    }
    async forgotPassword(email) {
        const normalizedEmail = email.toLowerCase().trim();
        const user = await UserRepository_1.userRepository.findByEmail(normalizedEmail);
        if (!user) {
            // We don't want to leak if a user exists or not, but for admin we might.
            // Requirement says "forgot password with email", so we'll just return if not found.
            return;
        }
        const resetToken = crypto_1.default.randomBytes(32).toString('hex');
        const resetExpires = new Date(Date.now() + 3600000); // 1 hour
        await UserRepository_1.userRepository.update(user.id, {
            resetPasswordToken: resetToken,
            resetPasswordExpires: resetExpires
        });
        console.log(`[AuthService] Reset token generated for user ID ${user.id}: ${resetToken}`);
        const baseUrl = (process.env.CLIENT_URL || 'http://localhost:3000').replace(/\/$/, '');
        const resetUrl = `${baseUrl}/reset-password?token=${resetToken}`;
        const content = `
            <p>A cryptographic reset sequence has been initialized for your JobNexe account.</p>
            <div class="cta-block">
                <a href="${resetUrl}" class="button">Reset Passphrase</a>
            </div>
            <p style="margin-top: 20px; font-size: 12px; color: #64748b;">If you did not trigger this protocol, please secure your node immediately.</p>
        `;
        await (0, email_1.sendAuthEmail)(user.email, 'Password Reset Request', content);
    }
    async resetPassword(token, newPassword) {
        const user = await UserRepository_1.userRepository.findByResetToken(token);
        if (!user || !user.resetPasswordExpires || user.resetPasswordExpires < new Date()) {
            throw new Error(constants_1.CONSTANTS.ERROR_MESSAGES.INVALID_TOKEN);
        }
        const hashedPassword = await bcrypt_1.default.hash(newPassword, 12);
        await UserRepository_1.userRepository.update(user.id, {
            passwordHash: hashedPassword,
            resetPasswordToken: null,
            resetPasswordExpires: null
        });
    }
    async resendVerification(email) {
        const user = await UserRepository_1.userRepository.findByEmail(email);
        if (!user || user.isVerified) {
            return; // Don't leak or send to verified users
        }
        const verificationToken = crypto_1.default.randomBytes(32).toString('hex');
        await UserRepository_1.userRepository.update(user.id, { verificationToken });
        const verificationUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/verify-email?token=${verificationToken}`;
        const content = `
            <p>A new verification pulse has been dispatched. Please activate your professional identity using the secure link below.</p>
            <div class="cta-block">
                <a href="${verificationUrl}" class="button">Verify Identity</a>
            </div>
        `;
        await (0, email_1.sendAuthEmail)(user.email, 'Verify Your Account', content);
    }
    // Maps to STK-APP-AUTH-005, SCR-PUB-LOGIN-001, NFR-SEC-008
    async login(email, password) {
        const user = await UserRepository_1.userRepository.findByEmail(email);
        if (!user) {
            throw new Error(constants_1.CONSTANTS.ERROR_MESSAGES.INVALID_CREDENTIALS);
        }
        const isMatch = await bcrypt_1.default.compare(password, user.passwordHash);
        if (!isMatch) {
            throw new Error(constants_1.CONSTANTS.ERROR_MESSAGES.INVALID_CREDENTIALS);
        }
        if (!user.isVerified) {
            // Automatically resend verification for applicants to improve UX
            if (user.role === constants_1.CONSTANTS.ROLES.APPLICANT) {
                console.log(`[AuthService.login] Unverified applicant detected. Triggering auto-resend for: ${email}`);
                await this.resendVerification(email);
            }
            throw new Error(constants_1.CONSTANTS.ERROR_MESSAGES.EMAIL_NOT_VERIFIED);
        }
        const accessToken = (0, token_1.generateAccessToken)({ id: user.id, role: user.role });
        const refreshToken = (0, token_1.generateRefreshToken)({ id: user.id, role: user.role });
        return { user, accessToken, refreshToken };
    }
    async refresh(refreshToken) {
        try {
            const payload = (0, token_1.verifyRefreshToken)(refreshToken);
            const user = await UserRepository_1.userRepository.findById(payload.id);
            if (!user) {
                throw new Error(constants_1.CONSTANTS.ERROR_MESSAGES.USER_NOT_FOUND);
            }
            const newAccessToken = (0, token_1.generateAccessToken)({ id: user.id, role: user.role });
            const newRefreshToken = (0, token_1.generateRefreshToken)({ id: user.id, role: user.role });
            return { accessToken: newAccessToken, refreshToken: newRefreshToken };
        }
        catch (error) {
            if (error.message === constants_1.CONSTANTS.ERROR_MESSAGES.USER_NOT_FOUND) {
                throw error;
            }
            throw new Error(constants_1.CONSTANTS.ERROR_MESSAGES.INVALID_TOKEN);
        }
    }
    async getMe(userId) {
        const user = await UserRepository_1.userRepository.findById(userId);
        if (!user) {
            throw new Error(constants_1.CONSTANTS.ERROR_MESSAGES.USER_NOT_FOUND);
        }
        return user;
    }
    async updateProfile(userId, data) {
        await UserRepository_1.userRepository.update(userId, data);
        const user = await UserRepository_1.userRepository.findById(userId);
        if (!user) {
            throw new Error(constants_1.CONSTANTS.ERROR_MESSAGES.USER_NOT_FOUND);
        }
        return user;
    }
    async changePassword(userId, currentPass, newPass) {
        const user = await UserRepository_1.userRepository.findById(userId);
        if (!user) {
            throw new Error(constants_1.CONSTANTS.ERROR_MESSAGES.USER_NOT_FOUND);
        }
        const isMatch = await bcrypt_1.default.compare(currentPass, user.passwordHash);
        if (!isMatch) {
            throw new Error(constants_1.CONSTANTS.ERROR_MESSAGES.INVALID_CREDENTIALS);
        }
        const hashedNewPass = await bcrypt_1.default.hash(newPass, 12);
        await UserRepository_1.userRepository.update(userId, {
            passwordHash: hashedNewPass
        });
    }
}
exports.AuthService = AuthService;
exports.authService = new AuthService();
