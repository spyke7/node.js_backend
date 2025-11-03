// Today we will see how to impalement basic rate limiting using the express-rate-limit library.
//  It limits requests to 10 per minute per IP address and returns a 429 status code with an error message
//  when the limit is exceeded. Rate limiting is a important way to prevent your endpoint from 
// being abused or ddos attack in the production, while we are implementing basic rate limit here within
//  the express in production you may consider using nginx as a reverse proxy to impalement advance rate limiting.

const express = require('express');
const rateLimit = require('express-rate-limit');

const app = express();

// Rate limiting middleware: 10 requests per minute per IP
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // limit each IP to 10 requests per windowMs
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Apply rate limiting to all requests
app.use(limiter);

// Basic route
app.get('/hello', (req, res) => {
  res.json({ message: 'Hello, World!' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});