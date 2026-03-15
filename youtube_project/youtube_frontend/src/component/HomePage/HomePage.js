import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./HomePage.css";
import axios from "axios";

const HomePage = ({ sideNavbar }) => {
  const [videos, setVideos] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");

  const scrollRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ GET SEARCH QUERY FROM URL
  const searchQuery =
    new URLSearchParams(location.search).get("search") || "";

  // ================= FETCH VIDEOS =================
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/video");

        if (res.data.success && Array.isArray(res.data.videos)) {
          const videoData = res.data.videos;

          setVideos(videoData);

          // 🔥 Create dynamic categories
          const uniqueCategories = [
            "All",
            ...new Set(videoData.map((video) => video.videoType || "All")),
          ];

          setCategories(uniqueCategories);
        }
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };

    fetchVideos();
  }, []);

  // ================= FILTER LOGIC (SEARCH + CATEGORY) =================
  useEffect(() => {
    let filtered = [...videos];

    // 🔎 Apply search filter
    if (searchQuery) {
      const cleanedSearch = searchQuery.toLowerCase().trim();

      filtered = filtered.filter((video) =>
        video.title.toLowerCase().includes(cleanedSearch)
      );
    }

    // 🎯 Apply category filter
    if (activeCategory !== "All") {
      filtered = filtered.filter(
        (video) => video.videoType === activeCategory
      );
    }

    setFilteredVideos(filtered);
  }, [searchQuery, activeCategory, videos]);

  // ================= CATEGORY CLICK =================
  const handleCategoryClick = (category) => {
    setActiveCategory(category);
  };

  // ================= SCROLL =================
  const scroll = (direction) => {
    if (!scrollRef.current) return;

    scrollRef.current.scrollBy({
      left: direction === "left" ? -300 : 300,
      behavior: "smooth",
    });
  };

  return (
    <div className="homepage-root">

      {/* CATEGORY BAR */}
      <div className={`homepage-options-wrapper ${sideNavbar ? "open" : "close"}`}>
        <button className="scroll-btn left" onClick={() => scroll("left")}>
          ❮
        </button>

        <div className="homepage-options" ref={scrollRef}>
          {categories.map((category, index) => (
            <div
              key={index}
              onClick={() => handleCategoryClick(category)}
              className={`homepage-option ${
                activeCategory === category ? "active" : ""
              }`}
            >
              {category}
            </div>
          ))}
        </div>

        <button className="scroll-btn right" onClick={() => scroll("right")}>
          ❯
        </button>
      </div>

      {/* VIDEO GRID */}
      <div className={`homepage-content ${sideNavbar ? "open" : "close"}`}>
        <div className={`video-grid ${sideNavbar ? "grid-3" : "grid-4"}`}>

          {filteredVideos.length === 0 && (
            <p style={{ marginTop: "20px" }}>
              No videos found
              {searchQuery && ` for "${searchQuery}"`}
              {activeCategory !== "All" && ` in "${activeCategory}"`}
            </p>
          )}

          {filteredVideos.map((item) => (
            <div key={item._id} className="youtube-video">

              <Link
                to={`/video/${item._id}`}
                state={{ video: item }}
                className="video-card-link"
              >
                <div className="thumbnail">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    onError={(e) =>
                      (e.target.src =
                        "https://via.placeholder.com/300x180?text=No+Thumbnail")
                    }
                  />
                  <span className="duration">10:00</span>
                </div>
              </Link>

              <div className="video-info">
                <img
                  className="avatar"
                  src={
                    item.user?.profilePic && item.user.profilePic.trim() !== ""
                      ? item.user.profilePic
                      : "https://via.placeholder.com/40?text=User"
                  }
                  alt={item.user?.channelName || "User"}
                  onClick={() => {
                    if (item.user?._id) {
                      navigate(`/profile/${item.user._id}`);
                    }
                  }}
                />

                <div className="text">
                  <p className="title">{item.title}</p>

                  <p
                    className="channel"
                    onClick={() => {
                      if (item.user?._id) {
                        navigate(`/profile/${item.user._id}`);
                      }
                    }}
                  >
                    {item.user?.channelName || "Unknown Channel"}
                  </p>

                  <p className="stats">
                    {item.likes?.length || 0} likes •{" "}
                    {item.createdAt
                      ? new Date(item.createdAt).toDateString()
                      : ""}
                  </p>
                </div>
              </div>

            </div>
          ))}

        </div>
      </div>
    </div>
  );
};

export default HomePage;