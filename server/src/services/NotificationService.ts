import { Notification } from '../models';
import { notificationRepository } from '../repositories/NotificationRepository';

export class NotificationService {
    // Maps to TRUST-008
    public async getUserNotifications(userId: number) {
        return notificationRepository.findByUserId(userId);
    }

    // Maps to TRUST-008, STK-ADM-APP-004
    public async sendNotification(userId: number, subject: string, message: string, type: string = 'SYSTEM') {
        return notificationRepository.create({
            userId,
            subject,
            message,
            type
        });
    }

    public async markAsRead(id: number) {
        await notificationRepository.markAsRead(id);
        return Notification.findByPk(id);
    }

    public async markAllAsRead(userId: number) {
        return notificationRepository.markAllAsRead(userId);
    }
}

export const notificationService = new NotificationService();
