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

// ✅ Allowed frontend URLs
const FRONTEND_URLS = [
  "http://localhost:3000",
  "https://nonqualitative-preposterously-anaya.ngrok-free.dev",
  "https://youtube-wwj2.vercel.app"
];

// ✅ FIXED CORS (dynamic origin)
app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (Postman, curl, mobile apps)
    if (!origin) return callback(null, true);

    if (FRONTEND_URLS.includes(origin)) {
      return callback(null, true);
    } else {
      console.error("❌ Blocked by CORS:", origin);
      return callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

// ✅ Handle preflight requests (VERY IMPORTANT)
app.options("*", cors());

// Middlewares
app.use(express.json());
app.use(cookieParser());

// ✅ Serve videos folder
app.use("/videos", express.static(path.join(__dirname, "videos")));

// Routes
app.use("/api/user", userRoutes);
app.use("/api/video", videoRoutes);
app.use("/api/comment", commentRoutes);
app.use("/api/history", historyRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

// ❌ 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// 🔥 Better error handler
app.use((err, req, res, next) => {
  console.error("🔥 ERROR STACK:\n", err.stack);
  console.error("🔥 ERROR MESSAGE:\n", err.message);

  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// ✅ ENV check
if (!process.env.JWT_SECRET) {
  console.error("❌ FATAL ERROR: JWT_SECRET not set");
  process.exit(1);
}

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});