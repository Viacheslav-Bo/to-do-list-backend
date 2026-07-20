import { Request, Response, NextFunction } from 'express';

export const logoutUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      path: '/',
    });
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
};
