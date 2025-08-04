import { connectToDatabase } from "../../util/mongodb";

export default async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const { db } = await connectToDatabase();
    
    // Check if admin already exists
    const existingAdmin = await db.collection("admins").findOne({ user: email });
    
    if (existingAdmin) {
      return res.status(200).json({ message: 'Admin already exists', email });
    }
    
    // Add new admin
    const result = await db.collection("admins").insertOne({ user: email });
    
    return res.status(200).json({ 
      message: 'Admin added successfully',
      email,
      id: result.insertedId
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}; 