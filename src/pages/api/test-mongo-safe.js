// Test MongoDB connection with extra safety
export default async function handler(req, res) {
  console.log('MongoDB test API called');
  
  try {
    // Basic env check first
    const MONGODB_URI = process.env.MONGODB_URI;
    const MONGODB_DB = process.env.MONGODB_DB;
    
    if (!MONGODB_URI) {
      return res.status(500).json({
        error: 'MONGODB_URI not found',
        env_keys: Object.keys(process.env).filter(k => k.includes('MONGO'))
      });
    }
    
    console.log('Environment vars OK, testing import...');
    
    // Test the import
    const { connectToDatabase } = await import('../../util/mongodb');
    
    console.log('Import successful, testing connection...');
    
    // Test the connection
    const { db } = await connectToDatabase();
    
    console.log('Connection successful, testing query...');
    
    // Test a simple query
    const collections = await db.listCollections().toArray();
    
    return res.status(200).json({
      message: 'MongoDB test successful',
      collections: collections.map(c => c.name),
      dbName: db.databaseName,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('MongoDB test error:', error);
    return res.status(500).json({
      error: error.message,
      name: error.name,
      code: error.code,
      stack: error.stack.split('\n').slice(0, 5), // First 5 lines of stack
      timestamp: new Date().toISOString()
    });
  }
}