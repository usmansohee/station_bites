import { connectToDatabase } from "../../util/mongodb";

export default async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { db } = await connectToDatabase();
    
    if (!db) {
      console.error('Database connection failed in dishes API');
      return res.status(500).json({ message: "Database connection failed" });
    }

    let dishes = await db.collection("dishes").find({}).toArray();
    dishes = JSON.parse(JSON.stringify(dishes));
    
    return res.status(200).json(dishes);
  } catch (err) {
    console.error('Dishes API Error:', err);
    
    // Provide more specific error messages
    if (err.name === 'MongoNetworkError') {
      return res.status(500).json({ message: "Database connection error" });
    }
    
    if (err.name === 'MongoError' && err.code === 18) {
      return res.status(500).json({ message: "Authentication failed" });
    }
    
    return res.status(500).json({ 
      message: "Internal Server Error", 
      error: process.env.NODE_ENV === 'development' ? err.message : undefined 
    });
  }
};


/*dis.forEach(async(itm)=>{
        await db.collection("dishes").insertOne(itm)
    })*/

//await db.collection("dishes").deleteMany({})
