import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import { connectToDatabase } from "../../../util/mongodb";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Check authentication
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

    const form = new formidable.IncomingForm({
      uploadDir: path.join(process.cwd(), 'public', 'uploads'),
      keepExtensions: true,
      maxFileSize: 5 * 1024 * 1024, // 5MB limit
    });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(500).json({ message: 'Upload failed', error: err.message });
      }

      const file = files.image;
      if (!file) {
        return res.status(400).json({ message: 'No image file provided' });
      }

      // Generate unique filename
      const timestamp = Date.now();
      const originalName = file.originalFilename;
      const extension = path.extname(originalName);
      const newFileName = `dish_${timestamp}${extension}`;
      
      // Move file to final location
      const finalPath = path.join(process.cwd(), 'public', 'uploads', 'dishes', newFileName);
      
      // Ensure directory exists
      const uploadDir = path.dirname(finalPath);
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      // Move file
      fs.renameSync(file.filepath, finalPath);

      // Return the public URL
      const publicUrl = `/uploads/dishes/${newFileName}`;
      
      return res.status(200).json({ 
        message: 'Image uploaded successfully',
        imageUrl: publicUrl,
        filename: newFileName
      });
    });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ message: 'Upload failed', error: error.message });
  }
} 