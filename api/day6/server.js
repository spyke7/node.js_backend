//Today, we will be taking a look at how to call an external API from a JS server-side code.
//  We will call an external QR API and display its result.

const express = require("express");
const cors = require("cors");
const https = require("https");
const app = express();

// Middleware
app.use(cors());

// Logging middleware - logs each request
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Routes

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

// GET /qr - Generate QR code by proxying to goqr.me API
// Query params: ?data=<text>&size=<pixels>
app.get("/qr", (req, res) => {
  const { data, size } = req.query;
  
  // Validate required parameter
  if (!data) {
    return res.status(400).json({ 
      error: "data parameter is required",
      usage: "GET /qr?data=YourTextHere&size=200"
    });
  }

  // Validate size (optional, default 200)
  const qrSize = size ? Number(size) : 200;
  if (Number.isNaN(qrSize) || qrSize < 50 || qrSize > 1000) {
    return res.status(400).json({ 
      error: "size must be a number between 50 and 1000",
      usage: "GET /qr?data=YourTextHere&size=200"
    });
  }

  // Call goqr.me API using native https module
  const apiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${qrSize}x${qrSize}&data=${encodeURIComponent(data)}`;
  
  https.get(apiUrl, (apiResponse) => {
    // Check if the external API returned an error
    if (apiResponse.statusCode !== 200) {
      return res.status(apiResponse.statusCode).json({ 
        error: "Failed to generate QR code from external service" 
      });
    }

    // Set appropriate headers
    res.set('Content-Type', 'image/png');
    res.set('Cache-Control', 'public, max-age=86400'); // Cache for 1 day
    
    // Pipe the image data directly to the response
    apiResponse.pipe(res);
    
  }).on('error', (error) => {
    console.error('QR code generation error:', error.message);
    res.status(500).json({ error: "Failed to generate QR code" });
  });
});

// 404 for unknown routes
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});