"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applicationController = exports.ApplicationController = void 0;
const ApplicationService_1 = require("../services/ApplicationService");
const constants_1 = require("../constants");
class ApplicationController {
    // Maps to STK-APP-APPLY-001, TRUST-009
    async startApplication(req, res) {
        try {
            const userId = req.user.id;
            const jobId = parseInt(req.body.jobId, 10);
            const application = await ApplicationService_1.applicationService.startApplication(userId, jobId);
            res.status(constants_1.CONSTANTS.HTTP_STATUS.CREATED).json(application);
        }
        catch (error) {
            if (error.message === constants_1.CONSTANTS.ERROR_MESSAGES.RESOURCE_NOT_FOUND) {
                res.status(constants_1.CONSTANTS.HTTP_STATUS.NOT_FOUND).json({ error: error.message });
                return;
            }
            res.status(constants_1.CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: constants_1.CONSTANTS.ERROR_MESSAGES.INTERNAL_ERROR });
        }
    }
    // Maps to STK-APP-APPLY-005, DM-001
    async advanceApplication(req, res) {
        try {
            const id = parseInt(req.params.id, 10);
            const app = await ApplicationService_1.applicationService.advanceApplicationStage(id);
            res.status(constants_1.CONSTANTS.HTTP_STATUS.OK).json(app);
        }
        catch (error) {
            if (error.message === constants_1.CONSTANTS.ERROR_MESSAGES.RESOURCE_NOT_FOUND) {
                res.status(constants_1.CONSTANTS.HTTP_STATUS.NOT_FOUND).json({ error: error.message });
                return;
            }
            res.status(constants_1.CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: constants_1.CONSTANTS.ERROR_MESSAGES.INTERNAL_ERROR });
        }
    }
    // Maps to STK-APP-APPLIST-001
    async getUserApplications(req, res) {
        try {
            const userId = req.user.id;
            const limit = req.query.limit ? parseInt(req.query.limit, 10) : 10;
            const offset = req.query.offset ? parseInt(req.query.offset, 10) : 0;
            const applications = await ApplicationService_1.applicationService.getUserApplications(userId, limit, offset);
            res.status(constants_1.CONSTANTS.HTTP_STATUS.OK).json(applications);
        }
        catch (error) {
            res.status(constants_1.CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: constants_1.CONSTANTS.ERROR_MESSAGES.INTERNAL_ERROR });
        }
    }
    // Maps to STK-APP-APPLY-002
    async getApplicationDetails(req, res) {
        try {
            const id = parseInt(req.params.id, 10);
            const app = await ApplicationService_1.applicationService.getApplicationDetails(id);
            res.status(constants_1.CONSTANTS.HTTP_STATUS.OK).json(app);
        }
        catch (error) {
            if (error.message === constants_1.CONSTANTS.ERROR_MESSAGES.RESOURCE_NOT_FOUND) {
                res.status(constants_1.CONSTANTS.HTTP_STATUS.NOT_FOUND).json({ error: error.message });
                return;
            }
            res.status(constants_1.CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: constants_1.CONSTANTS.ERROR_MESSAGES.INTERNAL_ERROR });
        }
    }
    // Maps to STK-APP-DASH-001..003 — applicant dashboard aggregation
    async getDashboardSummary(req, res) {
        try {
            const userId = req.user.id;
            const summary = await ApplicationService_1.applicationService.getDashboardSummary(userId);
            res.status(constants_1.CONSTANTS.HTTP_STATUS.OK).json(summary);
        }
        catch (error) {
            res.status(constants_1.CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: constants_1.CONSTANTS.ERROR_MESSAGES.INTERNAL_ERROR });
        }
    }
    // Maps to STK-ADM-APP-001 — admin: new/completed applications
    async getAdminApplications(req, res) {
        try {
            const status = req.query.status;
            const limit = req.query.limit ? parseInt(req.query.limit, 10) : 20;
            const offset = req.query.offset ? parseInt(req.query.offset, 10) : 0;
            const applications = await ApplicationService_1.applicationService.getApplicationsByStatus(status, limit, offset);
            res.status(constants_1.CONSTANTS.HTTP_STATUS.OK).json(applications);
        }
        catch (error) {
            res.status(constants_1.CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: constants_1.CONSTANTS.ERROR_MESSAGES.INTERNAL_ERROR });
        }
    }
    // Maps to STK-ADM-APP-002 — admin: draft applications view
    async getDraftApplications(req, res) {
        try {
            const limit = req.query.limit ? parseInt(req.query.limit, 10) : 20;
            const offset = req.query.offset ? parseInt(req.query.offset, 10) : 0;
            const drafts = await ApplicationService_1.applicationService.getDraftApplications(limit, offset);
            res.status(constants_1.CONSTANTS.HTTP_STATUS.OK).json(drafts);
        }
        catch (error) {
            res.status(constants_1.CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: constants_1.CONSTANTS.ERROR_MESSAGES.INTERNAL_ERROR });
        }
    }
}
exports.ApplicationController = ApplicationController;
exports.applicationController = new ApplicationController();
