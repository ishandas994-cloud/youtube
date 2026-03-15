require("dotenv").config();
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");

// Database connection
require("./Connection/conn");

// Import routes
const userRoutes = require("./Routes/user");
const videoRoutes = require("./Routes/video");
const commentRoutes = require("./Routes/comment");
const historyRoutes = require("./Routes/history");

// ================= MIDDLEWARE =================
// Enable CORS for frontend
app.use(
  cors({
    origin: "http://localhost:3000", // React frontend
    credentials: true,               // allow cookies / auth headers
  })
);

// Parse JSON bodies
app.use(express.json());

// Parse cookies
app.use(cookieParser());

// ================= ROUTES =================
// User routes (login, signup, profile)
app.use("/api/user", userRoutes);

// Video routes
app.use("/api/video", videoRoutes); // changed to /api/video for consistency

// Comment routes
app.use("/api/comment", commentRoutes);

// History routes
app.use("/api/history", historyRoutes);

// ================= TEST ROUTE =================
app.get("/", (req, res) => {
  res.send("Backend is working successfully 🚀");
});

// ================= ERROR HANDLING =================
// 404 handler for undefined routes
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// General error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Server error" });
});

// Validate required env variables
if (!process.env.JWT_SECRET) {
  console.error("FATAL ERROR: JWT_SECRET is not set in .env");
  process.exit(1);
}

// ================= START SERVER =================
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});