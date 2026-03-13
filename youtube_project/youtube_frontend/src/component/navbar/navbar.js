import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./navbar.css";

import MenuIcon from "@mui/icons-material/Menu";
import YouTubeIcon from "@mui/icons-material/YouTube";
import SearchIcon from "@mui/icons-material/Search";
import KeyboardVoiceIcon from "@mui/icons-material/KeyboardVoice";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PersonIcon from "@mui/icons-material/Person";

const Navbar = ({ sideNavbar, setSideNavbarFunc }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [userPic, setUserPic] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [listening, setListening] = useState(false);

  const navigate = useNavigate();

  // ================= CHECK LOGIN =================
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const userProfilePic = localStorage.getItem("userProfilePic");

    if (token && userId) {
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
    }

    if (userProfilePic) {
      setUserPic(userProfilePic);
    }
  }, []);

  // ================= SIDEBAR =================
  const toggleSidebar = () => {
    setSideNavbarFunc(!sideNavbar);
  };

  // ================= SEARCH =================
  const handleSearch = () => {
    if (searchQuery.trim() !== "") {
      navigate(`/?search=${searchQuery}`);
    }
  };

  const handleSearchEnter = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // ================= VOICE SEARCH =================
  const handleVoiceSearch = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.start();
    setListening(true);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setSearchQuery(transcript);
      setListening(false);
      navigate(`/?search=${transcript}`);
    };

    recognition.onerror = () => {
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };
  };

  // ================= LOGOUT =================
  const handleLogout = () => {
    localStorage.clear();
    setLoggedIn(false);
    setUserPic(null);
    setShowProfileMenu(false);
    navigate("/");
  };

  // ================= PROFILE NAV =================
  const handleProfileNavigation = () => {
    const userId = localStorage.getItem("userId");

    if (userId) {
      navigate(`/profile/${userId}`);
    } else {
      navigate("/login");
    }

    setShowProfileMenu(false);
  };

  return (
    <div className="navbar">

      {/* LEFT */}
      <div className="navbar-left">
        <div className="navbarHamburger" onClick={toggleSidebar}>
          <MenuIcon />
        </div>

        <Link to="/" className="youtube_link">
          <div className="youtube_img">
            <YouTubeIcon className="youtube_image" />
            <span className="navbar_youtubetitle">YouTube</span>
          </div>
        </Link>
      </div>

      {/* CENTER */}
      <div className="navbar-center">
        <div className="navbar-search">
          <input
            type="text"
            placeholder="Search"
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearchEnter}
          />
          <div className="search-icon" onClick={handleSearch}>
            <SearchIcon />
          </div>
        </div>

        {/* MIC BUTTON */}
        <div
          className={`navbar-mic ${listening ? "mic-active" : ""}`}
          onClick={handleVoiceSearch}
        >
          <KeyboardVoiceIcon />
        </div>
      </div>

      {/* RIGHT */}
      <div className="navbar-right">
        <VideoCallIcon
          className="navbar-icon"
          onClick={() => navigate("/upload")}
        />

        <NotificationsIcon className="navbar-icon" />

        <div className="profile-wrapper">
          {loggedIn && userPic ? (
            <img
              src={userPic}
              alt="profile"
              className="navbar-profile-pic"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            />
          ) : (
            <PersonIcon
              className="navbar-icon"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            />
          )}

          {showProfileMenu && (
            <div className="navbar-model">
              <div
                className="navbar-model-item"
                onClick={() => {
                  navigate("/");
                  setShowProfileMenu(false);
                }}
              >
                Home
              </div>

              <div
                className="navbar-model-item"
                onClick={handleProfileNavigation}
              >
                Profile
              </div>

              {!loggedIn ? (
                <div
                  className="navbar-model-item"
                  onClick={() => {
                    navigate("/login");
                    setShowProfileMenu(false);
                  }}
                >
                  Login
                </div>
              ) : (
                <div
                  className="navbar-model-item"
                  onClick={handleLogout}
                >
                  Logout
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;