import "mongoose";
import mongoose from "mongoose";

const connectDB = (MONGO_URL: string) => {
  mongoose.set("strictQuery", true);
  console.log("Database connected.");

  return mongoose.connect(MONGO_URL);
};

export { connectDB };
