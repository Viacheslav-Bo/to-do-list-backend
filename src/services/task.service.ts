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
  category?: string,
  isPrivate?: boolean,
  dueToday?: boolean,
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

  if (category) {
    filter.category = category;
  }

  if (isPrivate !== undefined) {
    filter.isPrivate = isPrivate;
  }

  if (dueToday) {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    filter.dueDate = { $gte: startOfDay, $lte: endOfDay };
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
      priority: -1,
      dueDate: 1,
      createdAt: -1,
    };
  }

  if (sortBy === 'priority') {
    return {
      isCompleted: 1,
      priority: order,
      dueDate: 1,
      createdAt: -1,
    };
  }

  if (sortBy === 'dueDate') {
    return {
      isCompleted: 1,
      dueDate: order,
      priority: -1,
      createdAt: -1,
    };
  }

  return {
    isCompleted: 1,
    createdAt: order,
  };
};

export async function getTasksService(
  userId: string,
  options: GetTasksOptions,
) {
  const {
    page,
    limit,
    search,
    isCompleted,
    sortBy,
    sortOrder,
    category,
    isPrivate,
    dueToday,
  } = options;

  const { skip } = calculatePagination(page, limit);

  const filter = buildTaskFilter(
    userId,
    search,
    isCompleted,
    category,
    isPrivate,
    dueToday,
  );
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
