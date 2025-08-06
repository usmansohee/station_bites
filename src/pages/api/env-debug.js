export default function handler(req, res) {
  // Simple environment debug endpoint
  const envVars = {
    NODE_ENV: process.env.NODE_ENV,
    MONGODB_URI: process.env.MONGODB_URI ? 'SET' : 'MISSING',
    MONGODB_DB: process.env.MONGODB_DB ? 'SET' : 'MISSING',
    NEXTAUTH_URL: process.env.NEXTAUTH_URL ? 'SET' : 'MISSING',
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'SET' : 'MISSING',
    ALL_MONGO_KEYS: Object.keys(process.env).filter(key => key.includes('MONGO')),
    TOTAL_ENV_VARS: Object.keys(process.env).length,
  };

  if (process.env.MONGODB_URI) {
    envVars.MONGODB_URI_PREVIEW = process.env.MONGODB_URI;
    envVars.MONGODB_DB_PREVIEW = process.env.MONGODB_DB;
  }

  return res.status(200).json({
    message: 'Environment variables debug',
    environment: envVars,
    timestamp: new Date().toISOString(),
  });
}