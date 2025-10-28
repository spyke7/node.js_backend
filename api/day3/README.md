# Express API
This is an enhanced HTTP API built with Node.js and Express.js that provides
multiple endpoints for learning about RESTful APIs and server-side programming.

## What is an API?
An API (Application Programming Interface) is a set of rules and protocols that
allows different software applications to communicate with each other. This API
demonstrates various HTTP methods and endpoints.

## API Endpoints
### GET /hello
Returns a simple greeting message.
**Response**:
{
"message": "Hello, World!"
}

### GET /random
Returns a random number between 0 and 1.
**Response**:
`{
    "random": 0.123456789
}`

### GET /time
Returns the current server time in ISO format.
**Response**:
{
    "time": "2025-10-28T12:00:00.000Z"
}

### GET /users
Returns a list of all users.
**Response**:
`[
    {
        "id": 1,
        "name": "Rick",
        "age": 23
    },
    {
        "id": 2,
        "name": "Aadrija",
        "age": 22
    }
]`

## How this code works
1. **Import Express**: We use the Express.js framework for easier routing.
2. **Routes**: Each endpoint is defined with app.get().
3. **Data Storage**: Users are stored in the hardcoded code, can be linked to
a database later.
4. **Error Handling**: Basic validation for POST requests.

## Running the API
1. Make sure you have Node.js installed.
2. Install dependencies: npm install
3. Start the server: npm start
4. The API will be available at http://localhost:3000

## Testing the API
You can test the endpoints using curl, Postman, or your browser:
*# GET requests*
`curl http://localhost:3000/hello
curl http://localhost:3000/random
curl http://localhost:3000/time
curl http://localhost:3000/users`

## Next Steps
- Add data persistence with a database
- Implement authentication and authorization
- Add input validation and error handling
- Create more complex endpoints with query parameters
- Learn about middleware for logging and CORS

This API provides a solid foundation for understanding RESTful web services
and can be expanded for more advanced features.