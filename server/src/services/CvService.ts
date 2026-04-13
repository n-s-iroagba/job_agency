import { userRepository } from '../repositories/UserRepository';
import { CONSTANTS } from '../constants';

export class CvService {
    // Maps to STK-APP-CV-001, STK-APP-CV-002, STK-APP-CV-003
    public async uploadCv(userId: number, cvUrl: string, fileType: string, fileSizeMb: number): Promise<any> {
        if (!CONSTANTS.FILE_CONSTRAINTS.ALLOWED_CV_TYPES.includes(fileType)) {
            throw new Error(CONSTANTS.ERROR_MESSAGES.VALIDATION_ERROR);
        }
        if (fileSizeMb > CONSTANTS.FILE_CONSTRAINTS.CV_LIMIT_MB) {
            throw new Error(CONSTANTS.ERROR_MESSAGES.VALIDATION_ERROR);
        }

        const user = await userRepository.findById(userId);
        if (!user) throw new Error(CONSTANTS.ERROR_MESSAGES.RESOURCE_NOT_FOUND);

        const [, updatedUsers] = await userRepository.update(userId, { cvUrl });
        return updatedUsers[0];
    }

    // Maps to STK-APP-CV-001 (Read)
    public async getCv(userId: number): Promise<any> {
        const user = await userRepository.findById(userId);
        if (!user) throw new Error(CONSTANTS.ERROR_MESSAGES.RESOURCE_NOT_FOUND);
        return { cvUrl: (user as any).cvUrl };
    }

    // Maps to STK-APP-CV-001 (Update) — STK-APP-CV-004: replaces existing CV for all linked applications
    public async updateCv(userId: number, cvUrl: string, fileType: string, fileSizeMb: number): Promise<any> {
        return this.uploadCv(userId, cvUrl, fileType, fileSizeMb);
    }

    // Maps to STK-APP-CV-001 (Delete) — REG-004: right to data deletion
    public async deleteCv(userId: number): Promise<void> {
        const user = await userRepository.findById(userId);
        if (!user) throw new Error(CONSTANTS.ERROR_MESSAGES.RESOURCE_NOT_FOUND);
        await userRepository.update(userId, { cvUrl: null });
    }
}

export const cvService = new CvService();
