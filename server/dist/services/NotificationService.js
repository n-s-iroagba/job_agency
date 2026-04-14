"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationService = exports.NotificationService = void 0;
const NotificationRepository_1 = require("../repositories/NotificationRepository");
class NotificationService {
    // Maps to TRUST-008
    async getUserNotifications(userId) {
        return NotificationRepository_1.notificationRepository.findByUserId(userId);
    }
    // Maps to TRUST-008, STK-ADM-APP-004
    async sendNotification(userId, subject, message, type = 'SYSTEM') {
        return NotificationRepository_1.notificationRepository.create({
            userId,
            subject,
            message,
            type
        });
    }
    async markAsRead(id) {
        const [updatedCount, notifications] = await NotificationRepository_1.notificationRepository.markAsRead(id);
        return notifications[0];
    }
}
exports.NotificationService = NotificationService;
exports.notificationService = new NotificationService();
