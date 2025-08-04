import { connectToDatabase } from "./mongodb";

export const checkAdminAuth = async (req) => {
  try {
    // Get session from request headers or cookies
    const sessionId = req.headers['x-session-id'] || req.cookies?.adminSession;
    
    if (!sessionId) {
      return { isAdmin: false, error: 'No session found' };
    }

    const { db } = await connectToDatabase();
    
    // Find session in database
    const session = await db.collection("sessions").findOne({ 
      _id: sessionId,
      expires: { $gt: new Date().toISOString() }
    });
    
    if (!session || !session.admin) {
      return { isAdmin: false, error: 'Invalid or expired session' };
    }
    
    return { isAdmin: true, session };
  } catch (err) {
    console.error('Admin auth error:', err);
    return { isAdmin: false, error: 'Authentication error' };
  }
}; 