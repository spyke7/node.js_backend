//Today we will see how to receive, process and forward a webhook notification to a third party url,
//  using the webhook do a lot of things including sending notification to device or other services
//  like discord or telegram originated from a user request. This process is extensively used for the
//  payment gateway processing apps like razorpay, Paytm, billdesk and etc to auto handle retries and update the payment status.

const express = require("express");
const cors = require("cors");
const https = require("https");
const app = express();

// Hardcoded webhook target URL
const WEBHOOK_TARGET_URL = 'https://third-party-webhook.example.com/notify';

// Middleware
app.use(cors());
app.use(express.json());

// Logging middleware - logs each request
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Routes

// POST /webhook - Receive webhook, process, and forward to third party
app.post("/webhook", (req, res) => {
  const webhookData = req.body;
  console.log('Received webhook:', JSON.stringify(webhookData, null, 2));

  // Get target URL from hardcoded const
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
});