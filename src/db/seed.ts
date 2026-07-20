import 'dotenv/config';

import bcrypt from 'bcrypt';

import { connectMongoDB } from './connectMongoDB.js';

import { User } from '../models/userModel.js';
import { Task } from '../models/taskModel.js';

import { demoUsers, demoTasks } from './seedData.js';

const seed = async () => {
  try {
    await connectMongoDB();

    console.log('Connected');

    await User.deleteMany({});
    await Task.deleteMany({});

    console.log('Collections cleared');

    const createdUsers = [];

    for (const demoUser of demoUsers) {
      const hashedPassword = await bcrypt.hash(demoUser.password, 10);

      const user = await User.create({
        ...demoUser,
        password: hashedPassword,
      });

      createdUsers.push(user);
    }

    const tasks = createdUsers.flatMap((user) =>
      demoTasks.map((task) => ({
        ...task,
        userId: user._id.toString(),
      })),
    );

    await Task.insertMany(tasks);

    console.log('==========================');
    console.log('Database seeded');

    demoUsers.forEach((user) => {
      console.log('Email:', user.email);
      console.log('Password:', user.password);
    });

    console.log(`Users created: ${createdUsers.length}`);
    console.log(`Tasks created: ${tasks.length}`);
    console.log('==========================');

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();
