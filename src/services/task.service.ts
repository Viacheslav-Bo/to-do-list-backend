import { Task } from '../models/taskModel.js';
import { SortOrder } from 'mongoose';
import { z } from 'zod';
import { getTasksSchema } from '../validators/tasksValidation.js';
import mongoose from 'mongoose';

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

export async function getTaskStatsService(userId: string) {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const [result] = await Task.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId) } },
    {
      $facet: {
        total: [{ $count: 'count' }],
        active: [{ $match: { isCompleted: false } }, { $count: 'count' }],
        private: [{ $match: { isPrivate: true } }, { $count: 'count' }],
        completed: [{ $match: { isCompleted: true } }, { $count: 'count' }],
        dueTodayTotal: [
          { $match: { dueDate: { $gte: startOfDay, $lte: endOfDay } } },
          { $count: 'count' },
        ],
        dueTodayUndone: [
          {
            $match: {
              isCompleted: false,
              dueDate: { $gte: startOfDay, $lte: endOfDay },
            },
          },
          { $count: 'count' },
        ],
        overdue: [
          { $match: { isCompleted: false, dueDate: { $lt: startOfDay } } },
          { $count: 'count' },
        ],
        priorityBreakdown: [
          { $match: { isCompleted: false } },
          {
            $bucket: {
              groupBy: '$priority',
              boundaries: [1, 4, 8, 11],
              default: 'other',
              output: { count: { $sum: 1 } },
            },
          },
        ],
        upcomingDeadlines: [
          { $match: { isCompleted: false } },
          { $sort: { dueDate: 1 } },
          { $limit: 5 },
          { $project: { title: 1, dueDate: 1, priority: 1, category: 1 } },
        ],
      },
    },
  ]);

  const count = (facet: { count: number }[]) => facet[0]?.count ?? 0;

  const priorityBreakdown = { high: 0, medium: 0, low: 0 };
  for (const bucket of result.priorityBreakdown as {
    _id: number;
    count: number;
  }[]) {
    if (bucket._id === 1) priorityBreakdown.low = bucket.count;
    else if (bucket._id === 4) priorityBreakdown.medium = bucket.count;
    else if (bucket._id === 8) priorityBreakdown.high = bucket.count;
  }

  return {
    totalTasks: count(result.total),
    activeTasks: count(result.active),
    privateTasks: count(result.private),
    completedTasks: count(result.completed),
    dueTodayTotal: count(result.dueTodayTotal),
    dueTodayUndone: count(result.dueTodayUndone),
    overdueCount: count(result.overdue),
    priorityBreakdown,
    upcomingDeadlines: result.upcomingDeadlines,
  };
}
