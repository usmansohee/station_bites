import { connectToDatabase } from "../../../util/mongodb";
import bcrypt from "bcryptjs";

export default async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const { db } = await connectToDatabase();
    
    // Find admin by username
    const admin = await db.collection("admins").findOne({ username: username });
    
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Check password
    const isValidPassword = await bcrypt.compare(password, admin.password);
    
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Create session
    const session = {
      user: {
        name: admin.username,
        email: admin.email || `${admin.username}@admin.com`,
        image: null
      },
      admin: true,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
    };
    
    // Store session in database
    const sessionResult = await db.collection("sessions").insertOne(session);
    
    return res.status(200).json({ 
      message: 'Login successful',
      session: {
        ...session,
        _id: sessionResult.insertedId
      },
      sessionId: sessionResult.insertedId
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}; 