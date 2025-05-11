// const express = require("express");
// const http = require("http");
// const socketIo = require("socket.io");
// const cors = require("cors");

// const app = express();
// const server = http.createServer(app);
// const io = socketIo(server, {
//   cors: {
//     origin: "http://localhost:3000",
//   },
// });

// app.use(cors());

// io.on("connection", (socket) => {
//   console.log("New client connected");

//   socket.on("red-light-detected", () => {
//     console.log("🚨 Red light detected! Broadcasting...");
//     io.emit("red-light-detected"); // Broadcast to all connected clients
//   });

//   socket.on("disconnect", () => {
//     console.log("Client disconnected");
//   });
// });

// server.listen(4000, () => console.log("Server running on http://localhost:4000"));


const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
require("dotenv").config();

// Import routes
const patientRoutes = require('./routes/patientRoutes');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173", // adjusted to match your env
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// Port configuration
const PORT = process.env.PORT || 5000;

// Routes
app.use('/api/patients', patientRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB Atlas");

    // Start server only after successful DB connection
    server.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// Socket.IO logic
io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("red-light-detected", () => {
    console.log("Red light detected! Broadcasting...");
    io.emit("red-light-detected");
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// Basic route for testing
app.get('/', (req, res) => {
  res.send('Patient Care Portal API is running');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong!', 
    error: process.env.NODE_ENV === 'production' ? null : err.message 
  });
});
