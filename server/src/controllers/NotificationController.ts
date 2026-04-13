import { Request, Response } from 'express';
import { notificationService } from '../services/NotificationService';
import { CONSTANTS } from '../constants';

export class NotificationController {
    // Maps to TRUST-008
    public async getUserNotifications(req: Request, res: Response): Promise<void> {
        try {
            const userId = (req as any).user.id;
            const notifications = await notificationService.getUserNotifications(userId);
            res.status(CONSTANTS.HTTP_STATUS.OK).json(notifications);
        } catch (error) {
            res.status(CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: CONSTANTS.ERROR_MESSAGES.INTERNAL_ERROR });
        }
    }

    public async markAsRead(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id as string, 10);
            const notification = await notificationService.markAsRead(id);
            res.status(CONSTANTS.HTTP_STATUS.OK).json(notification);
        } catch (error) {
            res.status(CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: CONSTANTS.ERROR_MESSAGES.INTERNAL_ERROR });
        }
    }
}

export const notificationController = new NotificationController();
