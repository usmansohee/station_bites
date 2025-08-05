export default async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    return res.status(200).json({ 
      message: "API is working!",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      envVars: {
        MONGODB_URI: !!process.env.MONGODB_URI,
        MONGODB_DB: !!process.env.MONGODB_DB,
        NEXTAUTH_URL: process.env.NEXTAUTH_URL,
        HOST: process.env.HOST
      }
    });
  } catch (err) {
    console.error('Test API Error:', err);
    return res.status(500).json({ message: "Test API failed", error: err.message });
  }
}; 