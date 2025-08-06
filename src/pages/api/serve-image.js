import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  // Allow both GET and HEAD requests (HEAD is used by browsers to check if image exists)
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { filename } = req.query;

  if (!filename) {
    console.error('Serve-image: No filename provided');
    return res.status(400).json({ message: 'Filename is required' });
  }

  try {
    // Construct the file path
    const filePath = path.join(process.cwd(), 'public', 'uploads', 'dishes', filename);
    
    console.log(`Serve-image: Attempting to serve ${filename} from ${filePath}`);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.error(`Serve-image: File not found at ${filePath}`);
      return res.status(404).json({ message: 'Image not found' });
    }

    // Read the file
    const imageBuffer = fs.readFileSync(filePath);
    
    // Get file extension to determine content type
    const ext = path.extname(filename).toLowerCase();
    let contentType = 'image/jpeg'; // default
    
    switch (ext) {
      case '.png':
        contentType = 'image/png';
        break;
      case '.gif':
        contentType = 'image/gif';
        break;
      case '.webp':
        contentType = 'image/webp';
        break;
      case '.svg':
        contentType = 'image/svg+xml';
        break;
    }

    // Set headers
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    console.log(`Serve-image: Successfully serving ${filename}`);
    
    // For HEAD requests, just send headers without body
    if (req.method === 'HEAD') {
      res.status(200).end();
    } else {
      // Send the image
      res.status(200).send(imageBuffer);
    }
  } catch (error) {
    console.error('Error serving image:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
} 