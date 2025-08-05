import { connectToDatabase } from "../../util/mongodb";

export default async (req, res) => {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        // Check environment variables
        const envCheck = {
            MONGODB_URI: !!process.env.MONGODB_URI,
            MONGODB_DB: !!process.env.MONGODB_DB,
        };

        // Test database connection
        const { db } = await connectToDatabase();
        
        if (!db) {
            return res.status(500).json({ 
                message: "Database connection failed",
                envCheck,
                status: 'error'
            });
        }

        // Test a simple query
        const collections = await db.listCollections().toArray();
        
        return res.status(200).json({ 
            message: "API is healthy",
            envCheck,
            database: "connected",
            collections: collections.length,
            status: 'healthy'
        });
    } catch (err) {
        console.error('Health Check Error:', err);
        
        return res.status(500).json({ 
            message: "Health check failed",
            error: process.env.NODE_ENV === 'development' ? err.message : undefined,
            status: 'error'
        });
    }
}; 