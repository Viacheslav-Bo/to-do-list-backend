import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../types/express';
import { getTaskStatsService } from '../../services/task.service.js';

export async function getTaskStats(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.user?._id) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const stats = await getTaskStatsService(req.user._id);

    res.status(200).json({
      message: 'Task stats retrieved successfully',
      data: stats,
    });
  } catch (error) {
    next(error);
  }
}
