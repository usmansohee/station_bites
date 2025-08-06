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
  // Validate environment variables at runtime, not at module load
  // Only use MONGODB_URI to avoid conflicts
  const MONGODB_URI = process.env.MONGODB_URI;
  
  // Extract database name from URI if MONGODB_DB is not provided
  let MONGODB_DB = process.env.MONGODB_DB;
  
  if (!MONGODB_DB && MONGODB_URI) {
    // Extract database name from the URI (between last '/' and '?')
    const match = MONGODB_URI.match(/\/([^?]+)(?:\?|$)/);
    if (match && match[1]) {
      MONGODB_DB = match[1];
      console.log('Extracted database name from URI:', MONGODB_DB);
    }
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

  // Additional validation - check for common URI issues
  if (MONGODB_URI.includes('undefined') || MONGODB_URI.includes('null')) {
    console.error('MongoDB URI contains undefined/null values');
    throw new Error('MongoDB URI contains invalid values');
  }

  // Log the URI structure for debugging (first 50 chars)
  console.log('MongoDB URI structure check:', {
    starts_with: MONGODB_URI.substring(0, 15),
    has_at_symbol: MONGODB_URI.includes('@'),
    has_slash_after_net: MONGODB_URI.includes('.net/'),
    length: MONGODB_URI.length
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
