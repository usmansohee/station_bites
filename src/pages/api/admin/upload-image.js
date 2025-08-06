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
        
        // Parse multipart form data manually - handle binary data properly
        const boundary = req.headers['content-type'].split('boundary=')[1];
        const boundaryBuffer = Buffer.from(`--${boundary}`);
        
        // Split buffer by boundary (keeping binary data intact)
        let parts = [];
        let start = 0;
        let end = buffer.indexOf(boundaryBuffer, start);
        
        while (end !== -1) {
          if (start !== end) {
            parts.push(buffer.slice(start, end));
          }
          start = end + boundaryBuffer.length;
          end = buffer.indexOf(boundaryBuffer, start);
        }
        
        // Add final part if exists
        if (start < buffer.length) {
          parts.push(buffer.slice(start));
        }
        
        let fileData = null;
        let fileName = null;
        
        for (const part of parts) {
          const partStr = part.toString('utf8', 0, Math.min(500, part.length)); // Only convert header to string
          if (partStr.includes('Content-Disposition: form-data') && partStr.includes('name="image"')) {
            // Find the double CRLF that separates headers from data
            const headerEnd = part.indexOf(Buffer.from('\r\n\r\n'));
            if (headerEnd !== -1) {
              const headers = part.slice(0, headerEnd).toString('utf8');
              
              // Extract filename from headers
              const filenameMatch = headers.match(/filename="([^"]+)"/);
              if (filenameMatch) {
                fileName = filenameMatch[1];
              }
              
              // Extract binary file data (skip the double CRLF)
              const dataStart = headerEnd + 4;
              let dataEnd = part.length;
              
              // Remove trailing CRLF if present
              if (part[dataEnd - 2] === 0x0D && part[dataEnd - 1] === 0x0A) {
                dataEnd -= 2;
              }
              
              fileData = part.slice(dataStart, dataEnd);
              break;
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