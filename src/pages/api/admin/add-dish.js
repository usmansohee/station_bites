import { connectToDatabase } from "../../../util/mongodb";

export default async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { db } = await connectToDatabase();
    
    // Get session ID from request headers or cookies
    const sessionId = req.headers['x-session-id'] || req.cookies?.adminSessionId;
    
    if (!sessionId) {
      return res.status(401).json({ message: "Unauthorized - No session" });
    }
    
    // Find session in database
    const session = await db.collection("sessions").findOne({ 
      _id: sessionId,
      expires: { $gt: new Date().toISOString() }
    });
    
    if (!session || !session.admin) {
      return res.status(401).json({ message: "Unauthorized - Invalid or expired session" });
    }

    const { title, category, description, price, image } = req.body;

    // Validate required fields
    if (!title || !category || !description || !price || !image) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate price
    if (isNaN(price) || parseFloat(price) <= 0) {
      return res.status(400).json({ message: "Price must be a positive number" });
    }

    // Insert the dish
    const result = await db.collection("dishes").insertOne({
      title: title.trim(),
      category: category.trim(),
      description: description.trim(),
      price: parseFloat(price),
      image: image,
      createdAt: new Date()
    });

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
