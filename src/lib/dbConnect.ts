// lib/dbConnect.ts
import mongoose from 'mongoose';
import { MongoClient } from 'mongodb';

const connection = { isConnected: false };

export default async function dbConnect() {
  // Check if the connection is already established
  if (connection.isConnected) return;

  if (!process.env.MONGO_URI) {
    throw new Error('MongoDB connection URI is missing. Please set MONGO_URI environment variable.');
  }

  try {
    const db = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 30000, // Timeout after 30s
    });

    connection.isConnected = db.connections[0].readyState === 1;
    console.log('✅ Database connected successfully');
  } catch (error) {
    console.error('❌ Database connection error:', error);
    throw error;
  }
}

/* -------------------------------------------
   ✅ NextAuth-compatible clientPromise setup
-------------------------------------------- */

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  // Allow reuse of global variable in dev mode
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (!process.env.MONGO_URI) {
  throw new Error('Please define the MONGO_URI environment variable inside .env.local');
}

const uri = process.env.MONGO_URI;
const options = {};

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise!;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// ✅ Fix: export a function returning the client (NextAuth expects a function)
export const getClient = async () => await clientPromise;
export { clientPromise };
