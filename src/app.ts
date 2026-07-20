import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import logger from './middleware/logger.js';
import cookieParser from 'cookie-parser';
import notFoundHandler from './middleware/notFoundHandler.js';
import errorHandler from './middleware/errorHandler.js';

import tasksRoute from './routes/tasksRoute.js';
import authRoute from './routes/authRoute.js';
import userRoute from './routes/userRoute.js';

const app = express();

app.use(helmet());
console.log('Frontend domain:', process.env.FRONTEND_DOMAIN);
app.use(
  cors({
    origin: process.env.FRONTEND_DOMAIN || 'http://localhost:3001',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);
app.use(logger);
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Welcome to the API! Backend is up and running.',
  });
});

app.use('/auth', authRoute);
app.use('/tasks', tasksRoute);
app.use('/user', userRoute);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
