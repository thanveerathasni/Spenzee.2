import mongoose from "mongoose";
import { env } from "./env.js";

export const connectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(env.MONGO_URI);

    console.log(" MongoDB connected successfully");
  } catch (error) {
    console.error(" Failed to connect to MongoDB");
    console.error(error);

    process.exit(1);
  }
};