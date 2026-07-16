import { Response, NextFunction } from 'express';
import { Task } from '../../models/taskModel';
import createHttpError from 'http-errors';
import { taskIdSchema } from '../../validators/tasksValidation';
import { AuthRequest } from '../../types/express';

export const updateTask = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { taskId } = req.params;

    if (!req.user || !req.user._id) {
      throw createHttpError(401, 'Unauthorized');
    }

    taskIdSchema.parse({ taskId });

    const task = await Task.findOneAndUpdate(
      { _id: taskId, userId: req.user._id },
      req.body,
      { returnDocument: 'after', runValidators: true },
    );
    if (!task) {
      throw createHttpError(404, 'Task not found');
    }

    res.status(200).json({ data: task });
  } catch (error) {
    next(error);
  }
};
