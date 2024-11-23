import mongoose from "mongoose";

// const MONGO_URI = "mongodb://localhost:27017/keyStoneBiddingApp";
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error("Please add your Mongo URI to the .env file");
}

let isConnected = false;

export async function connectToDatabase() {
  if (isConnected) return;
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = true;
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
    process.exit(1);
  }
}
