import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import YouTubeIcon from "@mui/icons-material/YouTube";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./signup.css";

function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    channelName: "",
    userName: "",
    password: "",
    about: "",
    profilePic:
      "https://cdn-icons-png.flaticon.com/512/149/149071.png",
  });

  const [loading, setLoading] = useState(false);

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Upload Image to Cloudinary
  const uploadImage = async (e) => {
    const files = e.target.files;
    const data = new FormData();

    data.append("file", files[0]);
    data.append("upload_preset", "youtube_project");

    try {
      console.log("Uploading Image...");
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/duxonqe5o/image/upload",
        data
      );

      const imageUrl = response.data.secure_url;

      setFormData((prev) => ({
        ...prev,
        profilePic: imageUrl,
      }));

      console.log("Image Uploaded:", imageUrl);
      toast.success("Image Uploaded Successfully ✅");
    } catch (err) {
      console.log("Image Upload Error:", err);
      toast.error("Image Upload Failed ❌");
    }
  };

  useEffect(() => {
    console.log("Form Data Updated:", formData);
  }, [formData]);

  // Handle Signup
  const handleSignup = async () => {
    if (
      !formData.channelName ||
      !formData.userName ||
      !formData.password ||
      !formData.about
    ) {
      return toast.error("Please fill all fields ⚠️");
    }

    try {
      setLoading(true);
      console.log("Submitting Signup:", formData);

      const res = await axios.post(
        "http://localhost:4000/api/signUp",
        formData
      );

      console.log("Signup Response:", res.data);

      // ✅ Store Authentication Data
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userId", res.data.user._id);
        localStorage.setItem("userProfilePic", res.data.user.profilePic);

        console.log("Token & User Data Stored in localStorage ✅");
      }

      toast.success("Signup Successful 🎉");

      setTimeout(() => {
        navigate("/");
      }, 1500);

    } catch (err) {
      console.log("Signup Error:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Signup Failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-card">

        <div className="signup-left">
          <div className="profile-preview">
            <img src={formData.profilePic} alt="profile" />
          </div>
        </div>

        <div className="signup-right">

          <div className="signup-header">
            <YouTubeIcon className="youtube-logo" />
            <h2>Signup</h2>
          </div>

          <input
            className="signup-input"
            type="text"
            placeholder="Channel Name"
            name="channelName"
            value={formData.channelName}
            onChange={handleChange}
          />

          <input
            className="signup-input"
            type="text"
            placeholder="Username"
            name="userName"
            value={formData.userName}
            onChange={handleChange}
          />

          <input
            className="signup-input"
            type="password"
            placeholder="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />

          <textarea
            className="signup-textarea"
            placeholder="About your channel"
            name="about"
            value={formData.about}
            onChange={handleChange}
          />

          <input
            type="file"
            className="signup-file"
            accept="image/*"
            onChange={uploadImage}
          />

          <div className="signup-buttons">
            <button onClick={handleSignup} disabled={loading}>
              {loading ? "Creating Account..." : "Signup"}
            </button>

            <button onClick={() => navigate("/")} disabled={loading}>
              Homepage
            </button>
          </div>

        </div>
      </div>

      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
}

export default Signup;