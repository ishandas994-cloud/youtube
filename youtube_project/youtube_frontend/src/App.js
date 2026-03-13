import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import axios from "axios";

import "./App.css";

/* COMPONENTS */
import Navbar from "./component/navbar/navbar";
import SideNavbar from "./component/sideNavbar/sideNavbar";

/* PAGES */
import Home from "./pages/home";
import Profile from "./pages/profile/profile";
import Video from "./pages/Video/video";
import Videoupload from "./pages/videouplode/videouplode";
import Signup from "./pages/signup/signup";
import Login from "./component/login/login";
import Search from "./pages/search/search";
import Trending from "./pages/trending/trending";
import History from "./pages/history/History";

function App() {
  const [sideNavbar, setSideNavbar] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // ✅ Fetch all videos from backend
    axios
      .get("http://localhost:4000/api/video")
      .then((res) => console.log("Videos:", res.data))
      .catch((err) => console.log("Error:", err));
  }, []);

  return (
    <>
      <Navbar
        sideNavbar={sideNavbar}
        setSideNavbarFunc={setSideNavbar}
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
      />

      <div className="app-layout">
        <SideNavbar sideNavbar={sideNavbar} />

        <div className={`app-content ${sideNavbar ? "shift-content" : ""}`}>
          <Routes>
            <Route path="/" element={<Home sideNavbar={sideNavbar} />} />
            <Route path="/trending" element={<Trending />} />
            <Route path="/profile/:id" element={<Profile sideNavbar={sideNavbar} />} />
            <Route path="/video/:id" element={<Video sideNavbar={sideNavbar} />} />
            <Route path="/upload" element={<Videoupload />} />
            <Route path="/search/:query" element={<Search />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/login"
              element={<Login setIsLoggedIn={setIsLoggedIn} />}
            />
            <Route path="/history" element={<History sideNavbar={sideNavbar} />} />
            <Route path="*" element={<h2>Page Not Found</h2>} />
          </Routes>
        </div>
      </div>
    </>
  );
}

export default App;