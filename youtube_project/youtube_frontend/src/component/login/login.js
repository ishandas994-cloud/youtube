import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import YouTubeIcon from "@mui/icons-material/YouTube";
import LinearProgress from "@mui/material/LinearProgress";
import "./login.css";
import axios from "axios";
import api from "../../api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Login({ setIsLoggedIn }) {
  const navigate = useNavigate();

  const [loginField, setLoginField] = useState({
    userName: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleOnChangeInput = (event) => {
    const { name, value } = event.target;
    setLoginField({
      ...loginField,
      [name]: value,
    });
  };

  const handleLogin = async () => {
    if (!loginField.userName || !loginField.password) {
      return toast.error("Please fill all fields ⚠️");
    }

    try {
      setLoading(true);

      // ✅ Correct backend route
      const response = await api.post("/api/user/login", loginField);

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userId", response.data.user._id);
        localStorage.setItem("userProfilePic", response.data.user.profilePic);

        setIsLoggedIn(true); // Update login state in App.js
        toast.success("Login Successful 🎉");

        setTimeout(() => navigate("/"), 1500);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Invalid Username or Password ❌"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        {loading && <LinearProgress />}

        <div className="login-header">
          <YouTubeIcon className="youtube-logo" />
          <h2>Login</h2>
        </div>

        <input
          className="login-input"
          type="text"
          name="userName"
          placeholder="Username"
          value={loginField.userName}
          onChange={handleOnChangeInput}
        />

        <input
          className="login-input"
          type="password"
          name="password"
          placeholder="Password"
          value={loginField.password}
          onChange={handleOnChangeInput}
        />

        <div className="login-buttons">
          <button onClick={handleLogin} disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
          <button onClick={() => navigate("/signup")} disabled={loading}>
            Signup
          </button>
          <button onClick={() => navigate(-1)} disabled={loading}>
            Cancel
          </button>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
}

export default Login;