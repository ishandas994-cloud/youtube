# 🎥 YouTube Clone

A full-stack, responsive YouTube Clone built with the MERN (MongoDB, Express.js, React, Node.js) stack. This application replicates core YouTube functionalities including video uploads, searching, trending systems, and user authentication, providing a robust platform for content sharing and viewing.

![YouTube Clone Preview](https://img.shields.io/badge/Status-Completed-green.svg) ![MERN Stack](https://img.shields.io/badge/Stack-MERN-blue?logo=react)

## ✨ Features

- **User Authentication:** Secure signup and login using JWT (JSON Web Tokens) and bcrypt password hashing.
- **Video Management:** Users can seamlessly upload videos with titles, descriptions, and custom thumbnails.
- **Interactive Video Player:** Fully functional custom video playing experience.
- **Trending & Recommendations:** Dynamic algorithm to rank trending videos based on engagement (likes, comments) and suggest related videos.
- **Search Functionality:** Real-time search to instantly find videos by title or tags.
- **Engagement (Likes/Dislikes & Comments):** Users can react to videos and leave comments in real-time.
- **Watch History:** Tracks and maintains a personalized history of watched videos for logged-in users.
- **Responsive UI:** A beautiful, responsive interface constructed with Material UI (MUI) that works flawlessly on desktop and mobile.
- **Serverless Ready:** Configured backend (`vercel.json`) and frontend optimized for seamless Vercel deployment.

## 🛠️ Technology Stack

**Frontend:**
- React 19 (Hooks, Context API)
- React Router DOMv7 (Dynamic Routing)
- Material UI (MUI) & Emotion (Styling & Icons)
- Axios (HTTP Client)
- React Toastify (Notifications)

**Backend:**
- Node.js & Express.js (RESTful API architecture)
- MongoDB & Mongoose (Database & ODM)
- JSON Web Token (JWT) (Stateless authentication)
- Bcrypt.js (Password encryption)
- CORS & Cookie-Parser (Security & Session management)

## 🏗️ Project Architecture

```text
📦 youtube-clone
 ┣ 📂 backend            # Node.js + Express API
 ┃ ┣ 📂 Connection       # MongoDB Atlas connection setup
 ┃ ┣ 📂 Controllers      # Business logic (Users, Videos, Comments)
 ┃ ┣ 📂 Models           # Mongoose schemas
 ┃ ┣ 📂 Routes           # Express API endpoints
 ┃ ┣ 📜 index.js         # Entry point & CORS/Serverless Config
 ┃ ┗ ...
 ┣ 📂 frontend           # React App
 ┃ ┣ 📂 public           # Static assets
 ┃ ┣ 📂 src              # Source code
 ┃ ┃ ┣ 📂 component      # Reusable UI components (Navbar, Login, etc.)
 ┃ ┃ ┣ 📂 pages          # Route pages (Home, Profile, Video, Search)
 ┃ ┃ ┣ 📜 App.js         # Main Application wrapper
 ┃ ┃ ┗ 📜 api.js         # Axios interceptor config
 ┃ ┗ ...
```

## 🚀 Getting Started

### Prerequisites
- Node.js
- MongoDB Atlas Account (or local MongoDB)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ishandas994-cloud/youtube.git
   cd youtube-clone
   ```

2. **Setup Backend:**
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the `backend` directory:
   ```env
   PORT=4000
   MONGO_URL=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   BACKEND_URL=http://localhost:4000
   ```
   *Run the server:* `npm start`

3. **Setup Frontend:**
   ```bash
   cd ../frontend
   npm install
   ```
   Create a `.env` file in the `frontend` directory:
   ```env
   REACT_APP_API_URL=http://localhost:4000
   ```
   *Start the React app:* `npm start`

## 🌍 Deployment

This project is fully configured to be deployed on **Vercel**.
- **Backend:** Node.js Serverless Functions (`backend/vercel.json` included).
- **Frontend:** React SPA Rewrite (`frontend/vercel.json` included).

---
*If you like this project, please consider leaving a ⭐!*
