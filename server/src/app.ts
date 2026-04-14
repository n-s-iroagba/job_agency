import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import apiRoutes from './routes/apiRoutes';
import { errorHandler } from './middleware/errorHandler';

const app = express();

// Security and utility middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routing API mappings
app.use('/api', apiRoutes);

// Global Error Handler mapped at bottom of stack
app.use(errorHandler);

export default app;
