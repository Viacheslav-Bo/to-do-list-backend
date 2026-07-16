import { z } from 'zod';

export const updateUserSchema = z.object({
  name: z
    .string()
    .min(2, 'The name must be no shorter than 2 characters')
    .max(30, 'The name must be no longer than 30 characters')
    .optional(),
  email: z.string().email('Uncorect mail format').optional(),
});
