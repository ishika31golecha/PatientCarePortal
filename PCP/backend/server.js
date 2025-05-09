const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

app.use(cors());

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("red-light-detected", () => {
    console.log("🚨 Red light detected! Broadcasting...");
    io.emit("red-light-detected"); // Broadcast to all connected clients
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

server.listen(4000, () => console.log("Server running on http://localhost:4000"));
