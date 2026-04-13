import React from "react";
import "./sideNavbar.css";
import { NavLink } from "react-router-dom";

import HomeIcon from "@mui/icons-material/Home";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import SubscriptionsIcon from "@mui/icons-material/Subscriptions";
import HistoryIcon from "@mui/icons-material/History";
import WatchLaterIcon from "@mui/icons-material/WatchLater";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ContentCutIcon from "@mui/icons-material/ContentCut";
import PlaylistPlayIcon from "@mui/icons-material/PlaylistPlay";
import PersonIcon from "@mui/icons-material/Person";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";

const SideNavbar = ({ sideNavbar }) => {
  // Toggle sidebar class for mobile overlay behavior
  const sidebarClass = `home-sideNavbar ${
    sideNavbar ? "home-sideNavbarOpen" : "home-sideNavbarHide"
  }`;

  return (
    <div className={sidebarClass}>

      {/* TOP SECTION */}
      <div className="home-sideNavbarTop">
        <NavLink to="/" className="home_sideNavbarTopOption">
          <HomeIcon />
          <span>Home</span>
        </NavLink>

        <NavLink to="/trending" className="home_sideNavbarTopOption">
          <WhatshotIcon />
          <span>Trending</span>
        </NavLink>
      </div>

      <hr />

      {/* LIBRARY */}
      <div className="home-sideNavbarTop">
        <NavLink to="/history" className="home_sideNavbarTopOption">
          <HistoryIcon />
          <span>History</span>
        </NavLink>

        <NavLink to="/watchlater" className="home_sideNavbarTopOption">
          <WatchLaterIcon />
          <span>Watch Later</span>
        </NavLink>

        <NavLink to="/liked" className="home_sideNavbarTopOption">
          <ThumbUpAltIcon />
          <span>Liked Videos</span>
        </NavLink>
      </div>

      <hr />

      {/* USER SECTION */}
      <div className="home-sideNavbarTop">
        <NavLink to="/subscriptions" className="home_sideNavbarTopOption">
          <SubscriptionsIcon />
          <span>Subscriptions</span>
        </NavLink>

        <NavLink to="/clips" className="home_sideNavbarTopOption">
          <ContentCutIcon />
          <span>Your Clips</span>
        </NavLink>

        <NavLink to="/playlists" className="home_sideNavbarTopOption">
          <PlaylistPlayIcon />
          <span>Playlists</span>
        </NavLink>

        <NavLink to="/profile" className="home_sideNavbarTopOption">
          <PersonIcon />
          <span>Your Channel</span>
        </NavLink>

        <NavLink to="/upload" className="home_sideNavbarTopOption">
          <VideoLibraryIcon />
          <span>Your Videos</span>
        </NavLink>
      </div>

      <hr />

      {/* SUBSCRIPTIONS */}
      <div className="home_sideNavbarSectionTitle">SUBSCRIPTIONS</div>

      <NavLink to="/profile/aura-serenity" className="home_sideNavbarTopOption">
        <img
          src="https://cdn-icons-png.flaticon.com/512/1946/1946429.png"
          alt="channel"
          className="channel-avatar"
        />
        <span>Aura Serenity</span>
      </NavLink>
    </div>
  );
};

export default SideNavbar;