const express = require("express");
const router = express.Router();
const auth = require("../Connection/middleware/authentication");
const { addToHistory, getHistory } = require("../Controllers/history");

router.post("/add", auth, addToHistory);    // Add video to history
router.get("/get", auth, getHistory);       // Get user's history

module.exports = router;