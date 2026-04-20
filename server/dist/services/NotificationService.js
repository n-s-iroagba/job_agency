"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationService = exports.NotificationService = void 0;
const models_1 = require("../models");
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
        await NotificationRepository_1.notificationRepository.markAsRead(id);
        return models_1.Notification.findByPk(id);
    }
    async markAllAsRead(userId) {
        return NotificationRepository_1.notificationRepository.markAllAsRead(userId);
    }
}
exports.NotificationService = NotificationService;
exports.notificationService = new NotificationService();
