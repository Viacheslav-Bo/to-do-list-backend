import { z } from 'zod';
import { isValidObjectId } from 'mongoose';
import { TASK_CATEGORIES } from '../constants/categories.js';

export const createTaskSchema = z.object({
  title: z.string().trim().min(5).max(100),
  description: z.string().trim().optional().default(''),
  priority: z.number().int().min(1).max(10).default(1),
  isCompleted: z.boolean().default(false),
  isPrivate: z.boolean().default(false),
  category: z.enum(TASK_CATEGORIES).default('Todo'),
  dueDate: z.coerce.date().default(() => new Date()),
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
  isCompleted: z
    .enum(['true', 'false'])
    .transform((v) => v === 'true')
    .optional(),
  category: z.enum(TASK_CATEGORIES).optional(),
  isPrivate: z
    .enum(['true', 'false'])
    .transform((v) => v === 'true')
    .optional(),
  dueToday: z
    .enum(['true', 'false'])
    .transform((v) => v === 'true')
    .optional(),
  sortBy: z.enum(['priority', 'createdAt', 'dueDate']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});
