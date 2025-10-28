// Today we will take a more advance look at the node api, with multiple routes and multiple features,
//  in production programming you need multiple endpoint of a single api to fetch and return different types of data or objects. 
// We will look exactly that how to have multiple endpoint inside a single api,
//  we will use a package called express to handle our request rather than node's built-in http

const express = require("express");
const app = express();

// Hardcoded storage for users
let users = [
  { id: 1, name: "Rick", age: 23 },
  { id: 2, name: "Aadrija", age: 22 },
];

// Routes

// GET /hello - Returns a greeting
app.get("/hello", (req, res) => {
  res.json({ message: "Hello, World!" });
});

// GET /random - Returns a random number
app.get("/random", (req, res) => {
  const randomNum = Math.random();
  res.json({ random: randomNum });
});

// GET /time - Returns current server time
app.get("/time", (req, res) => {
  const currentTime = new Date().toISOString();
  res.json({ time: currentTime });
});

// GET /users - Returns list of users
app.get("/users", (req, res) => {
  res.json(users);
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
