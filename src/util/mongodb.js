import { MongoClient } from "mongodb";

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongo;

if (!cached) {
  cached = global.mongo = { conn: null, promise: null };
}

export async function connectToDatabase() {
  // Hardcoded production connection string (minimal format)
  const MONGODB_URI = "mongodb+srv://stationbites227:4Hqr0yaRciDkItjv@cluster0.g6qtkwl.mongodb.net/stationbites227";
  
  // Set database name for production
  const MONGODB_DB = "stationbites227";

  console.log('MongoDB connection info:', {
    using_hardcoded: true,
    database: MONGODB_DB,
    uri_format: 'mongodb+srv',
    cluster: 'cluster0.g6qtkwl.mongodb.net'
  });

  if (!MONGODB_URI) {
    console.error('MONGODB_URI is missing from environment variables');
    throw new Error(
      "MONGODB_URI environment variable is missing. Please check Vercel dashboard."
    );
  }

  // Validate URI format
  if (!MONGODB_URI.startsWith('mongodb://') && !MONGODB_URI.startsWith('mongodb+srv://')) {
    console.error('Invalid MongoDB URI format:', MONGODB_URI.substring(0, 20) + '...');
    throw new Error('Invalid MongoDB URI format');
  }

  if (!MONGODB_DB) {
    console.error('Database name could not be determined');
    throw new Error("Database name missing.");
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      // Minimal options for Vercel serverless - NO deprecated options
      maxPoolSize: 1,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 30000,
      connectTimeoutMS: 5000,
    };

    cached.promise = MongoClient.connect(MONGODB_URI, opts).then((client) => {
      console.log('MongoDB connected successfully!', "Database:", MONGODB_DB);
      return {
        client,
        db: client.db(MONGODB_DB),
      };
    });
  }
  
  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    console.log("mongodb connection error", error);
    console.error('MongoDB connection error:', {
      message: error.message,
      name: error.name,
      code: error.code,
      stack: error.stack
    });
    cached.promise = null;
    throw error;
  }
}