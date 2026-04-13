const express = require("express");
const router = express.Router();

const {
  addComment,
  getCommentsByVideo
} = require("../Controllers/comment");

const auth = require("../Connection/middleware/authentication");

// ADD COMMENT
router.post("/", auth, addComment);

// GET COMMENTS
router.get("/:videoId", getCommentsByVideo);

module.exports = router;