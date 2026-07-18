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
  isCompleted?: boolean,
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

  if (isCompleted !== undefined) {
    filter.isCompleted = isCompleted;
  }

  return filter;
};

export const buildTaskSort = (
  sortBy?: 'priority' | 'createdAt' | 'dueDate',
  sortOrder: 'asc' | 'desc' = 'desc',
): Record<string, SortOrder> => {
  const order: SortOrder = sortOrder === 'asc' ? 1 : -1;
  if (!sortBy) {
    return {
      isCompleted: 1,
      dueDate: 1,
    };
  }

  return { [sortBy]: order } as Record<string, SortOrder>;
};

export async function getTasksService(
  userId: string,
  options: GetTasksOptions,
) {
  const { page, limit, search, isCompleted, sortBy, sortOrder } = options;

  const { skip } = calculatePagination(page, limit);

  const filter = buildTaskFilter(userId, search, isCompleted);

  const sort = sortBy
    ? ({ [sortBy]: sortOrder === 'asc' ? 1 : -1 } as Record<string, SortOrder>)
    : ({ isCompleted: 1, dueDate: 1 } as Record<string, SortOrder>);

  const [totalItems, tasks] = await Promise.all([
    Task.countDocuments(filter),
    Task.find(filter).sort(sort).skip(skip).limit(limit),
  ]);

  console.log('===== GET TASKS =====');
  console.log('Filter:', filter);
  console.log('Limit:', limit);
  console.log('Total in DB:', totalItems);
  console.log('Returned:', tasks.length);
  console.log('=====================');

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
