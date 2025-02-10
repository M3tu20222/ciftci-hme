import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI; // Replace with your MongoDB connection string

if (!uri) {
  throw new Error("MONGODB_URI environment variable is not set");
}

const clientPromise = new MongoClient(uri).connect();

export default clientPromise;
