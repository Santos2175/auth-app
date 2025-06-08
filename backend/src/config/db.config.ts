import mongoose from 'mongoose';

// Handler to connect to Mongo Database
export const connectToMongoDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error(
        'MONGO_URI missing. Please include it in your environment variables'
      );
      process.exit(1);
    }

    const conn = await mongoose.connect(process.env.MONGO_URI!);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error: any) {
    console.error(`Connection to MongoDB failed: ${error.message}`);
    process.exit(1);
  }
};
