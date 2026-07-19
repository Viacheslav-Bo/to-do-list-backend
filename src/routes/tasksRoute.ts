import { Router } from 'express';
import { authenticate } from '../middleware/authenticate.js';
import { getTasks } from '../controllers/tasks/getTasks.js';
import { createTask } from '../controllers/tasks/createTask';
import { updateTask } from '../controllers/tasks/updateTask.js';
import { deleteTask } from '../controllers/tasks/deleteTask.js';
import { getTaskById } from '../controllers/tasks/getTaskById.js';

import {
  createTaskSchema,
  updateTaskSchema,
  taskIdSchema,
} from '../validators/tasksValidation';

import { validateBody, validateParams } from '../middleware/validateBody';

const tasksRoute = Router();

tasksRoute.use(authenticate);

tasksRoute.post('/', validateBody(createTaskSchema), createTask);
tasksRoute.get('/', getTasks);
tasksRoute.get('/:taskId', validateParams(taskIdSchema), getTaskById);
tasksRoute.patch(
  '/:taskId',
  validateParams(taskIdSchema),
  validateBody(updateTaskSchema),
  updateTask,
);
tasksRoute.delete('/:taskId', validateParams(taskIdSchema), deleteTask);

export default tasksRoute;
