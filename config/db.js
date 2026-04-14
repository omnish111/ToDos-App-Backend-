import mongoose from "mongoose";

const sanitizeMongoUri = (uri = "") =>
  uri.replace(/(mongodb\+srv:\/\/[^:]+:)([^@]+)(@)/, "$1****$3");

const connectDB = async () => {
  const mongoUri = (
    process.env.MONGODB_URI ||
    process.env.MONGO_URI ||
    ""
  ).trim();

  if (!mongoUri) {
    throw new Error(
      "MongoDB URI is missing. Set MONGODB_URI (or MONGO_URI) in environment variables.",
    );
  }

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    });

    console.log(`MongoDB connected (${sanitizeMongoUri(mongoUri)})`);
  } catch (error) {
    console.error(
      `MongoDB connection failed (${sanitizeMongoUri(mongoUri)}): ${error.message}`,
    );
    throw error;
  }
};

export default connectDB;
