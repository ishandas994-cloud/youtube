import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const Search = () => {
  const { query } = useParams();
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchSearch = async () => {
      try {
        const res = await axios.get(
          `http://localhost:4000/api/video/search/${query}`
        );

        if (res.data.success) {
          setVideos(res.data.videos);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchSearch();
  }, [query]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Search Results for "{query}"</h2>

      {videos.map((video) => (
        <div
          key={video._id}
          onClick={() => navigate(`/video/${video._id}`)}
          style={{ cursor: "pointer", marginBottom: "20px" }}
        >
          <img src={video.thumbnail} width="250" alt="" />
          <h4>{video.title}</h4>
          <p>{video.user?.channelName}</p>
        </div>
      ))}
    </div>
  );
};

export default Search;