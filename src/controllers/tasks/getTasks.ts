import { Response, NextFunction } from 'express';
import { z } from 'zod';
import { AuthRequest } from '../../types/express';
import { getTasksService } from '..//..//services/task.service.js';
import { getTasksSchema } from '../../validators/tasksValidation.js';

export async function getTasks(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.user?._id) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const query = getTasksSchema.parse(req.query);

    const result = await getTasksService(req.user._id, query);

    res.status(200).json({
      message: 'Tasks retrieved successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
}
