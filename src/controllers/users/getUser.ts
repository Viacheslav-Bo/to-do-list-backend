import createHttpError from 'http-errors';
import { User } from '../../models/userModel.js';
import { AuthRequest } from '../../types/express';
import { Response, NextFunction } from 'express';

export const getUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user || !req.user._id) {
      throw createHttpError(401, 'Unauthorized');
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      throw createHttpError(404, 'User not found');
    }

    res.json(user);
  } catch (err) {
    next(err);
  }
};
