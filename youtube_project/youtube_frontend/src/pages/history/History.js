import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./History.css";

const History = ({ sideNavbar }) => {
  const [historyVideos, setHistoryVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        setError("");

        if (!token) {
          setError("You must be logged in to view history.");
          setLoading(false);
          return;
        }

        const res = await axios.get("http://localhost:4000/api/history/get", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.data.success) {
          setHistoryVideos(res.data.history || []);
        } else {
          setError("No history found.");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch history.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [token]);

  if (loading) return <div className="history_page">Loading...</div>;
  if (error) return <div className="history_page">{error}</div>;

  return (
    <div className={`history_page ${sideNavbar ? "sidebar-open" : ""}`}>
      <h2>Watch History</h2>

      {historyVideos.length === 0 ? (
        <p>You have not watched any videos yet.</p>
      ) : (
        <div className="history_grid">
          {historyVideos.map((item) => {
            const video = item.video; // access the populated video object
            if (!video) return null; // skip if video was deleted

            return (
              <div
                key={item._id}
                className="history_card"
                onClick={() => navigate(`/video/${video._id}`)}
              >
                <img
                  src={video.thumbnail || "https://via.placeholder.com/300x180"}
                  alt={video.title}
                />
                <h3>{video.title}</h3>
                <p>{new Date(item.createdAt).toLocaleString()}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default History;