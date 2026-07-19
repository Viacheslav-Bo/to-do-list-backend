import mongoose from 'mongoose';

export const connectMongoDB = async () => {
  try {
    const mongoUrl = process.env.MONGO_URL;
    if (!mongoUrl) {
      throw new Error(
        'The MONGO_URL environment variable is not specified in the .env file',
      );
    }

    await mongoose.connect(mongoUrl);

    console.log(
      `✅ MongoDB connected to database: ${mongoose.connection.name}`,
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('❌ Failed to connect to MongoDB:', errorMessage);
    process.exit(1);
  }
};
