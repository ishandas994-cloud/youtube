const express = require("express");
const router = express.Router();
const UserController = require("../Controllers/user");
const auth = require("../Connection/middleware/authentication"); // JWT middleware

// ================= PROFILE ROUTES =================
router.get("/profile/:id", UserController.getUserProfile); // any user
router.get("/profile/me", auth, UserController.getMyProfile); // logged-in user

// ================= AUTH =================
router.post("/signUp", UserController.signUp);
router.post("/login", UserController.signin);
router.post("/logout", UserController.logout);

// ================= OTHER USER ROUTES =================
router.get("/getUser/:id", UserController.getUserById);
router.get("/allUsers", UserController.getAllUsers);

module.exports = router;