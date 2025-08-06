// Super simple test API with no MongoDB dependency
export default function handler(req, res) {
  console.log('Simple test API called');
  
  try {
    return res.status(200).json({
      message: 'Simple API working',
      timestamp: new Date().toISOString(),
      method: req.method,
      headers: Object.keys(req.headers),
      env_test: {
        NODE_ENV: process.env.NODE_ENV,
        VERCEL: process.env.VERCEL,
        MONGODB_URI_EXISTS: !!process.env.MONGODB_URI,
      }
    });
  } catch (error) {
    console.error('Simple test API error:', error);
    return res.status(500).json({
      error: error.message,
      stack: error.stack
    });
  }
}