import 'dotenv/config';

import bcrypt from 'bcrypt';

import { connectMongoDB } from './connectMongoDB.js';

import { User } from '../models/userModel.js';
import { Task } from '../models/taskModel.js';

import { demoUser, demoTasks } from './seedData.js';

const seed = async () => {
  try {
    await connectMongoDB();

    console.log('Connected');

    await User.deleteMany({});
    await Task.deleteMany({});

    console.log('Collections cleared');

    const hashedPassword = await bcrypt.hash(demoUser.password, 10);

    const user = await User.create({
      ...demoUser,
      password: hashedPassword,
    });

    const tasks = demoTasks.map((task) => ({
      ...task,
      userId: user._id.toString(),
    }));

    await Task.insertMany(tasks);

    console.log('==========================');
    console.log('Database seeded');
    console.log('Email:', demoUser.email);
    console.log('Password:', demoUser.password);
    console.log(`Tasks created: ${tasks.length}`);
    console.log('==========================');

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();
