import { connectToDatabase } from "../../../util/mongodb";
import { ObjectId } from "mongodb";

export default async (req, res) => {
    try {
        if (req.method === "POST") {
            const { db } = await connectToDatabase();
            
            // Get session ID from request headers or cookies
            const sessionId = req.headers['x-session-id'] || req.cookies?.adminSessionId;
            
            if (!sessionId) {
                return res.status(401).json({ message: "Unauthorized - No session" });
            }
            
            // Convert string session ID to ObjectId
            let sessionObjectId;
            try {
                sessionObjectId = new ObjectId(sessionId);
            } catch (error) {
                return res.status(401).json({ message: "Unauthorized - Invalid session format" });
            }
            
            // Find session in database
            const session = await db.collection("sessions").findOne({ 
                _id: sessionObjectId,
                expires: { $gt: new Date().toISOString() }
            });
            
            if (!session || !session.admin) {
                return res.status(401).json({ message: "Unauthorized - Invalid or expired session" });
            }
            
            const { name } = req.body;
            
            // Validate input
            if (!name || typeof name !== 'string' || name.trim().length < 2) {
                return res.status(400).json({ message: "Category name must be at least 2 characters long" });
            }
            
            const trimmedName = name.trim();
            
            // Check if category already exists
            const existingCategory = await db.collection("categories").findOne({ 
                name: { $regex: new RegExp(`^${trimmedName}$`, 'i') } 
            });
            
            if (existingCategory) {
                return res.status(409).json({ message: "Category already exists" });
            }
            
            // Insert the category
            const result = await db.collection("categories").insertOne({
                name: trimmedName,
                createdAt: new Date()
            });
            
            if (result.insertedId) {
                return res.status(200).json({ 
                    message: "Category added successfully",
                    categoryId: result.insertedId 
                });
            } else {
                return res.status(500).json({ message: "Failed to add category" });
            }
        } else {
            return res.status(405).json({ message: "Method not allowed" });
        }
    } catch (err) {
        console.error("Add category error:", err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
