const Video = require("../Models/video");
const Comment = require("../Models/comment");


// ================= UPLOAD VIDEO =================
exports.uploadVideo = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: "User not authenticated" });

    const { title, description, videoLink, videoType, thumbnail } = req.body;

    const videoUpload = await Video.create({
      user: req.user._id,
      title,
      description,
      videoLink,
      videoType,
      thumbnail,
    });

    // Convert links to absolute URLs before sending
    const responseVideo = videoUpload.toObject();
    responseVideo.videoLink = getAbsoluteVideoLink(responseVideo.videoLink);
    responseVideo.thumbnail = getAbsoluteVideoLink(responseVideo.thumbnail);

    res.status(201).json({ success: true, video: responseVideo });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= GET ALL VIDEOS =================
exports.getAllVideo = async (req, res) => {
  try {
    let videos = await Video.find()
      .populate("user", "channelName userName profilePic")
      .sort({ createdAt: -1 });

    // Convert links
    videos = videos.map(v => {
      const obj = v.toObject();
      obj.videoLink = getAbsoluteVideoLink(obj.videoLink);
      obj.thumbnail = getAbsoluteVideoLink(obj.thumbnail);
      return obj;
    });

    res.status(200).json({ success: true, count: videos.length, videos });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= TRENDING VIDEOS =================
exports.getTrendingVideos = async (req, res) => {
  try {
    let videos = await Video.aggregate([
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
              { $add: [{ $multiply: ["$likesCount", 3] }, { $multiply: ["$commentsCount", 2] }] },
              "$dislikesCount"
            ]
          }
        }
      },
      { $sort: { score: -1 } },
      { $limit: 20 }
    ]);

    videos = await Video.populate(videos, { path: "user", select: "channelName userName profilePic" });

    // Convert links
    videos = videos.map(v => {
      v.videoLink = getAbsoluteVideoLink(v.videoLink);
      v.thumbnail = getAbsoluteVideoLink(v.thumbnail);
      return v;
    });

    res.status(200).json({ success: true, videos });

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

    if (!video) return res.status(404).json({ success: false, message: "Video not found" });

    const obj = video.toObject();
    obj.videoLink = getAbsoluteVideoLink(obj.videoLink);
    obj.thumbnail = getAbsoluteVideoLink(obj.thumbnail);

    res.status(200).json({ success: true, video: obj });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= GET VIDEOS BY USER =================
exports.getVideoByUserId = async (req, res) => {
  try {
    let videos = await Video.find({ user: req.params.userId })
      .populate("user", "channelName userName profilePic")
      .sort({ createdAt: -1 });

    videos = videos.map(v => {
      const obj = v.toObject();
      obj.videoLink = getAbsoluteVideoLink(obj.videoLink);
      obj.thumbnail = getAbsoluteVideoLink(obj.thumbnail);
      return obj;
    });

    res.status(200).json({ success: true, videos });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= SUGGESTED VIDEOS =================
exports.getSuggestedVideos = async (req, res) => {
  try {
    const { id } = req.params;
    const currentVideo = await Video.findById(id);
    if (!currentVideo) return res.status(404).json({ success: false, message: "Video not found" });

    let suggested = await Video.find({ _id: { $ne: id }, videoType: currentVideo.videoType })
      .populate("user", "channelName userName profilePic")
      .sort({ createdAt: -1 })
      .limit(6);

    if (suggested.length < 6) {
      const moreVideos = await Video.find({ _id: { $ne: id } })
        .populate("user", "channelName userName profilePic")
        .sort({ createdAt: -1 })
        .limit(6 - suggested.length);

      suggested = [...suggested, ...moreVideos];
    }

    // Convert links
    suggested = suggested.map(v => {
      const obj = v.toObject();
      obj.videoLink = getAbsoluteVideoLink(obj.videoLink);
      obj.thumbnail = getAbsoluteVideoLink(obj.thumbnail);
      return obj;
    });

    res.status(200).json({ success: true, suggested });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= LIKE / DISLIKE =================
exports.toggleReaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { type } = req.body;

    if (!req.user) return res.status(401).json({ message: "User not authenticated" });

    const video = await Video.findById(id);
    if (!video) return res.status(404).json({ success: false, message: "Video not found" });

    const userId = req.user._id.toString();
    const alreadyLiked = video.likes.some(l => l.toString() === userId);
    const alreadyDisliked = video.dislikes.some(d => d.toString() === userId);

    if (type === "like") {
      if (alreadyLiked) video.likes.pull(userId);
      else { video.likes.push(userId); if (alreadyDisliked) video.dislikes.pull(userId); }
    } else if (type === "dislike") {
      if (alreadyDisliked) video.dislikes.pull(userId);
      else { video.dislikes.push(userId); if (alreadyLiked) video.likes.pull(userId); }
    }

    await video.save();

    res.status(200).json({ success: true, likesCount: video.likes.length, dislikesCount: video.dislikes.length });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= SEARCH VIDEOS =================
exports.searchVideos = async (req, res) => {
  try {
    const { query } = req.params;

    let videos = await Video.find({ title: { $regex: query, $options: "i" } })
      .populate("user", "channelName userName profilePic")
      .sort({ createdAt: -1 });

    // Convert links
    videos = videos.map(v => {
      const obj = v.toObject();
      obj.videoLink = getAbsoluteVideoLink(obj.videoLink);
      obj.thumbnail = getAbsoluteVideoLink(obj.thumbnail);
      return obj;
    });

    res.status(200).json({ success: true, videos });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};