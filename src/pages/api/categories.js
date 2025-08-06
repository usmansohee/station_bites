import { connectToDatabase } from "../../util/mongodb";

export default async (req, res) => {
    // Set CORS headers for Vercel
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        console.log('Categories API: Starting request');
        
        const { db } = await connectToDatabase();
        
        if (!db) {
            console.error('Categories API: Database connection failed');
            return res.status(500).json({ 
                message: "Database connection failed",
                timestamp: new Date().toISOString()
            });
        }

        console.log('Categories API: Database connected, fetching categories');
        
        let categories = await db.collection("categories").find({}).toArray();
        categories = JSON.parse(JSON.stringify(categories));
        
        console.log(`Categories API: Found ${categories.length} categories`);
        
        return res.status(200).json(categories);
    } catch (err) {
        console.error('Categories API Error:', {
            message: err.message,
            name: err.name,
            code: err.code,
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });
        
        // Provide more specific error messages
        if (err.name === 'MongoNetworkError') {
            return res.status(500).json({ 
                message: "Database network error",
                error: "Unable to connect to database",
                timestamp: new Date().toISOString()
            });
        }
        
        if (err.name === 'MongoServerSelectionError') {
            return res.status(500).json({ 
                message: "Database server selection error",
                error: "Database server unavailable",
                timestamp: new Date().toISOString()
            });
        }
        
        if (err.name === 'MongoError' && err.code === 18) {
            return res.status(500).json({ 
                message: "Database authentication failed",
                error: "Invalid database credentials",
                timestamp: new Date().toISOString()
            });
        }
        
        return res.status(500).json({ 
            message: "Internal Server Error",
            error: process.env.NODE_ENV === 'development' ? err.message : "Something went wrong",
            timestamp: new Date().toISOString()
        });
    }
};
