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
  // Hardcoded production connection string (clean MongoDB Atlas format)
  const MONGODB_URI = "mongodb+srv://stationbites227:4Hqr0yaRciDkItjv@cluster0.g6qtkwl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
  
  // Fallback to env var if needed
  const ENV_URI = process.env.MONGODB_URI;
  
  // Set database name for production
  let MONGODB_DB = "stationbites227"; // Hardcoded for production
  
  // Fallback to env var if needed
  if (process.env.MONGODB_DB) {
    MONGODB_DB = process.env.MONGODB_DB;
  }

  console.log('Environment check:', {
    MONGODB_URI: MONGODB_URI ? 'SET' : 'MISSING',
    MONGODB_DB: MONGODB_DB ? 'SET' : 'MISSING',
    EXTRACTED_DB: MONGODB_DB,
    NODE_ENV: process.env.NODE_ENV,
    ALL_ENV_KEYS: Object.keys(process.env).filter(key => key.includes('MONGO')),
  });

  if (!MONGODB_URI) {
    console.error('MONGODB_URI is missing from environment variables');
    throw new Error(
      "MONGODB_URI environment variable is missing. Please check Vercel dashboard."
    );
  }

  // Validate URI format and content
  if (!MONGODB_URI.startsWith('mongodb://') && !MONGODB_URI.startsWith('mongodb+srv://')) {
    console.error('Invalid MongoDB URI format:', MONGODB_URI.substring(0, 20) + '...');
    throw new Error('Invalid MongoDB URI format');
  }

  // Log the URI structure for debugging
  console.log('MongoDB connection info:', {
    using_hardcoded: true,
    database: MONGODB_DB,
    uri_format: 'mongodb+srv',
    cluster: 'cluster0.g6qtkwl.mongodb.net'
  });

  if (!MONGODB_DB) {
    console.error('Database name could not be determined from URI or MONGODB_DB env var');
    throw new Error(
      "Database name missing. Please set MONGODB_DB environment variable or include database name in MONGODB_URI."
    );
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      // Optimized for Vercel serverless functions
      maxPoolSize: 1,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
      // Reduce connection overhead for serverless
      maxIdleTimeMS: 30000,
    };

    cached.promise = MongoClient.connect(MONGODB_URI, opts).then((client) => {
      console.log('MongoDB connected successfully!',"MONGODB_URI:",MONGODB_URI, "MONGODB_DB:",MONGODB_DB);
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
    console.log("mongodb connection error",error);
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
