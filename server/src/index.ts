import app from './app';
import { connectDB, sequelize } from './config/database';
import { logger } from './utils/logger';

// Initializes Associations Mapping
import './models';

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        await connectDB();

        if (process.env.NODE_ENV !== 'production') {
            //await sequelize.sync({ force: true });
            logger.info('Database Synchronized successfully.');
        }

        app.listen(PORT, () => {
            logger.info(`Server activated and mapping routes on port ${PORT}`);
        });
    } catch (error) {
        logger.error('Failed to initialize server processes comprehensively', error);
        process.exit(1);
    }
};

startServer();
