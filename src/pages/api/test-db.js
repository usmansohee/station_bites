// Simple test using our actual MongoDB connection
import { connectToDatabase } from "../../util/mongodb";

export default async function handler(req, res) {
  try {
    console.log('Testing database connection...');
    
    const { db } = await connectToDatabase();
    
    const collections = await db.listCollections().toArray();
    const categoriesCount = await db.collection("categories").countDocuments();
    const dishesCount = await db.collection("dishes").countDocuments();
    
    return res.status(200).json({
      success: true,
      database: db.databaseName,
      collections: collections.map(c => c.name),
      counts: {
        categories: categoriesCount,
        dishes: dishesCount
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Database test error:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
      name: error.name,
      code: error.code,
      timestamp: new Date().toISOString()
    });
  }
}