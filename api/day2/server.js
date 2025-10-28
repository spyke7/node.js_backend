// Today we will provide the second part of that API, instead of hallow world
//  it will print a random number with a GET request.
const http = require("http");

const server = http.createServer((_req, res) => {
  res.end(Math.random().toString() + "\n");
});

const PORT = 3000;

server.listen(PORT, () => {
  console.log("Server is ready");
});