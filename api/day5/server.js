//Today we'll see Full CRUD operations on users (Create, Read, Update, Delete),
//  in the following snippets i have just done the operation on static users, 
// but if you connect db you can do it on there too, run the code tell us if any problem arises.

const express = require("express");
const cors = require("cors");
const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // parse application/json

// Logging middleware - logs each request
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

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
  if (!name || typeof name !== "string" || name.trim().length < 2) {
    return res.status(400).json({ error: "name is required, must be a string with at least 2 characters" });
  }
  const ageNum = Number(age);
  if (!Number.isFinite(ageNum) || ageNum < 13 || ageNum > 120) {
    return res.status(400).json({ error: "age is required and must be a number between 13 and 120" });
  }

  const newUser = { id: getNextId(), name: name.trim(), age: ageNum };
  users.push(newUser);
  res.status(201).json(newUser);
});

// PATCH /users/:id - Update an existing user
// Body: { name?: string, age?: number } (partial update)
app.patch("/users/:id", (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: "id must be a number" });
  const user = users.find(u => u.id === id);
  if (!user) return res.status(404).json({ error: "User not found" });

  const { name, age } = req.body || {};
  if (name !== undefined) {
    if (typeof name !== "string" || name.trim().length < 2) {
      return res.status(400).json({ error: "name must be a string with at least 2 characters" });
    }
    user.name = name.trim();
  }
  if (age !== undefined) {
    const ageNum = Number(age);
    if (!Number.isFinite(ageNum) || ageNum < 13 || ageNum > 120) {
      return res.status(400).json({ error: "age must be a number between 13 and 120" });
    }
    user.age = ageNum;
  }

  res.json(user);
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