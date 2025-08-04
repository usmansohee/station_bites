import { ObjectId } from "mongodb";
import { connectToDatabase } from "../../../util/mongodb";
import fs from 'fs';
import path from 'path';

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

            const { _id } = req.body;
            
            if (!_id) {
                return res.status(400).json({ message: "Dish ID is required" });
            }

            // Get the dish to find the image file
            const dish = await db.collection("dishes").findOne({ _id: new ObjectId(_id) });
            
            if (!dish) {
                return res.status(404).json({ message: "Dish not found" });
            }

            // Delete the dish from database
            const result = await db.collection("dishes").deleteOne({ _id: new ObjectId(_id) });
            
            if (result.deletedCount === 0) {
                return res.status(404).json({ message: "Dish not found" });
            }

            // Delete the associated image file if it exists
            if (dish.image) {
                try {
                    const imagePath = dish.image.replace('/uploads/', '');
                    const fullPath = path.join(process.cwd(), 'public', imagePath);
                    
                    if (fs.existsSync(fullPath)) {
                        fs.unlinkSync(fullPath);
                        console.log("Image file deleted:", fullPath);
                    }
                } catch (fileError) {
                    console.error("Error deleting image file:", fileError);
                    // Don't fail the request if image deletion fails
                }
            }

            return res.status(200).json({ message: "Dish deleted successfully" });
        } else {
            return res.status(405).json({ message: "Method not allowed" });
        }
    } catch (err) {
        console.error("Delete dish error:", err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
