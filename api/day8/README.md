# Webhook Handler API

This is a Node.js + Express API that receives webhook notifications, processes them, and forwards them to a third-party service. It demonstrates webhook handling, data processing, secure forwarding, authentication, rate limiting, and in-memory storage using native Node.js modules.

## What you'll get to know

- How to run a Node.js/Express server
- Receiving and processing webhook payloads
- Forwarding webhooks to third-party services
- Using native Node.js `https` module for HTTP requests
- Input validation and error handling
- Request logging middleware
- API key authentication
- Rate limiting
- In-memory data storage

## Prerequisites

- Node.js (recommend v20+)
- npm (comes with Node)

## Quick start

1. Install dependencies

```bash
npm install
```

2. Set environment variables (optional)

```bash
# Windows PowerShell
$env:WEBHOOK_TARGET_URL = "https://your-third-party-webhook.com/notify"
$env:API_KEY = "your-secure-api-key"
$env:PORT = "3000"
```

3. Start the server

```bash
npm start
# Or you can start directly using node:
node server.js
```

4. The API will be available at: `http://localhost:3000`

## Configuration

Set the following environment variables:

- `WEBHOOK_TARGET_URL`: URL to forward webhooks to (default: `https://third-party-webhook.example.com/notify`)
- `API_KEY`: API key for authentication (default: `default-api-key` - change in production)
- `PORT`: Port to run the server on (optional, default: 3000)

## Endpoints

### Webhook Receiver
- **POST /webhook** — Receive and forward webhook notifications (requires authentication and rate limited)
  - **Headers:** `x-api-key: <your-api-key>`
  - **Content-Type:** `application/json`
  - **Body:** JSON payload from the webhook source
  - **Rate Limit:** 10 requests per minute per IP
  - **Returns:** JSON response with processing status

### Webhook History
- **GET /webhooks** — Retrieve recent webhooks (requires authentication)
  - **Headers:** `x-api-key: <your-api-key>`
  - **Returns:** JSON array of recent webhooks (last 100)

### Health Check
- **GET /health** — Server health status
  - **Returns:** JSON with status and uptime

## Example Usage

**POST /webhook**

Request headers:
```
x-api-key: your-secure-api-key
Content-Type: application/json
```

Request body:
```json
{
  "event": "user.created",
  "user": {
    "id": 123,
    "name": "John Doe",
    "email": "john@example.com"
  },
  "timestamp": "2023-11-01T12:00:00Z"
}
```

Response:
```json
{
  "status": "webhook processed and forwarded",
  "thirdPartyStatus": 200,
  "thirdPartyResponse": "{\"received\": true}"
}
```

**GET /webhooks**

Request headers:
```
x-api-key: your-secure-api-key
```

Response:
```json
{
  "webhooks": [
    {
      "timestamp": "2025-11-02T10:00:00.000Z",
      "data": {
        "event": "user.created",
        "user": { "id": 123, "name": "John Doe" }
      }
    }
  ]
}
```

## Features

- **Webhook Processing**: Receives JSON payloads, logs them, and stores recent ones
- **Secure Forwarding**: Forwards webhooks to configured third-party endpoints
- **Authentication**: API key-based auth for protected routes
- **Rate Limiting**: 10 requests per minute per IP to prevent abuse
- **In-Memory Storage**: Stores last 100 webhooks for retrieval
- **Native Node.js**: Uses built-in `https` module (no external HTTP libraries needed)
- **Request Logging**: All requests are logged to the console with timestamps
- **Error Handling**: Proper HTTP status codes and error messages
- **CORS Support**: Allows cross-origin requests for webhook integrations

## Try it with curl (Windows PowerShell examples)

```powershell
# Set API key variable
$apiKey = "your-secure-api-key"

# Send a test webhook
curl -X POST http://localhost:3000/webhook `
  -H "Content-Type: application/json" `
  -H "x-api-key: $apiKey" `
  -d '{"event":"test","message":"Hello World"}' | ConvertFrom-Json

# Get recent webhooks
curl -X GET http://localhost:3000/webhooks `
  -H "x-api-key: $apiKey" | ConvertFrom-Json

# Health check
curl -X GET http://localhost:3000/health | ConvertFrom-Json

# Check server logs for processing details
```

## Try it with PowerShell

```powershell
# Set API key
$apiKey = "your-secure-api-key"
$headers = @{ "x-api-key" = $apiKey; "Content-Type" = "application/json" }

# Send webhook using Invoke-RestMethod
$body = @{
  event = "user.created"
  user = @{
    id = 123
    name = "John Doe"
  }
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/webhook" -Method Post -Body $body -Headers $headers

# Get webhooks
Invoke-RestMethod -Uri "http://localhost:3000/webhooks" -Method Get -Headers $headers
```

## What you can try next

1. Add webhook signature verification for enhanced security
2. Implement retry logic with exponential backoff for failed third-party requests
3. Replace in-memory storage with a persistent database
4. Add webhook filtering and transformation logic
5. Implement webhook queuing for high-volume scenarios
6. Add monitoring and alerting for webhook failures
7. Support multiple third-party targets with routing logic
8. Add webhook deduplication to prevent processing duplicates

## Technical Notes

- Uses native Node.js `https` module for secure HTTP requests
- JSON payloads are parsed and forwarded as-is to the third party
- All incoming webhooks are logged to the console for debugging
- Recent webhooks are stored in memory (last 100 entries)
- Third-party responses are captured and included in the API response
- Error handling covers authentication, rate limiting, and forwarding failures