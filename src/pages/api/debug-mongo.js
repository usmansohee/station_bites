import { MongoClient } from "mongodb";

export default async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Check environment variables
    const envCheck = {
      MONGODB_URI: process.env.MONGODB_URI ? 'Set' : 'Missing',
      MONGODB_DB: process.env.MONGODB_DB ? 'Set' : 'Missing',
      NODE_ENV: process.env.NODE_ENV,
    };

    if (!process.env.MONGODB_URI) {
      return res.status(500).json({ 
        message: "MONGODB_URI is missing",
        envCheck,
        error: "Environment variable not set"
      });
    }

    if (!process.env.MONGODB_DB) {
      return res.status(500).json({ 
        message: "MONGODB_DB is missing",
        envCheck,
        error: "Environment variable not set"
      });
    }

    // Test direct MongoDB connection
    const client = new MongoClient(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    await client.connect();
    
    const db = client.db(process.env.MONGODB_DB);
    
    // Test collections
    const collections = await db.listCollections().toArray();
    
    // Test dishes collection
    const dishesCount = await db.collection("dishes").countDocuments();
    const categoriesCount = await db.collection("categories").countDocuments();
    
    await client.close();

    return res.status(200).json({ 
      message: "MongoDB connection successful!",
      envCheck,
      database: process.env.MONGODB_DB,
      collections: collections.map(c => c.name),
      dishesCount,
      categoriesCount,
      status: 'connected'
    });

  } catch (err) {
    console.error('MongoDB Debug Error:', err);
    
    return res.status(500).json({ 
      message: "MongoDB connection failed",
      error: err.message,
      errorName: err.name,
      errorCode: err.code,
      envCheck: {
        MONGODB_URI: process.env.MONGODB_URI ? 'Set' : 'Missing',
        MONGODB_DB: process.env.MONGODB_DB ? 'Set' : 'Missing',
        NODE_ENV: process.env.NODE_ENV,
      },
      status: 'failed'
    });
  }
}; 