import { connectToDatabase } from "../../../util/mongodb";
import { ObjectId } from "mongodb";
import fs from 'fs';
import path from 'path';

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
    console.log("Upload image API called");
    
    // Check authentication
    const { db } = await connectToDatabase();
    
    // Get session ID from request headers or cookies
    const sessionId = req.headers['x-session-id'] || req.cookies?.adminSessionId;
    
    console.log("Session ID received:", sessionId);
    
    if (!sessionId) {
      return res.status(401).json({ message: "Unauthorized - No session" });
    }
    
    // Convert string session ID to ObjectId
    let sessionObjectId;
    try {
      sessionObjectId = new ObjectId(sessionId);
      console.log("Session ObjectId created:", sessionObjectId);
    } catch (error) {
      console.error("Invalid session ID format:", error);
      return res.status(401).json({ message: "Unauthorized - Invalid session format" });
    }
    
    // Find session in database
    const session = await db.collection("sessions").findOne({ 
      _id: sessionObjectId,
      expires: { $gt: new Date().toISOString() }
    });
    
    console.log("Session found:", !!session);
    
    if (!session || !session.admin) {
      return res.status(401).json({ message: "Unauthorized - Invalid or expired session" });
    }

    console.log("Authentication successful, processing file upload");

    // Use a simpler approach with raw body parsing
    const chunks = [];
    req.on('data', chunk => {
      chunks.push(chunk);
    });

    req.on('end', async () => {
      try {
        const buffer = Buffer.concat(chunks);
        
        // Parse multipart form data manually
        const boundary = req.headers['content-type'].split('boundary=')[1];
        const parts = buffer.toString().split(`--${boundary}`);
        
        let fileData = null;
        let fileName = null;
        
        for (const part of parts) {
          if (part.includes('Content-Disposition: form-data')) {
            const lines = part.split('\r\n');
            for (let i = 0; i < lines.length; i++) {
              if (lines[i].includes('name="image"')) {
                // This is our file part
                const contentType = lines.find(line => line.startsWith('Content-Type:'));
                if (contentType) {
                  // Extract file data
                  const dataStart = part.indexOf('\r\n\r\n') + 4;
                  const dataEnd = part.lastIndexOf('\r\n');
                  if (dataStart < dataEnd) {
                    fileData = Buffer.from(part.substring(dataStart, dataEnd));
                    
                    // Extract filename
                    const filenameMatch = lines.find(line => line.includes('filename='));
                    if (filenameMatch) {
                      fileName = filenameMatch.split('filename=')[1].replace(/"/g, '');
                    }
                    break;
                  }
                }
              }
            }
          }
        }
        
        if (!fileData) {
          return res.status(400).json({ message: 'No image file provided' });
        }

        console.log("File data received, size:", fileData.length);
        console.log("Original filename:", fileName);

        // Generate unique filename
        const timestamp = Date.now();
        const extension = fileName ? path.extname(fileName) : '.jpg';
        const newFileName = `dish_${timestamp}${extension}`;
        
        // Save file to final location
        const finalPath = path.join(process.cwd(), 'public', 'uploads', 'dishes', newFileName);
        
        console.log("Final path:", finalPath);
        
        // Ensure directory exists
        const uploadDir = path.dirname(finalPath);
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }

        // Write file
        fs.writeFileSync(finalPath, fileData);
        console.log("File saved successfully");

        // Return the API route path for serving images
        const imageUrl = `/api/serve-image?filename=${newFileName}`;
        
        console.log("Image URL:", imageUrl);
        
        return res.status(200).json({ 
          message: 'Image uploaded successfully',
          imageUrl: imageUrl,
          filename: newFileName
        });
      } catch (parseError) {
        console.error("Parse error:", parseError);
        return res.status(500).json({ message: 'Upload failed', error: parseError.message });
      }
    });

    req.on('error', (error) => {
      console.error("Request error:", error);
      return res.status(500).json({ message: 'Upload failed', error: error.message });
    });

  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ message: 'Upload failed', error: error.message });
  }
} 