import bcrypt from 'bcrypt';
import { userRepository } from '../repositories/UserRepository';
import { generateToken } from '../utils/token';
import { CONSTANTS } from '../constants';

export class AuthService {
    // Maps to STK-APP-AUTH-004, SCR-PUB-REGISTER-001
    public async register(userData: any): Promise<{ user: any; token: string }> {
        const existingUser = await userRepository.findByEmail(userData.email);
        if (existingUser) {
            throw new Error('User already exists');
        }

        const hashedPassword = await bcrypt.hash(userData.password, 12);
        const newUser = await userRepository.create({
            ...userData,
            passwordHash: hashedPassword,
            role: CONSTANTS.ROLES.APPLICANT,
        });

        const token = generateToken({ id: newUser.id, role: newUser.role });
        return { user: newUser, token };
    }

    // Maps to STK-APP-AUTH-005, SCR-PUB-LOGIN-001, NFR-SEC-008
    public async login(email: string, password: string): Promise<{ user: any; token: string }> {
        const user = await userRepository.findByEmail(email);
        if (!user) {
            throw new Error(CONSTANTS.ERROR_MESSAGES.INVALID_CREDENTIALS);
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            throw new Error(CONSTANTS.ERROR_MESSAGES.INVALID_CREDENTIALS);
        }

        const token = generateToken({ id: user.id, role: user.role });
        return { user, token };
    }
}

export const authService = new AuthService();
