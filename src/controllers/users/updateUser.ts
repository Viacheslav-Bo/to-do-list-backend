import createHttpError from 'http-errors';
import { User } from '../../models/userModel.js';
import { AuthRequest } from '../../types/express';
import { Response, NextFunction } from 'express';

export const updateUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      throw createHttpError(401, 'Unauthorized');
    }

    const { name, email } = req.body;

    if (email) {
      const existingUser = await User.findOne({
        email,
        _id: { $ne: userId },
      });

      if (existingUser) {
        throw createHttpError(409, 'This email address is already in use.');
      }
    }

    const user = await User.findOneAndUpdate(
      { _id: userId },
      { name, email },
      { returnDocument: 'after', runValidators: true },
    );

    if (!user) {
      throw createHttpError(404, 'User not found');
    }

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};
