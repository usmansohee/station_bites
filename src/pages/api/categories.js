import { connectToDatabase } from "../../util/mongodb";

export default async (req, res) => {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { db } = await connectToDatabase();
        
        if (!db) {
            console.error('Database connection failed');
            return res.status(500).json({ message: "Database connection failed" });
        }

        let categories = await db.collection("categories").find({}).toArray();
        categories = JSON.parse(JSON.stringify(categories));
        
        return res.status(200).json(categories);
    } catch (err) {
        console.error('Categories API Error:', err);
        
        // Provide more specific error messages
        if (err.name === 'MongoNetworkError') {
            return res.status(500).json({ message: "Database connection error" });
        }
        
        if (err.name === 'MongoError' && err.code === 18) {
            return res.status(500).json({ message: "Authentication failed" });
        }
        
        return res.status(500).json({ message: "Internal Server Error", error: process.env.NODE_ENV === 'development' ? err.message : undefined });
    }
};
