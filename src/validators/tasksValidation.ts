import { z } from 'zod';
import { isValidObjectId } from 'mongoose';

export const createTaskSchema = z.object({
  title: z.string().trim().min(5).max(100),
  priority: z.number().int().min(1).max(10).default(1),
  completed: z.boolean().default(false),
});

export type CreateTaskDto = z.infer<typeof createTaskSchema>;
// ===========================================================

export const updateTaskSchema = createTaskSchema.partial();

export type UpdateTaskDto = z.infer<typeof updateTaskSchema>;

// ===========================================================
export const taskIdSchema = z.object({
  taskId: z.string().refine((value) => isValidObjectId(value), {
    message: 'Incorrect task ID format (must be valid ObjectId)',
  }),
});

export type TaskIdDto = z.infer<typeof taskIdSchema>;

// ==========================================================
export const getTasksSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(5).max(20).default(10),

  search: z.string().trim().optional(),

  completed: z
    .enum(['true', 'false'])
    .transform((value) => value === 'true')
    .optional(),

  sortBy: z.enum(['priority', 'createdAt']).default('createdAt'),

  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});
