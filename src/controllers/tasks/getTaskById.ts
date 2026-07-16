import { Response, NextFunction } from 'express';
import { Task } from '../../models/taskModel';
import { AuthRequest } from '../../types/express';

export async function getTaskById(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.user || !req.user._id) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const { taskId } = req.params;

    const task = await Task.findOne({
      _id: taskId,
      userId: req.user._id,
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json({
      message: 'Success',
      data: task,
    });
  } catch (error) {
    next(error);
  }
}
