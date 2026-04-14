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
class AuthService {
    // Maps to STK-APP-AUTH-004, SCR-PUB-REGISTER-001
    async register(userData) {
        const existingUser = await UserRepository_1.userRepository.findByEmail(userData.email);
        if (existingUser) {
            throw new Error('User already exists');
        }
        const hashedPassword = await bcrypt_1.default.hash(userData.password, 12);
        const newUser = await UserRepository_1.userRepository.create({
            ...userData,
            passwordHash: hashedPassword,
            role: constants_1.CONSTANTS.ROLES.APPLICANT,
        });
        const token = (0, token_1.generateToken)({ id: newUser.id, role: newUser.role });
        return { user: newUser, token };
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
        const token = (0, token_1.generateToken)({ id: user.id, role: user.role });
        return { user, token };
    }
}
exports.AuthService = AuthService;
exports.authService = new AuthService();
