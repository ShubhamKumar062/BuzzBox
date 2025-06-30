# BuzzBox – Hyperlocal News & Discussion App

## Overview
BuzzBox is a Reddit-style social platform designed for hyperlocal communities—neighborhoods, colleges, or city blocks. It enables real-time discussions, community group creation, local news sharing, polling, and interactive engagement through comments and upvotes.

**Live Demo:** [https://creative-hotteok-a0fe87.netlify.app/]

## Core Features
- 📍 **Location-based Newsfeed** - Content tailored to user's geolocation
- 🗣️ **Community Groups** - Create/join interest-based groups
- 📊 **Polls & Discussions** - Create polls and engage in debates
- 👍 **Upvotes & Comments** - Interactive engagement system
- 🛡️ **Admin Panel** - Content moderation tools for moderators
- 🔐 **JWT Authentication** - Secure user authentication

## Tech Stack
| Component       | Technology                  |
|-----------------|-----------------------------|
| Frontend        | React.js, Google Maps API   |
| Backend         | Node.js, Express.js         |
| Database        | MongoDB                     |
| Authentication  | JWT                         |
| HTTP Client     | Axios with interceptors     |
| Frontend Host   | Netlify                     |

## Project Structure

📦 BuzzBox/
├── 📂 frontend/
│   ├── 📱 src/
│   │   ├── 📂 assets/
│   │   │   └── 📜 react.svg
│   │   ├── 📂 components/
│   │   │   ├── 📂 AdminPanel/
│   │   │   │   ├── 📜 AdminPanel.css
│   │   │   │   └── 📜 AdminPanel.jsx
│   │   │   ├── 📂 Auth/
│   │   │   │   ├── 📜 Auth.css
│   │   │   │   ├── 📜 Login.jsx
│   │   │   │   └── 📜 Signup.jsx
│   │   │   ├── 📜 Comments.css
│   │   │   ├── 📜 Comments.jsx
│   │   │   ├── 📜 CommunityList.css
│   │   │   ├── 📜 CommunityList.jsx
│   │   │   ├── 📜 CreateGroup.jsx
│   │   │   ├── 📜 CreatePost.css
│   │   │   ├── 📜 CreatePost.jsx
│   │   │   ├── 📜 Feed1.css
│   │   │   ├── 📜 Feed1.jsx
│   │   │   ├── 📜 Header.css
│   │   │   ├── 📜 Header.jsx
│   │   │   ├── 📜 LoadingSpinner.css
│   │   │   ├── 📜 LoadingSpinner.jsx
│   │   │   ├── 📜 LocationSelector.css
│   │   │   ├── 📜 LocationSelector.jsx
│   │   │   ├── 📜 Post.css
│   │   │   ├── 📜 Post.jsx
│   │   │   ├── 📜 PostDetails.css
│   │   │   └── 📜 PostDetails.jsx
│   │   ├── 📂 context/
│   │   │   ├── 📜 AppContext.jsx
│   │   │   └── 📜 AuthContext.jsx
│   │   ├── 📂 hooks/
│   │   │   ├── 📜 useDebounce.js
│   │   │   └── 📜 useLocalStorage.js
│   │   ├── 📂 utils/
│   │   │   ├── 📜 axiosInstance.jsx
│   │   │   └── 📜 mockData.js
│   │   ├── 📜 App.css
│   │   ├── 📜 App.jsx
│   │   ├── 📜 index.css
│   │   └── 📜 main.jsx
│   ├── 🎨 public/
│   │   └── 📜 index.html
│   ├── 📝 .gitignore
│   ├── 📝 eslint.config.js
│   ├── 📝 package-lock.json
│   ├── 📝 package.json
│   ├── 📝 README.md
│   └── 📝 vite.config.js
│
└── 📂 backend/
    ├── 🔧 config/
    │   └── 📜 db.js
    ├── 🎮 controller/
    │   ├── 📜 authController.js
    │   ├── 📜 commentController.js
    │   ├── 📜 groupController.js
    │   ├── 📜 modController.js
    │   ├── 📜 pollController.js
    │   └── 📜 postController.js
    ├── 🔒 middleware/
    │   ├── 📜 auth.js
    │   └── 📜 geo.js
    ├── 📊 model/
    │   ├── 📜 comment.js
    │   ├── 📜 group.js
    │   ├── 📜 poll.js
    │   ├── 📜 post.js
    │   └── 📜 user.js
    ├── 📝 package-lock.json
    ├── 📝 package.json
    └── 🚀 server.js

### Prerequisites
- Node.js (v18+)
- MongoDB (v6+)
- Google Maps API key

### Installation
1. Clone repository:
   ```bash
   git clone https://github.com/ShubhamKumar062/BuzzBox
   cd buzzbox

2. Set up backend:
    ```bash
    cd backend
    npm install

3. Set up frontend:
    ```bash
    cd ../frontend
    npm install

4. Start servers:
    ```bash
## Backend:
    npm run dev

## Frontend:
    npm run dev

# Deployment
**Frontend** : https://creative-hotteok-a0fe87.netlify.app/

**Backend** : buzzbox-backend-1.vercel.app


# API Endpoints
 **Endpoint**	|  **Method**  |	**Description**
/api/auth/login	|   POST	   |      User authentication
/api/posts	    |   GET	       |      Location-based posts
/api/groups	    |   POST	   |      Create community group
/api/polls	    |   POST	   |      Create new poll
/admin/posts	|   DELETE	   |      Moderator delete post

# Key Components
**Geolocation** - LocationSelector.jsx + Google Maps API

**Authentication** - JWT via AuthContext.jsx

**Admin Tools** - AdminPanel.jsx with moderation features

**Optimizations** - useDebounce.js + Axios interceptors

# Contributing

1. Fork the repository
2. Create your feature branch (git checkout -b feature/AmazingFeature)
3. Commit changes (git commit -m 'Add feature')
4. Push to branch (git push origin feature/AmazingFeature)
5. Open a pull request