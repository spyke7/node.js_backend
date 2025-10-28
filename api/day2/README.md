# Random Number API
This is a basic HTTP server built with Node.js that responds with a random number to any incoming request. It's a great starting point for
learning about APIs and server-side programming.

## What is an API?
An API (Application Programming Interface) is a set of rules and protocols that allows different software applications to communicate
with each other. In this case, our API is a simple web server that responds to HTTP requests.

## How this code works
1. Import the http module: We use Node.js's built-in http module to create and manage the server.
2. Create the serv er: The http.createServer() method creates a new HTTP server. It takes a callback function that handles
each incoming request.
3. Handle requests: For every request, we set the response headers (status code 200 for success, content type as plain text) and
send back a random number between 0 and 1.
4. Start listening: The server starts listening on port 3000. When it's ready, it logs a message to the console.

## Running the API
1. Make sure you have Node.js installed on your system.
2. Open a terminal in this project directory.
3. Running npm install is not requiared, as this project does not have any external dependencies.
4. Run npm start or directly node server.js.
5. Open your web browser and go to http://localhost:3000.
6. You should see a random number (between 0 and 1) displayed in your browser.

## Next steps
Try modifying the random number generation (e.g., integers, ranges).
Add different routes (e.g., /about, /time).
Learn about Express.js for more advanced routing and middleware.
Explore different HTTP methods (GET, POST, etc.).
This basic server demonstrates the fundamentals of how web servers work and can be expanded into more complex APIs.