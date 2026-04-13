const User = require("../Models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Video = require("../Models/video");


// ================== GET USER PROFILE ==================
exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required"
      });
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const videos = await Video.find({ user: userId })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      user,
      videos
    });

  } catch (error) {
    console.log("Profile Error:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// ================== SIGN UP ==================
exports.signUp = async (req, res) => {
  try {
    const { channelName, userName, password, about, profilePic } = req.body;

    const existingUser = await User.findOne({ userName });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Username already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      channelName,
      userName,
      password: hashedPassword,
      about,
      profilePic
    });

    const token = jwt.sign(
      { id: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(201).json({
      success: true,
      message: "Signup successful",
      token,
      user: {
        _id: newUser._id,
        channelName: newUser.channelName,
        userName: newUser.userName,
        about: newUser.about,
        profilePic: newUser.profilePic
      }
    });

  } catch (error) {
    console.log("Signup Error:", error.message);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// ================== LOGIN ==================
exports.signin = async (req, res) => {
  try {
    const { userName, password } = req.body;

    const user = await User.findOne({ userName });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        channelName: user.channelName,
        userName: user.userName,
        about: user.about,
        profilePic: user.profilePic
      }
    });

  } catch (error) {
    console.log("Login Error:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// ================== LOGOUT ==================
exports.logout = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Logged out successfully"
  });
};


// ================== GET USER BY ID ==================
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    return res.status(200).json({
      success: true,
      user
    });

  } catch (error) {
    console.log("GetUser Error:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// ================== GET ALL USERS ==================
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    return res.status(200).json({
      success: true,
      count: users.length,
      users
    });

  } catch (error) {
    console.log("AllUsers Error:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
// ================== GET CURRENT USER PROFILE ==================
exports.getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    const videos = await Video.find({ user: req.user.id })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      user,
      videos
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};