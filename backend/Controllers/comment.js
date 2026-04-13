const Comment = require("../Models/comment");

// ================= ADD COMMENT =================
exports.addComment = async (req, res) => {
  try {
    const { video, message } = req.body;

    if (!video || !message) {
      return res.status(400).json({
        success: false,
        message: "Video and message are required",
      });
    }

    const newComment = new Comment({
      user: req.user._id,   // logged in user
      video,
      message,
    });

    await newComment.save();

    // 🔥 IMPORTANT: Populate user before sending response
    const populatedComment = await Comment.findById(newComment._id)
      .populate("user", "userName profilePic channelName");

    res.status(201).json({
      success: true,
      newComment: populatedComment,
    });

  } catch (error) {
    console.error("Add Comment Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


// ================= GET COMMENTS =================
exports.getCommentsByVideo = async (req, res) => {
  try {
    const { videoId } = req.params;

    const comments = await Comment.find({ video: videoId })
      .populate("user", "userName profilePic channelName")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      comments,
    });

  } catch (error) {
    console.error("Get Comments Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};