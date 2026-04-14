"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jobController = exports.JobController = void 0;
const JobService_1 = require("../services/JobService");
const constants_1 = require("../constants");
class JobController {
    // Maps to STK-APP-DASH-001
    async getActiveJobs(req, res) {
        try {
            const categoryId = req.query.categoryId ? parseInt(req.query.categoryId, 10) : undefined;
            const employmentType = req.query.employmentType;
            const searchQuery = req.query.searchQuery;
            const limit = req.query.limit ? parseInt(req.query.limit, 10) : 10;
            const offset = req.query.offset ? parseInt(req.query.offset, 10) : 0;
            const result = await JobService_1.jobService.getActiveJobs(limit, offset, categoryId, employmentType, searchQuery);
            res.status(constants_1.CONSTANTS.HTTP_STATUS.OK).json(result);
        }
        catch (error) {
            res.status(constants_1.CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: constants_1.CONSTANTS.ERROR_MESSAGES.INTERNAL_ERROR });
        }
    }
    // Maps to STK-APP-APPLY-001
    async getJobDetails(req, res) {
        try {
            const jobId = parseInt(req.params.id, 10);
            const job = await JobService_1.jobService.getJobDetails(jobId);
            res.status(constants_1.CONSTANTS.HTTP_STATUS.OK).json(job);
        }
        catch (error) {
            if (error.message === constants_1.CONSTANTS.ERROR_MESSAGES.RESOURCE_NOT_FOUND) {
                res.status(constants_1.CONSTANTS.HTTP_STATUS.NOT_FOUND).json({ error: error.message });
                return;
            }
            res.status(constants_1.CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: constants_1.CONSTANTS.ERROR_MESSAGES.INTERNAL_ERROR });
        }
    }
    // Maps to STK-ADM-JOB-004
    async getAllJobsAdmin(req, res) {
        try {
            const limit = req.query.limit ? parseInt(req.query.limit, 10) : 20;
            const offset = req.query.offset ? parseInt(req.query.offset, 10) : 0;
            const result = await JobService_1.jobService.getAllJobsAdmin(limit, offset);
            res.status(constants_1.CONSTANTS.HTTP_STATUS.OK).json(result);
        }
        catch (error) {
            res.status(constants_1.CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: constants_1.CONSTANTS.ERROR_MESSAGES.INTERNAL_ERROR });
        }
    }
    // Maps to STK-ADM-JOB-001, STK-ADM-JOB-003
    async createJob(req, res) {
        try {
            const { benefitsIds, conditionsIds, ...jobData } = req.body;
            const job = await JobService_1.jobService.createJob(jobData, benefitsIds || [], conditionsIds || []);
            res.status(constants_1.CONSTANTS.HTTP_STATUS.CREATED).json(job);
        }
        catch (error) {
            res.status(constants_1.CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: constants_1.CONSTANTS.ERROR_MESSAGES.INTERNAL_ERROR });
        }
    }
    // Maps to STK-ADM-JOB-005
    async updateJob(req, res) {
        try {
            const jobId = parseInt(req.params.id, 10);
            const { benefitsIds, conditionsIds, ...jobData } = req.body;
            const job = await JobService_1.jobService.updateJob(jobId, jobData, benefitsIds, conditionsIds);
            res.status(constants_1.CONSTANTS.HTTP_STATUS.OK).json(job);
        }
        catch (error) {
            if (error.message === constants_1.CONSTANTS.ERROR_MESSAGES.RESOURCE_NOT_FOUND) {
                res.status(constants_1.CONSTANTS.HTTP_STATUS.NOT_FOUND).json({ error: error.message });
                return;
            }
            res.status(constants_1.CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: constants_1.CONSTANTS.ERROR_MESSAGES.INTERNAL_ERROR });
        }
    }
    // Maps to STK-ADM-JOB-001
    async deleteJob(req, res) {
        try {
            const jobId = parseInt(req.params.id, 10);
            await JobService_1.jobService.deleteJob(jobId);
            res.status(constants_1.CONSTANTS.HTTP_STATUS.OK).json({ message: constants_1.CONSTANTS.SUCCESS_MESSAGES.DELETED });
        }
        catch (error) {
            res.status(constants_1.CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: constants_1.CONSTANTS.ERROR_MESSAGES.INTERNAL_ERROR });
        }
    }
    // Stage Management (STK-ADM-STAGE-001..005)
    async getJobStages(req, res) {
        try {
            const jobId = parseInt(req.params.id, 10);
            const stages = await JobService_1.jobService.getStagesByJob(jobId);
            res.status(constants_1.CONSTANTS.HTTP_STATUS.OK).json(stages);
        }
        catch (error) {
            res.status(constants_1.CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: constants_1.CONSTANTS.ERROR_MESSAGES.INTERNAL_ERROR });
        }
    }
    async createJobStage(req, res) {
        try {
            const jobId = parseInt(req.params.id, 10);
            const stage = await JobService_1.jobService.createStage(jobId, req.body);
            res.status(constants_1.CONSTANTS.HTTP_STATUS.CREATED).json(stage);
        }
        catch (error) {
            res.status(constants_1.CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: constants_1.CONSTANTS.ERROR_MESSAGES.INTERNAL_ERROR });
        }
    }
    async updateJobStage(req, res) {
        try {
            const stageId = parseInt(req.params.stageId, 10);
            const stage = await JobService_1.jobService.updateStage(stageId, req.body);
            res.status(constants_1.CONSTANTS.HTTP_STATUS.OK).json(stage);
        }
        catch (error) {
            if (error.message === constants_1.CONSTANTS.ERROR_MESSAGES.RESOURCE_NOT_FOUND) {
                res.status(constants_1.CONSTANTS.HTTP_STATUS.NOT_FOUND).json({ error: error.message });
                return;
            }
            res.status(constants_1.CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: constants_1.CONSTANTS.ERROR_MESSAGES.INTERNAL_ERROR });
        }
    }
    async deleteJobStage(req, res) {
        try {
            const stageId = parseInt(req.params.stageId, 10);
            await JobService_1.jobService.deleteStage(stageId);
            res.status(constants_1.CONSTANTS.HTTP_STATUS.OK).json({ message: constants_1.CONSTANTS.SUCCESS_MESSAGES.DELETED });
        }
        catch (error) {
            res.status(constants_1.CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: constants_1.CONSTANTS.ERROR_MESSAGES.INTERNAL_ERROR });
        }
    }
}
exports.JobController = JobController;
exports.jobController = new JobController();
