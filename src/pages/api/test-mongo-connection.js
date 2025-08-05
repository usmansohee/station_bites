import { MongoClient } from "mongodb";

export default async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const MONGODB_URI = process.env.MONGODB_URI;
  const MONGODB_DB = process.env.MONGODB_DB;

  if (!MONGODB_URI || !MONGODB_DB) {
    return res.status(500).json({ 
      message: "Missing environment variables",
      MONGODB_URI: !!MONGODB_URI,
      MONGODB_DB: !!MONGODB_DB
    });
  }

  // Test different connection configurations
  const configs = [
    {
      name: "Default Config",
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    },
    {
      name: "SSL Config",
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        ssl: true,
        sslValidate: true,
      }
    },
    {
      name: "TLS Config",
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        tls: true,
        tlsAllowInvalidCertificates: false,
      }
    },
    {
      name: "Minimal Config",
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 10000,
      }
    }
  ];

  const results = [];

  for (const config of configs) {
    try {
      const client = new MongoClient(MONGODB_URI, config.options);
      await client.connect();
      
      const db = client.db(MONGODB_DB);
      const collections = await db.listCollections().toArray();
      
      await client.close();
      
      results.push({
        config: config.name,
        status: "SUCCESS",
        collections: collections.length
      });
    } catch (error) {
      results.push({
        config: config.name,
        status: "FAILED",
        error: error.message,
        errorName: error.name
      });
    }
  }

  return res.status(200).json({
    message: "MongoDB connection tests completed",
    results,
    summary: {
      successful: results.filter(r => r.status === "SUCCESS").length,
      failed: results.filter(r => r.status === "FAILED").length,
      total: results.length
    }
  });
}; 