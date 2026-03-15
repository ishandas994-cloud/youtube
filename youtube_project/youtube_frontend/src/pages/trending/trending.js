import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./trending.css";

const Trending = () => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/video/trending");

        if (res.data && res.data.videos) {
          setVideos(res.data.videos);
        }

      } catch (err) {
        console.error("Trending fetch error:", err);
      }
    };

    fetchTrending();
  }, []);

  return (
    <div className="trending-container">
      {videos.map((video) => (
        <Link
          to={`/video/${video._id}`}
          className="trending-link"
          key={video._id}
        >
          <div className="trending-card">

            <img
              src={video.thumbnail}
              alt={video.title}
              className="trending-thumbnail"
            />

            <div className="trending-info">
              <h3 className="trending-title">{video.title}</h3>

              <p className="trending-channel">
                {video?.user?.channelName || "Unknown Channel"}
              </p>
            </div>

          </div>
        </Link>
      ))}
    </div>
  );
};

export default Trending;