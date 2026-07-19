import { Response, NextFunction } from 'express';
import createHttpError from 'http-errors';
import { Task } from '..//../models/taskModel';
import { createTaskSchema } from '../../validators/tasksValidation';
import { AuthRequest } from '../../types/express';

export const createTask = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      throw createHttpError(401, 'Unauthorized');
    }

    const { dueDate, ...rest } = createTaskSchema.parse(req.body);

    const task = await Task.create(
      dueDate ? { ...rest, dueDate, userId } : { ...rest, userId },
    );

    res.status(201).json({
      message: 'Task created successfully',
      data: task,
    });
  } catch (error) {
    next(error);
  }
};
