# Rate Limiting of API

This is a simple Node.js + Express API that demonstrates basic rate limiting. It provides a single endpoint that returns a "Hello, World!" message, with rate limiting to prevent abuse.

## What you'll get to know

- How to run a Node.js/Express server
- Implementing rate limiting with express-rate-limit
- Basic API endpoint creation
- Error handling for rate limits (429 status)

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

- `PORT`: Port to run the server on (optional, default: 3000)

## Endpoints

### Hello World
- **GET /hello** — Returns a hello world message (rate limited)
  - **Rate Limit:** 10 requests per minute per IP
  - **Returns:** JSON response with message

## Example Usage

**GET /hello**

Response:
```json
{
  "message": "Hello, World!"
}
```

When rate limit is exceeded:

Response (429):
```json
{
  "error": "Too many requests, please try again later."
}
```

## Features

- **Rate Limiting**: 10 requests per minute per IP using express-rate-limit
- **Simple Endpoint**: Single GET /hello endpoint
- **Error Handling**: Returns 429 status when rate limit is reached
- **CORS Support**: Allows cross-origin requests

## Try it with curl (Windows PowerShell examples)

```powershell
# Get hello world message
curl -X GET http://localhost:3000/hello | ConvertFrom-Json

# Try exceeding rate limit (run multiple times quickly)
for ($i = 1; $i -le 15; $i++) {
  curl -X GET http://localhost:3000/hello
}
```

## Try it with PowerShell

```powershell
# Get hello world
Invoke-RestMethod -Uri "http://localhost:3000/hello" -Method Get
```

## What you can try next

1. Add authentication middleware
2. Implement different rate limit windows or limits
3. Add more endpoints
4. Integrate with a database
5. Add logging middleware
6. Implement caching

## Technical Notes

- Uses express-rate-limit for rate limiting
- Returns JSON responses
- Simple error handling for rate limits