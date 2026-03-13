import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./video.css";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";

const VideoPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [videoData, setVideoData] = useState(null);
  const [suggestedVideos, setSuggestedVideos] = useState([]);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(true);

  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [loginMessage, setLoginMessage] = useState("");

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        // ✅ Fetch video
        const videoRes = await axios.get(`http://localhost:4000/api/video/${id}`);
        if (videoRes.data.success) {
          const video = videoRes.data.video;
          setVideoData(video);
          if (userId) {
            setLiked(video.likes?.includes(userId));
            setDisliked(video.dislikes?.includes(userId));
          }
        }

        // ✅ Fetch comments
        const commentRes = await axios.get(
          `http://localhost:4000/api/comment/${id}`
        );
        setComments(commentRes.data.comments || []);

        // ✅ Fetch suggested videos
        const suggestionRes = await axios.get(
          `http://localhost:4000/api/video/suggested/${id}`
        );
        if (suggestionRes.data.success) {
          setSuggestedVideos(suggestionRes.data.suggested);
        }

        // ✅ Add to history
        if (token) {
          await axios.post(
            "http://localhost:4000/api/history/add",
            { video: id },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        }
      } catch (error) {
        console.error("VideoPage Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    window.scrollTo(0, 0);
  }, [id, token, userId]);

  const handleReaction = async (type) => {
    if (!token) {
      setLoginMessage("Please login to react.");
      setTimeout(() => setLoginMessage(""), 3000);
      return;
    }

    try {
      const res = await axios.put(
        `http://localhost:4000/api/video/react/${id}`,
        { type },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setVideoData((prev) => ({
          ...prev,
          likes: Array(res.data.likesCount).fill("x"),
          dislikes: Array(res.data.dislikesCount).fill("x"),
        }));
        setLiked(type === "like");
        setDisliked(type === "dislike");
      }
    } catch (error) {
      console.error("Reaction Error:", error);
    }
  };

  const handleAddComment = async () => {
    if (!token) {
      setLoginMessage("Please login first to comment.");
      setTimeout(() => setLoginMessage(""), 3000);
      return;
    }

    if (!commentText.trim()) return;

    try {
      const res = await axios.post(
        "http://localhost:4000/api/comment",
        { video: videoData._id, message: commentText },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.newComment) {
        setComments((prev) => [res.data.newComment, ...prev]);
      }

      setCommentText("");
    } catch (error) {
      console.error("Add Comment Error:", error);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!videoData) return <div>Video not found</div>;

  return (
    <div className="video-page">
      {/* LEFT SECTION */}
      <div className="videopost-section">
        <video className="video_player" controls autoPlay>
          <source src={videoData.videoLink} type="video/mp4" />
        </video>
        <h2 className="video_title">{videoData.title}</h2>

        {/* VIDEO INFO */}
        <div className="video_info_row">
          <div
            className="channel_section"
            onClick={() => navigate(`/profile/${videoData.user?._id}`)}
          >
            <img
              src={videoData.user?.profilePic || "https://via.placeholder.com/40?text=User"}
              alt="channel"
              className="channel_avatar"
            />
            <div>
              <div className="channel_name">{videoData.user?.channelName}</div>
              <div className="upload_date">{new Date(videoData.createdAt).toDateString()}</div>
            </div>
          </div>

          {/* LIKE / DISLIKE */}
          <div className="like_section">
            <div
              onClick={() => handleReaction("like")}
              style={{
                cursor: "pointer",
                color: liked ? "blue" : "white",
                display: "flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              <ThumbUpIcon />
              <span>{videoData.likes?.length || 0}</span>
            </div>

            <div
              onClick={() => handleReaction("dislike")}
              style={{
                cursor: "pointer",
                color: disliked ? "red" : "white",
                marginLeft: "15px",
              }}
            >
              <ThumbDownIcon />
            </div>
          </div>
        </div>

        {/* DESCRIPTION */}
        <div className="video_description">{videoData.description}</div>

        {loginMessage && <div style={{ color: "red", marginBottom: "10px" }}>{loginMessage}</div>}

        {/* COMMENTS */}
        <div className="comments_section">
          <h3>{comments.length} Comments</h3>
          <input
            className="comment_input"
            placeholder="Add a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <button className="comment_btn" onClick={handleAddComment}>
            Comment
          </button>

          {comments.map((c, i) => (
            <div key={i} className="comment_item">
              <img
                src={c.user?.profilePic || "https://via.placeholder.com/40?text=User"}
                alt="user"
                className="comment_avatar"
                onClick={() => navigate(`/profile/${c.user?._id}`)}
              />
              <div>
                <div className="comment_user">{c.user?.userName}</div>
                <div className="comment_text">{c.message}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="video_suggestion">
        {suggestedVideos.map((item) => (
          <div
            key={item._id}
            className="suggestion_item"
            onClick={() => navigate(`/video/${item._id}`)}
          >
            <img src={item.thumbnail} alt={item.title} className="suggestion_thumbnail" />
            <div className="suggestion_info">
              <div className="suggestion_title">{item.title}</div>
              <div className="suggestion_channel">{item.user?.channelName}</div>
              <div className="suggestion_stats">
                {item.likes?.length || 0} likes • {new Date(item.createdAt).toDateString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoPage;