import { connectToDatabase } from "../../../util/mongodb";
import { ObjectId } from "mongodb";

export default async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    console.log("Add dish API called");
    const { db } = await connectToDatabase();
    
    // Get session ID from request headers or cookies
    const sessionId = req.headers['x-session-id'] || req.cookies?.adminSessionId;
    
    console.log("Session ID received:", sessionId);
    
    if (!sessionId) {
      return res.status(401).json({ message: "Unauthorized - No session" });
    }
    
    // Convert string session ID to ObjectId
    let sessionObjectId;
    try {
      sessionObjectId = new ObjectId(sessionId);
      console.log("Session ObjectId created:", sessionObjectId);
    } catch (error) {
      console.error("Invalid session ID format:", error);
      return res.status(401).json({ message: "Unauthorized - Invalid session format" });
    }
    
    // Find session in database
    const session = await db.collection("sessions").findOne({ 
      _id: sessionObjectId,
      expires: { $gt: new Date().toISOString() }
    });
    
    console.log("Session found:", !!session);
    
    if (!session || !session.admin) {
      return res.status(401).json({ message: "Unauthorized - Invalid or expired session" });
    }

    console.log("Authentication successful, processing dish data");

    const { title, category, description, regularPrice, largePrice, kingPrice, image } = req.body;

    console.log("Received dish data:", { title, category, description, regularPrice, largePrice, kingPrice, image });

    // Validate required fields
    if (!title || !category) {
      console.log("Missing required fields");
      return res.status(400).json({ message: "Title and category are required" });
    }

    // Validate prices - at least one price must be provided
    if (!regularPrice && !largePrice && !kingPrice) {
      console.log("No prices provided");
      return res.status(400).json({ message: "At least one price must be provided (regularPrice, largePrice, or kingPrice)" });
    }

    // Validate each price if provided
    if (regularPrice && (isNaN(regularPrice) || parseFloat(regularPrice) <= 0)) {
      console.log("Invalid regular price:", regularPrice);
      return res.status(400).json({ message: "Regular price must be a positive number" });
    }

    if (largePrice && (isNaN(largePrice) || parseFloat(largePrice) <= 0)) {
      console.log("Invalid large price:", largePrice);
      return res.status(400).json({ message: "Large price must be a positive number" });
    }

    if (kingPrice && (isNaN(kingPrice) || parseFloat(kingPrice) <= 0)) {
      console.log("Invalid king price:", kingPrice);
      return res.status(400).json({ message: "King price must be a positive number" });
    }

    console.log("Validation passed, inserting dish");

    // Insert the dish
    const result = await db.collection("dishes").insertOne({
      title: title.trim(),
      category: category.trim().toLowerCase(),
      createdAt: new Date(),
      // Prices - only include if provided
      ...(regularPrice && { regularPrice: parseFloat(regularPrice) }),
      ...(largePrice && { largePrice: parseFloat(largePrice) }),
      ...(kingPrice && { kingPrice: parseFloat(kingPrice) }),
      // Optional fields
      ...(description && { description: description.trim() }),
      ...(image && { image: image.trim() })
    });

    console.log("Dish inserted successfully:", result.insertedId);

    if (result.insertedId) {
      return res.status(200).json({ 
        message: "Dish added successfully",
        dishId: result.insertedId 
      });
    } else {
      return res.status(500).json({ message: "Failed to add dish" });
    }
  } catch (err) {
    console.error("Add dish error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
