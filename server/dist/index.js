"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const database_1 = require("./config/database");
const logger_1 = require("./utils/logger");
// Initializes Associations Mapping
require("./models");
const PORT = process.env.PORT || 3000;
const startServer = async () => {
    try {
        await (0, database_1.connectDB)();
        if (process.env.NODE_ENV !== 'production') {
            await database_1.sequelize.sync({ alter: true });
            logger_1.logger.info('Database Synchronized successfully.');
        }
        app_1.default.listen(PORT, () => {
            logger_1.logger.info(`Server activated and mapping routes on port ${PORT}`);
        });
    }
    catch (error) {
        logger_1.logger.error('Failed to initialize server processes comprehensively', error);
        process.exit(1);
    }
};
startServer();
