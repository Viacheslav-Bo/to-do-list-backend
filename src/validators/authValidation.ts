import { z } from 'zod';

export const registerUserSchema = z.object({
  name: z.string().max(32).trim(),
  email: z.string().email().max(64),
  password: z.string().min(6).max(128),
});

export const loginUserSchema = z.object({
  email: z.string().email().max(64),
  password: z.string().min(6).max(128),
});
