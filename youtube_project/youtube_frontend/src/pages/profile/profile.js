import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api";
import "./profile.css";

const Profile = ({ sideNavbar }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError("");

        // ✅ Updated endpoint: use /api/user/
        const endpoint = id
          ? `/api/user/profile/${id}`
          : `/api/user/profile/me`;

        const res = await api.get(endpoint, {          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        console.log("PROFILE RESPONSE:", res.data);

        if (res.data.success && res.data.user) {
          setUser(res.data.user);
          setVideos(res.data.videos || []);
        } else {
          setError("User not found");
        }

      } catch (err) {
        console.error("Profile Error:", err);
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  if (loading) return <div className="profile_loading">Loading...</div>;
  if (error) return <div className="profile_error">{error}</div>;
  if (!user) return <div className="profile_error">No user found</div>;

  return (
    <div className={`profile_page ${sideNavbar ? "sidebar-open" : ""}`}>
      {/* ===== Channel Header ===== */}
      <div className="channel_header">
        <img
          src={user.profilePic || "https://via.placeholder.com/100"}
          alt="channel"
          className="profile_avatar"
        />

        <div className="channel_meta">
          <h1>{user.channelName}</h1>
          <p>@{user.userName} • {videos.length} videos</p>
          <button className="subscribe_btn">Subscribe</button>
        </div>
      </div>

      {/* ===== Videos Grid ===== */}
      <div className="video_grid">
        {videos.length === 0 ? (
          <p>No videos uploaded yet.</p>
        ) : (
          videos.map((video) => (
            <div
              key={video._id}
              className="video_card"
              onClick={() => navigate(`/video/${video._id}`)}
            >
              <img
                src={video.thumbnail || "https://via.placeholder.com/300x180"}
                alt={video.title}
                className="video_thumbnail"
              />
              <div className="video_info">
                <h3>{video.title}</h3>
                <p>
                  {video.createdAt
                    ? new Date(video.createdAt).toDateString()
                    : ""}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Profile;