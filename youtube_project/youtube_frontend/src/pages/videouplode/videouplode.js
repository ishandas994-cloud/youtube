import React, { useState } from "react";
import "./videouplode.css";
import YouTubeIcon from "@mui/icons-material/YouTube";
import { Link } from "react-router-dom";
import axios from "axios";
import api from "../../api";
import { Box, CircularProgress } from "@mui/material";

const Videouplod = () => {

  const [loader, setLoader] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const [videoData, setVideoData] = useState({
    title: "",
    description: "",
    videoType: "",
    thumbnail: "",
    videoLink: "",
  });

  // ===== Handle Text Input =====
  const handleChange = (e) => {
    const { name, value } = e.target;

    setVideoData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ===== Upload Thumbnail =====
  const uploadThumbnail = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoader(true);

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "youtube_project");

    try {
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/duxonqe5o/image/upload",
        data
      );

      setVideoData((prev) => ({
        ...prev,
        thumbnail: res.data.secure_url,
      }));

    } catch (err) {
      console.log("Thumbnail Upload Error:", err.response?.data || err.message);
    } finally {
      setLoader(false);
    }
  };

  // ===== Upload Video =====
  const uploadVideo = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoader(true);

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "youtube_project");

    try {
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/duxonqe5o/video/upload",
        data
      );

      setVideoData((prev) => ({
        ...prev,
        videoLink: res.data.secure_url,
      }));

    } catch (err) {
      console.log("Video Upload Error:", err.response?.data || err.message);
    } finally {
      setLoader(false);
    }
  };

  // ===== Submit Function =====
  const handleSubmitFunc = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first.");
        return;
      }

      // ✅ Correct Validation
      if (
        !videoData.title ||
        !videoData.description ||
        !videoData.videoType ||
        !videoData.thumbnail ||
        !videoData.videoLink
      ) {
        alert("Please fill all fields and upload files.");
        return;
      }

      setLoader(true);

      const response = await api.post("/api/video", videoData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setSuccessMsg("🎉 Video Uploaded Successfully! Congrats!");

        // Reset Form
        setVideoData({
          title: "",
          description: "",
          videoType: "",
          thumbnail: "",
          videoLink: "",
        });
      }

    } catch (error) {
      console.log(
        "Upload Error:",
        error.response?.data?.message || error.message
      );
    } finally {
      setLoader(false);
    }
  };

  return (
    <div className="videoUpload">
      <div className="uploadBox">

        <div className="uploadVideoTitle">
          <YouTubeIcon sx={{ fontSize: "54px", color: "red" }} />
          <span>Upload Video</span>
        </div>

        <div className="uploadForm">

          <input
            type="text"
            placeholder="Title of Video"
            className="uploadInput"
            name="title"
            value={videoData.title}
            onChange={handleChange}
          />

          <input
            type="text"
            placeholder="Description"
            className="uploadInput"
            name="description"
            value={videoData.description}
            onChange={handleChange}
          />

          <input
            type="text"
            placeholder="Category"
            className="uploadInput"
            name="videoType"
            value={videoData.videoType}
            onChange={handleChange}
          />

          {/* Thumbnail */}
          <div className="fileInput">
            Thumbnail
            <input
              type="file"
              accept="image/*"
              onChange={uploadThumbnail}
            />
          </div>

          {videoData.thumbnail && (
            <p style={{ fontSize: "14px", color: "green" }}>
              Thumbnail Uploaded ✔
            </p>
          )}

          {/* Video */}
          <div className="fileInput">
            Video
            <input
              type="file"
              accept="video/mp4,video/webm"
              onChange={uploadVideo}
            />
          </div>

          {videoData.videoLink && (
            <p style={{ fontSize: "14px", color: "green" }}>
              Video Uploaded ✔
            </p>
          )}

          {loader && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <CircularProgress />
            </Box>
          )}

          {/* ✅ Success Message */}
          {successMsg && (
            <p style={{ color: "green", marginTop: "10px", fontWeight: "bold" }}>
              {successMsg}
            </p>
          )}

        </div>

        <div className="uploadBtns">
          <div className="uploadBtn-form" onClick={handleSubmitFunc}>
            Upload
          </div>

          <Link to="/" className="uploadBtn-form">
            Home
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Videouplod;