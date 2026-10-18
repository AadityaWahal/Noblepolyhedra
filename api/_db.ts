import 'dotenv/config';
import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGODB_URI || '';

let clientPromise: Promise<MongoClient> | null = null;

/**
 * Connects to MongoDB with connection caching for Vercel Serverless Functions.
 * Reuses the existing connection pool across invocations.
 */
export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db } | null> {
  if (!uri) {
    return null;
  }

  try {
    if (!clientPromise) {
      const client = new MongoClient(uri, {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
      });
      clientPromise = client.connect();
    }

    const client = await clientPromise;
    const db = client.db('noble_polyhedra');
    return { client, db };
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    // Reset clientPromise so future requests can retry
    clientPromise = null;
    return null;
  }
}
