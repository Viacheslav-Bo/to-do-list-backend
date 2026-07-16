import { Task } from '../models/taskModel.js';
import { SortOrder } from 'mongoose';
import { z } from 'zod';
import { getTasksSchema } from '../validators/tasksValidation.js';

type GetTasksOptions = z.infer<typeof getTasksSchema>;

export const calculatePagination = (page: number, limit: number) => {
  const skip = (page - 1) * limit;

  return {
    page,
    limit,
    skip,
  };
};

export const buildTaskFilter = (
  userId: string,
  search?: string,
  completed?: boolean,
) => {
  const filter: Record<string, unknown> = {
    userId,
  };

  if (search) {
    filter.title = {
      $regex: search,
      $options: 'i',
    };
  }

  if (completed !== undefined) {
    filter.completed = completed;
  }

  return filter;
};

export const buildTaskSort = (
  sortBy: 'priority' | 'createdAt' = 'createdAt',
  sortOrder: 'asc' | 'desc' = 'desc',
): Record<string, SortOrder> => ({
  [sortBy]: sortOrder === 'asc' ? 1 : -1,
});

export async function getTasksService(
  userId: string,
  options: GetTasksOptions,
) {
  const { page, limit, search, completed, sortBy, sortOrder } = options;

  const { skip } = calculatePagination(page, limit);

  const filter = buildTaskFilter(userId, search, completed);

  const sort = buildTaskSort(sortBy, sortOrder);

  const [totalItems, tasks] = await Promise.all([
    Task.countDocuments(filter),
    Task.find(filter).sort(sort).skip(skip).limit(limit),
  ]);

  const totalPages = Math.ceil(totalItems / limit);

  return {
    items: tasks,
    page,
    limit,
    totalItems,
    totalPages,
    hasPreviousPage: page > 1,
    hasNextPage: page < totalPages,
  };
}
