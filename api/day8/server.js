// Today we will see a more advance version of yesterday's API,
//  with API key auth and with both the GET & POST request. 

const express = require("express");
const cors = require("cors");
const https = require("https");
const app = express();

// Configuration from environment variables
const WEBHOOK_TARGET_URL = process.env.WEBHOOK_TARGET_URL || 'https://third-party-webhook.example.com/notify';
const API_KEY = process.env.API_KEY || 'default-api-key'; // Change this in production

// In-memory storage for recent webhooks (last 100)
const webhooks = [];

// Rate limiting map (IP -> timestamps)
const rateLimitMap = new Map();

// Middleware
app.use(cors());
app.use(express.json());

// Logging middleware - logs each request
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Authentication middleware
function authMiddleware(req, res, next) {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey || apiKey !== API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

// Rate limiting middleware (10 requests per minute per IP)
function rateLimitMiddleware(req, res, next) {
  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  const now = Date.now();
  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, []);
  }
  const timestamps = rateLimitMap.get(ip);
  // Remove timestamps older than 1 minute
  const oneMinuteAgo = now - 60000;
  while (timestamps.length > 0 && timestamps[0] < oneMinuteAgo) {
    timestamps.shift();
  }
  if (timestamps.length >= 10) {
    return res.status(429).json({ error: 'Too many requests' });
  }
  timestamps.push(now);
  next();
}

// Routes

// POST /webhook - Receive webhook, process, and forward to third party
app.post("/webhook", authMiddleware, rateLimitMiddleware, (req, res) => {
  const webhookData = req.body;
  console.log('Received webhook:', JSON.stringify(webhookData, null, 2));

  // Store webhook in memory (keep last 100)
  webhooks.push({ timestamp: new Date(), data: webhookData });
  if (webhooks.length > 100) {
    webhooks.shift();
  }

  // Get target URL from env
  const targetUrl = WEBHOOK_TARGET_URL;

  // Prepare request to third party
  const url = new URL(targetUrl);
  const options = {
    hostname: url.hostname,
    port: url.port || (url.protocol === 'https:' ? 443 : 80),
    path: url.pathname + url.search,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'Webhook-Handler/1.0'
    }
  };

  const thirdPartyReq = https.request(options, (thirdPartyRes) => {
    console.log(`Third party response status: ${thirdPartyRes.statusCode}`);
    
    let responseData = '';
    thirdPartyRes.on('data', (chunk) => {
      responseData += chunk;
    });
    
    thirdPartyRes.on('end', () => {
      console.log('Third party response:', responseData);
      res.json({ 
        status: 'webhook processed and forwarded',
        thirdPartyStatus: thirdPartyRes.statusCode,
        thirdPartyResponse: responseData
      });
    });
  });

  thirdPartyReq.on('error', (error) => {
    console.error('Error forwarding webhook to third party:', error.message);
    res.status(500).json({ error: 'Failed to forward webhook to third party' });
  });

  // Send the webhook data to third party
  thirdPartyReq.write(JSON.stringify(webhookData));
  thirdPartyReq.end();
});

// GET /webhooks - Retrieve recent webhooks (requires auth)
app.get('/webhooks', authMiddleware, (req, res) => {
  res.json({ webhooks });
});

// GET /health - Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
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
  console.log(`Webhook handler server is running on http://localhost:${PORT}`);
  console.log(`Forwarding webhooks to: ${WEBHOOK_TARGET_URL}`);
  console.log(`API Key required for /webhook and /webhooks routes`);
});