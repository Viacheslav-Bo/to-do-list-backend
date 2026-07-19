import { model, Schema } from 'mongoose';
import { TASK_CATEGORIES } from '../constants/categories.js';

const taskSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      trim: true,
      required: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    priority: {
      type: Number,
      min: 1,
      max: 10,
      default: 5,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    isPrivate: {
      type: Boolean,
      default: false,
    },
    category: {
      type: String,
      enum: TASK_CATEGORIES,
      default: 'Todo',
    },
    dueDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

taskSchema.index({ userId: 1, isCompleted: 1 });
taskSchema.index({ userId: 1, priority: -1 });
taskSchema.index({ userId: 1, category: 1 });
taskSchema.index({ userId: 1, isCompleted: 1, dueDate: 1 });
taskSchema.index({ userId: 1, isPrivate: 1 });

export const Task = model('Task', taskSchema);
