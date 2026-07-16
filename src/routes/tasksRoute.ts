import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { authenticate } from '../middleware/authenticate.js';
import { getTasks } from '../controllers/tasks/getTasks.js';
import { createTask } from '../controllers/tasks/createTask';
import { updateTask } from '../controllers/tasks/updateTask.js';
import { deleteTask } from '../controllers/tasks/deleteTask.js';
import { getTaskById } from '../controllers/tasks/getTaskById.js';

import {
  getTasksSchema,
  createTaskSchema,
  updateTaskSchema,
  taskIdSchema,
} from '../validators/tasksValidation';

import {
  validateBody,
  validateParams,
  validateQuery,
} from '../middleware/validateBody';

const tasksRoute = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: 'Too many attempts. Try it later.' },
});

tasksRoute.use(authenticate);

tasksRoute.post('/', authLimiter, validateBody(createTaskSchema), createTask);
tasksRoute.get('/', authLimiter, getTasks);
tasksRoute.get(
  '/:taskId',
  authLimiter,
  validateParams(taskIdSchema),
  getTaskById,
);
tasksRoute.patch(
  '/:taskId',
  authLimiter,
  validateParams(taskIdSchema),
  validateBody(updateTaskSchema),
  updateTask,
);
tasksRoute.delete('/:taskId', validateParams(taskIdSchema), deleteTask);

export default tasksRoute;
