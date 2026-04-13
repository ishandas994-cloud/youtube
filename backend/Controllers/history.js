// controllers/history.js

const History = require("../Models/history");

// ================= ADD VIDEO TO HISTORY =================
exports.addToHistory = async (req, res) => {
  try {
    const { video } = req.body;
    const userId = req.user._id;

    if (!video) {
      return res.status(400).json({ success: false, message: "Video ID is required" });
    }

    // Check if the video is already in the user's history
    const existing = await History.findOne({ user: userId, video: video });

    if (existing) {
      // Update timestamp to move it to top
      existing.createdAt = Date.now();
      await existing.save();
      return res.status(200).json({ success: true, message: "History updated" });
    }

    // Add new history entry
    const history = await History.create({ user: userId, video: video });
    res.status(201).json({ success: true, history });
  } catch (error) {
    console.error("Add to History Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ================= GET USER'S HISTORY =================
exports.getHistory = async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch history, latest first, with video and user details populated
    const history = await History.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate({
        path: "video", // populate the video document
        select: "title thumbnail videoLink user createdAt",
        populate: {
          path: "user", // populate the user inside video
          select: "channelName profilePic",
        },
      });

    res.status(200).json({ success: true, history });
  } catch (error) {
    console.error("Get History Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};