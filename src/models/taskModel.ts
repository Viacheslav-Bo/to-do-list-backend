import { model, Schema } from 'mongoose';

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
    priority: {
      type: Number,
      min: 1,
      max: 10,
      default: 1,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

taskSchema.index({ userId: 1, completed: 1 });
taskSchema.index({ userId: 1, priority: -1 });

export const Task = model('Task', taskSchema);
