import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import logger from './middleware/logger.js';
import notFoundHandler from './middleware/notFoundHandler.js';
import errorHandler from './middleware/errorHandler.js';

import tasksRoute from './routes/tasksRoute.js';
import authRoute from './routes/authRoute.js';
import userRoute from './routes/userRoute.js';

const app = express();

app.use(helmet());
app.use(cors());
app.use(logger);
app.use(express.json());

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
