const Video = require("../Models/video");
const Comment = require("../Models/comment");


// ================= UPLOAD VIDEO =================
exports.uploadVideo = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const { title, description, videoLink, videoType, thumbnail } = req.body;

    const videoUpload = await Video.create({
      user: req.user._id,
      title,
      description,
      videoLink,
      videoType,
      thumbnail,
    });

    res.status(201).json({
      success: true,
      video: videoUpload,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ================= GET ALL VIDEOS =================
exports.getAllVideo = async (req, res) => {
  try {

    const videos = await Video.find()
      .populate("user", "channelName userName profilePic")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: videos.length,
      videos,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ================= 🔥 GET TRENDING VIDEOS =================
exports.getTrendingVideos = async (req, res) => {
  try {

    const videos = await Video.aggregate([
      {
        $lookup: {
          from: "comments",
          localField: "_id",
          foreignField: "video",
          as: "comments"
        }
      },

      {
        $addFields: {
          likesCount: { $size: "$likes" },
          dislikesCount: { $size: "$dislikes" },
          commentsCount: { $size: "$comments" }
        }
      },

      {
        $addFields: {
          score: {
            $subtract: [
              {
                $add: [
                  { $multiply: ["$likesCount", 3] },
                  { $multiply: ["$commentsCount", 2] }
                ]
              },
              "$dislikesCount"
            ]
          }
        }
      },

      {
        $sort: { score: -1 }
      },

      {
        $limit: 20
      }
    ]);

    const populatedVideos = await Video.populate(videos, {
      path: "user",
      select: "channelName userName profilePic"
    });

    res.status(200).json({
      success: true,
      videos: populatedVideos,
    });

  } catch (error) {
    console.error("Trending error:", error);
    res.status(500).json({ message: error.message });
  }
};


// ================= GET VIDEO BY ID =================
exports.getVideoById = async (req, res) => {
  try {

    const video = await Video.findById(req.params.id)
      .populate("user", "channelName userName profilePic");

    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }

    res.status(200).json({
      success: true,
      video,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ================= GET VIDEOS BY USER =================
exports.getVideoByUserId = async (req, res) => {
  try {

    const videos = await Video.find({ user: req.params.userId })
      .populate("user", "channelName userName profilePic")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      videos,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ================= 🔥 GET SUGGESTED VIDEOS =================
exports.getSuggestedVideos = async (req, res) => {
  try {

    const { id } = req.params;

    const currentVideo = await Video.findById(id);

    if (!currentVideo) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }

    let suggested = await Video.find({
      _id: { $ne: id },
      videoType: currentVideo.videoType,
    })
      .populate("user", "channelName userName profilePic")
      .sort({ createdAt: -1 })
      .limit(6);

    if (suggested.length < 6) {
      const moreVideos = await Video.find({
        _id: { $ne: id },
      })
        .populate("user", "channelName userName profilePic")
        .sort({ createdAt: -1 })
        .limit(6 - suggested.length);

      suggested = [...suggested, ...moreVideos];
    }

    res.status(200).json({
      success: true,
      suggested,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ================= LIKE / DISLIKE TOGGLE =================
exports.toggleReaction = async (req, res) => {
  try {

    const { id } = req.params;
    const { type } = req.body;

    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const video = await Video.findById(id);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }

    const userId = req.user._id;

    const alreadyLiked = video.likes.some(
      (like) => like.toString() === userId.toString()
    );

    const alreadyDisliked = video.dislikes.some(
      (dislike) => dislike.toString() === userId.toString()
    );

    if (type === "like") {
      if (alreadyLiked) {
        video.likes.pull(userId);
      } else {
        video.likes.push(userId);
        if (alreadyDisliked) video.dislikes.pull(userId);
      }
    }

    if (type === "dislike") {
      if (alreadyDisliked) {
        video.dislikes.pull(userId);
      } else {
        video.dislikes.push(userId);
        if (alreadyLiked) video.likes.pull(userId);
      }
    }

    await video.save();

    res.status(200).json({
      success: true,
      likesCount: video.likes.length,
      dislikesCount: video.dislikes.length,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ================= SEARCH VIDEOS =================
exports.searchVideos = async (req, res) => {
  try {

    const { query } = req.params;

    const videos = await Video.find({
      title: { $regex: query, $options: "i" },
    })
      .populate("user", "channelName userName profilePic")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      videos,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};