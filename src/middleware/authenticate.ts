import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types/express.js';
import jwt, { JwtPayload } from 'jsonwebtoken';
import createHttpError from 'http-errors';
import { User } from '../models/userModel.js';

interface TokenPayload extends JwtPayload {
  userId: string;
}

export const authenticate = async (
  req: AuthRequest,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const token = req.cookies.token;

    if (!token) {
      throw createHttpError(401, 'Access token is missing');
    }

    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined');
    }

    const decoded = jwt.verify(token, jwtSecret) as unknown as TokenPayload;

    if (!decoded.userId) {
      throw createHttpError(401, 'Invalid token payload');
    }

    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      throw createHttpError(401, 'User not found');
    }

    req.user = {
      _id: user._id.toString(),
      email: user.email,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return next(createHttpError(401, 'Invalid or expired token'));
    }

    next(error);
  }
};
