import { Response, NextFunction } from 'express';
import createHttpError from 'http-errors';
import { Task } from '../../models/taskModel.js';
import { AuthRequest } from '../../types/express';

export const deleteTask = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { taskId } = req.params;

    if (!req.user || !req.user._id) {
      throw createHttpError(401, 'Unauthorized');
    }

    const task = await Task.findOneAndDelete({
      _id: taskId,
      userId: req.user._id,
    });

    if (!task) {
      throw createHttpError(404, 'Task not found');
    }

    res.status(200).json({
      message: 'Task deleted successfully',
      data: task,
    });
  } catch (error) {
    next(error);
  }
};
