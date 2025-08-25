import { ObjectId } from "mongodb";
import { connectToDatabase } from "../../../util/mongodb";

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

            const { _id, title, category, description, regularPrice, largePrice, kingPrice, image } = req.body;
            
            // Only ID and title are required
            if (!_id || !title) {
                return res.status(400).json({ message: "ID and title are required" });
            }

            // Validate each price if provided
            if (regularPrice && (isNaN(regularPrice) || parseFloat(regularPrice) <= 0)) {
                return res.status(400).json({ message: "Regular price must be a positive number" });
            }

            if (largePrice && (isNaN(largePrice) || parseFloat(largePrice) <= 0)) {
                return res.status(400).json({ message: "Large price must be a positive number" });
            }

            if (kingPrice && (isNaN(kingPrice) || parseFloat(kingPrice) <= 0)) {
                return res.status(400).json({ message: "King price must be a positive number" });
            }

            // Update the dish
            const result = await db.collection("dishes").replaceOne(
                { _id: new ObjectId(_id) },
                { 
                    title: title.trim(),
                    updatedAt: new Date(),
                    // Optional fields - only include if provided
                    ...(category && { category: category.trim().toLowerCase() }),
                    ...(regularPrice && { regularPrice: parseFloat(regularPrice) }),
                    ...(largePrice && { largePrice: parseFloat(largePrice) }),
                    ...(kingPrice && { kingPrice: parseFloat(kingPrice) }),
                    ...(description && { description: description.trim() }),
                    ...(image && { image: image.trim() })
                }
            );

            if (result.matchedCount === 0) {
                return res.status(404).json({ message: "Dish not found" });
            }

            return res.status(200).json({ message: "Dish updated successfully" });
        } else {
            return res.status(405).json({ message: "Method not allowed" });
        }
    } catch (err) {
        console.error("Update dish error:", err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
