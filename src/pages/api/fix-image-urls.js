import { connectToDatabase } from "../../util/mongodb";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { db } = await connectToDatabase();
    
    // Find all dishes with full URLs
    const dishes = await db.collection("dishes").find({
      image: { $regex: /^https?:\/\/localhost:3005\/uploads\/dishes\// }
    }).toArray();
    
    console.log(`Found ${dishes.length} dishes with full URLs to fix`);
    
    let fixedCount = 0;
    for (const dish of dishes) {
      // Convert full URL to relative path
      const relativePath = dish.image.replace(/^https?:\/\/localhost:3005/, '');
      
      console.log(`Converting ${dish.image} to ${relativePath}`);
      
      // Update the dish
      await db.collection("dishes").updateOne(
        { _id: dish._id },
        { $set: { image: relativePath } }
      );
      
      fixedCount++;
    }
    
    console.log(`Fixed ${fixedCount} image URLs`);
    
    return res.status(200).json({ 
      message: `Fixed ${fixedCount} image URLs`,
      fixedCount 
    });
  } catch (error) {
    console.error('Error fixing image URLs:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
} 