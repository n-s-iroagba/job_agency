"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationController = exports.NotificationController = void 0;
const NotificationService_1 = require("../services/NotificationService");
const constants_1 = require("../constants");
class NotificationController {
    // Maps to TRUST-008
    async getUserNotifications(req, res) {
        try {
            const userId = req.user.id;
            const notifications = await NotificationService_1.notificationService.getUserNotifications(userId);
            res.status(constants_1.CONSTANTS.HTTP_STATUS.OK).json(notifications);
        }
        catch (error) {
            res.status(constants_1.CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: constants_1.CONSTANTS.ERROR_MESSAGES.INTERNAL_ERROR });
        }
    }
    async markAsRead(req, res) {
        try {
            const id = parseInt(req.params.id, 10);
            const notification = await NotificationService_1.notificationService.markAsRead(id);
            res.status(constants_1.CONSTANTS.HTTP_STATUS.OK).json(notification);
        }
        catch (error) {
            res.status(constants_1.CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: constants_1.CONSTANTS.ERROR_MESSAGES.INTERNAL_ERROR });
        }
    }
}
exports.NotificationController = NotificationController;
exports.notificationController = new NotificationController();
