// Today we will look at the POST request method of api interaction, until now we have only made GET request,
//  in which we got the data, in post request we can send something to the api,
//  today's code example is almost same like the previous ones but we have added a POST endpoint, try running 
// it either with curl or another node script. If problem arises share in this group we will try to sort things out.

const express = require("express");
const cors = require("cors");
const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // parse application/json

// In-memory storage for users (simple for students)
let users = [
  { id: 1, name: "Rick", age: 23 },
  { id: 2, name: "Aadrija", age: 22 },
];

// Helpers
function getNextId() {
  return users.length ? Math.max(...users.map(u => u.id)) + 1 : 1;
}

// Routes

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

// GET /hello - Returns a greeting
app.get("/hello", (req, res) => {
  res.json({ message: "Hello, World!" });
});

// GET /random - Returns a random number
app.get("/random", (req, res) => {
  res.json({ random: Math.random() });
});

// GET /time - Returns current server time
app.get("/time", (req, res) => {
  res.json({ time: new Date().toISOString() });
});

// GET /users - Returns list of users
// Optional query: ?minAge=18 to filter
app.get("/users", (req, res) => {
  const { minAge } = req.query;
  if (minAge) {
    const min = Number(minAge);
    if (Number.isNaN(min)) return res.status(400).json({ error: "minAge must be a number" });
    return res.json(users.filter(u => u.age >= min));
  }
  res.json(users);
});

// GET /users/:id - Get a user by id
app.get("/users/:id", (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: "id must be a number" });
  const user = users.find(u => u.id === id);
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
});

// POST /users - Create a new user
// Body: { name: string, age: number }
app.post("/users", (req, res) => {
  const { name, age } = req.body || {};
  if (!name || typeof name !== "string") {
    return res.status(400).json({ error: "name is required and must be a string" });
  }
  const ageNum = Number(age);
  if (!Number.isFinite(ageNum) || ageNum <= 0) {
    return res.status(400).json({ error: "age is required and must be a positive number" });
  }

  const newUser = { id: getNextId(), name: name.trim(), age: ageNum };
  users.push(newUser);
  res.status(201).json(newUser);
});

// DELETE /users/:id - remove a user (teaches id-based actions)
app.delete("/users/:id", (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: "id must be a number" });
  const idx = users.findIndex(u => u.id === id);
  if (idx === -1) return res.status(404).json({ error: "User not found" });
  const removed = users.splice(idx, 1)[0];
  res.json({ removed });
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