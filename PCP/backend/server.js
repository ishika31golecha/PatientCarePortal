// const express = require("express");
// const mongoose = require("mongoose");
// const http = require("http");
// const socketIo = require("socket.io");
// const cors = require("cors");
// require("dotenv").config();

// // Import routes
// const patientRoutes = require('./routes/patientRoutes');

// const app = express();
// const server = http.createServer(app);
// const io = socketIo(server, {
//   cors: {
//     origin: process.env.FRONTEND_URL || "http://localhost:5173", // adjusted to match your env
//   },
// });

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Port configuration
// const PORT = process.env.PORT || 5000;

// // Routes
// app.use('/api/patients', patientRoutes);

// // MongoDB Connection
// mongoose.connect(process.env.MONGO_URI)
//   .then(() => {
//     console.log("Connected to MongoDB Atlas");

//     // Start server only after successful DB connection
//     server.listen(PORT, () => {
//       console.log(`Server running on http://localhost:${PORT}`);
//     });
//   })
//   .catch((err) => {
//     console.error("MongoDB connection error:", err);
//   });

// // Socket.IO logic
// io.on("connection", (socket) => {
//   console.log("New client connected");

//   socket.on("red-light-detected", () => {
//     console.log("Red light detected! Broadcasting...");
//     io.emit("red-light-detected");
//   });

//   socket.on("disconnect", () => {
//     console.log("Client disconnected");
//   });
// });

// // Basic route for testing
// app.get('/', (req, res) => {
//   res.send('Patient Care Portal API is running');
// });

// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ 
//     success: false, 
//     message: 'Something went wrong!', 
//     error: process.env.NODE_ENV === 'production' ? null : err.message 
//   });
// });






const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
require("dotenv").config();

// Import routes
const patientRoutes = require('./routes/patientRoutes');
const medicalRoutes = require('./routes/medicalRoutes'); // New medical routes

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
app.use(express.urlencoded({ extended: true })); // Added for form data

// Port configuration
const PORT = process.env.PORT || 5000;

// Routes
app.use('/api/patients', patientRoutes);
app.use('/api', medicalRoutes); // New medical information routes

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
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

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

module.exports = app;