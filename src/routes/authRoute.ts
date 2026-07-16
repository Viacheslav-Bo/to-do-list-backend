import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { validateBody } from '../middleware/validateBody.js';
import { authenticate } from '../middleware/authenticate.js';
import { loginUser } from '../controllers/auth/login.js';
import { registerUser } from '../controllers/auth/register.js';
import { logoutUser } from '../controllers/auth/logout.js';
import {
  registerUserSchema,
  loginUserSchema,
} from '../validators/authValidation.js';

const authRoute = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: 'Too many attempts. Try it later.' },
});

authRoute.post('/login', authLimiter, validateBody(loginUserSchema), loginUser);
authRoute.post('/logout', authenticate, logoutUser);
authRoute.post(
  '/register',
  authLimiter,
  validateBody(registerUserSchema),
  registerUser,
);

export default authRoute;
