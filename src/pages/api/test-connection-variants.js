// Test different MongoDB connection configurations
import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
  console.log('Testing MongoDB connection variants');
  
  const MONGODB_URI = "mongodb+srv://stationbites227:4Hqr0yaRciDkItjv@cluster0.g6qtkwl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
  const MONGODB_DB = "stationbites227";
  
  const connectionTests = [
    {
      name: "Standard TLS",
      options: {
        maxPoolSize: 1,
        serverSelectionTimeoutMS: 5000,
        tls: true,
      }
    },
    {
      name: "Legacy SSL",
      options: {
        maxPoolSize: 1,
        serverSelectionTimeoutMS: 5000,
        ssl: true,
        sslValidate: true,
      }
    },
    {
      name: "Relaxed SSL",
      options: {
        maxPoolSize: 1,
        serverSelectionTimeoutMS: 5000,
        tls: true,
        tlsAllowInvalidCertificates: true,
        tlsAllowInvalidHostnames: true,
      }
    },
    {
      name: "No SSL options",
      options: {
        maxPoolSize: 1,
        serverSelectionTimeoutMS: 5000,
      }
    }
  ];
  
  const results = [];
  
  for (const test of connectionTests) {
    try {
      console.log(`Testing ${test.name}...`);
      const client = new MongoClient(MONGODB_URI, test.options);
      await client.connect();
      const db = client.db(MONGODB_DB);
      const collections = await db.listCollections().toArray();
      await client.close();
      
      results.push({
        test: test.name,
        status: "SUCCESS",
        collections: collections.length,
        dbName: db.databaseName
      });
    } catch (error) {
      results.push({
        test: test.name,
        status: "FAILED",
        error: error.message,
        errorName: error.name,
        errorCode: error.code
      });
    }
  }
  
  return res.status(200).json({
    message: "Connection tests completed",
    results,
    timestamp: new Date().toISOString()
  });
}