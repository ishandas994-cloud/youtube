require("dotenv").config();
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

// Database connection
require("./Connection/conn");

// Routes
const userRoutes = require("./Routes/user");
const videoRoutes = require("./Routes/video");
const commentRoutes = require("./Routes/comment");
const historyRoutes = require("./Routes/history");

// ✅ Allow frontend Ngrok URL for mobile and laptop
const FRONTEND_URLS = [
  "http://localhost:3000",
  "https://nonqualitative-preposterously-anaya.ngrok-free.dev",
  "https://youtube-wwj2.vercel.app" 
].filter(Boolean);

app.use(cors({
  origin: FRONTEND_URLS,
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

// ✅ Serve videos folder publicly (important!)
app.use("/videos", express.static(path.join(__dirname, "videos")));

// Routes
app.use("/api/user", userRoutes);
app.use("/api/video", videoRoutes);
app.use("/api/comment", commentRoutes);
app.use("/api/history", historyRoutes);

// Test route
app.get("/", (req, res) => res.send("Backend running 🚀"));

// Error handling
app.use((req, res) => res.status(404).json({ success: false, message: "Route not found" }));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Server error" });
});

// Env check
if (!process.env.JWT_SECRET) {
  console.error("FATAL ERROR: JWT_SECRET not set");
  process.exit(1);
}

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend running on port ${PORT}`);
  if (process.env.NGROK_URL) console.log(`Ngrok URL: ${process.env.NGROK_URL}`);
});