import 'dotenv/config';
import app from './app.js';
import { connectMongoDB } from './db/connectMongoDB.js';

const PORT = process.env.PORT ?? 3000;

const startServer = async () => {
  try {
    await connectMongoDB();

    app.listen(PORT, () => {
      console.log(`Server running on ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
