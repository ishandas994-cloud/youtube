const express = require("express");
const router = express.Router();

const videoController = require("../Controllers/video");
const auth = require("../Connection/middleware/authentication");

// UPLOAD VIDEO
router.post("/", auth, videoController.uploadVideo);

// GET ALL VIDEOS
router.get("/", videoController.getAllVideo);

// TRENDING VIDEOS
router.get("/trending", videoController.getTrendingVideos);

// SEARCH VIDEOS
router.get("/search/:query", videoController.searchVideos);

// SUGGESTED VIDEOS
router.get("/suggested/:id", videoController.getSuggestedVideos);

// LIKE / DISLIKE
router.put("/react/:id", auth, videoController.toggleReaction);

// VIDEOS BY USER
router.get("/user/:userId", videoController.getVideoByUserId);

// GET SINGLE VIDEO
router.get("/:id", videoController.getVideoById);

module.exports = router;