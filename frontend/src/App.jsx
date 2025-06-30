import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { useApp } from "./context/AppContext";
import api from "./utils/axiosInstance";
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import Header from "./components/Header";
import LocationSelector from "./components/LocationSelector";
import CommunityList from "./components/CommunityList";
import Feed1 from "./components/Feed1";
import CreatePost from "./components/CreatePost";
import CreateGroup from "./components/CreateGroup";
import AdminPanel from "./components/AdminPanel/AdminPanel";
import LoadingSpinner from "./components/LoadingSpinner";
import PostDetail from "./components/PostDetails";
import "./App.css";

function App() {
  const {
    user,
    isAuthenticated,
    users,
    login,
    signup,
    logout,
    toggleUserStatus,
  } = useAuth();
  const { state, dispatch } = useApp();

  const [authMode, setAuthMode] = useState("login");
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [postType, setPostType] = useState("text");

  const handleLogin = async (credentials) => {
    const result = await login(credentials);
    if (!result.success) alert(result.error);
  };

  const handleSignup = async (userData) => {
    const result = await signup(userData);
    if (!result.success) alert(result.error);
  };

  const handleLocationChange = (location) => {
    dispatch({ type: "SET_LOCATION", payload: location });
  };

  const handleCommunitySelect = (communityId) => {
    dispatch({ type: "SET_COMMUNITY", payload: communityId });
  };

  const handleCreatePost = async () => {
    try {
      const res = await api.get("/posts");
      dispatch({ type: "SET_POSTS", payload: res.data.posts });
    } catch (err) {
      console.error("Failed to refresh posts:", err);
    }
    setShowCreatePost(false);
  };

  const handleCreateGroup = async () => {
    try {
      const res = await api.get("/groups");
      dispatch({ type: "SET_COMMUNITIES", payload: res.data.groups });
    } catch (err) {
      console.error("Failed to refresh groups:", err);
    }
    setShowCreateGroup(false);
  };

  const handleVote = (postId, voteType) => {
    if (!isAuthenticated) return alert("Please login to vote");
    dispatch({ type: "VOTE_POST", payload: { postId, voteType } });
  };

  const handleAddComment = (postId, commentText) => {
    if (!isAuthenticated) return alert("Please login to comment");
    const comment = {
      id: `comment_${Date.now()}`,
      author: user.name,
      content: commentText,
      timestamp: new Date().toISOString(),
      upvotes: 0,
      downvotes: 0,
      replies: [],
    };
    dispatch({ type: "ADD_COMMENT", payload: { postId, comment } });
  };

  const handlePollVote = async (postId, pollId, optionIndex) => {
    if (!isAuthenticated) return alert("Please login to vote in polls");
    try {
      await api.post("/polls/vote", { pollId, optionIndex });
      dispatch({ type: "VOTE_POLL", payload: { postId, optionIndex } });
    } catch (err) {
      console.error("Poll vote failed:", err.message);
      alert("Poll vote failed. Please try again.");
    }
  };

  const handleDeletePost = (postId) => {
    dispatch({ type: "DELETE_POST", payload: postId });
  };

  const handleDeleteComment = (postId, commentId) => {
    dispatch({ type: "DELETE_COMMENT", payload: { postId, commentId } });
  };

  if (!isAuthenticated) {
    return authMode === "login" ? (
      <Login
        onLogin={handleLogin}
        onSwitchToSignup={() => setAuthMode("signup")}
      />
    ) : (
      <Signup
        onSignup={handleSignup}
        onSwitchToLogin={() => setAuthMode("login")}
      />
    );
  }

  if (state.loading) return <LoadingSpinner />;

  const uniqueLocations = [
    ...new Set(
      state.posts.map((post) => JSON.stringify(post.location)).filter(Boolean)
    ),
  ].map((loc) => JSON.parse(loc));

  const locationUserMap = {};
  state.posts.forEach((post) => {
    const key = JSON.stringify(post.location);
    if (!key) return;
    if (!locationUserMap[key]) locationUserMap[key] = new Set();
    locationUserMap[key].add(post.author?.username || "Anonymous");
  });

  const currentLocationKey = JSON.stringify(state.currentLocation);

  const locationStats = {
    locations: uniqueLocations,
    userCount: locationUserMap[currentLocationKey]?.size || 0,
    communityCount: state.communities.filter(
      (c) => JSON.stringify(c.location) === currentLocationKey
    ).length,
  };

  const filteredPosts =
    state.selectedCommunity === "all"
      ? state.posts
      : state.posts.filter(
          (post) => post.community === state.selectedCommunity
        );

  return (
    <Router>
      <div className="app">
        <Header
          user={user}
          notifications={state.notifications}
          onLogout={logout}
          onToggleAdmin={() => setShowAdminPanel((prev)=>!prev)}
          showAdminToggle={user.role === "admin"}
          posts={filteredPosts}
        />

        <main className="main-content">
          <div className="container">
            <Routes>
              <Route
                path="/"
                element={
                  showAdminPanel && user.role === "admin" ? (
                    <AdminPanel
                      posts={state.posts}
                      users={users}
                      onDeletePost={handleDeletePost}
                      onDeleteComment={handleDeleteComment}
                      onToggleUserStatus={toggleUserStatus}
                      currentUser={user}
                    />
                  ) : (
                    <div className="layout">
                      <aside className="sidebar">
                        <LocationSelector
                          currentLocation={state.currentLocation}
                          onLocationChange={handleLocationChange}
                          locations={locationStats.locations}
                          activeUserCount={locationStats.userCount}
                          communityCount={locationStats.communityCount}
                        />
                        <CommunityList
                          communities={state.communities}
                          selectedCommunity={state.selectedCommunity}
                          onCommunitySelect={handleCommunitySelect}
                        />
                      </aside>

                      <div className="content">
                        <div className="feed-header">
                          <h2>
                            {state.selectedCommunity === "all"
                              ? `Local Feed - ${JSON.stringify(
                                  state.currentLocation
                                )}`
                              : `${
                                  state.communities.find(
                                    (c) => c.id === state.selectedCommunity
                                  )?.name || "Community"
                                }`}
                          </h2>
                          <div style={{ display: "flex", gap: "10px" }}>
                          
                            <button
                              onClick={async () => {
                                setPostType("text");
                                const res = await api.get("/groups");
                                dispatch({
                                  type: "SET_COMMUNITIES",
                                  payload: res.data.groups,
                                });
                                setShowCreatePost(true);
                              }}
                              className="create-post-btn gradient-bg"
                            >
                              Create Post
                            </button>

                            {/* Create Poll */}
                            {/* <button
                              onClick={async () => {
                                setPostType("poll");
                                const res = await api.get("/posts");
                                dispatch({
                                  type: "SET_POSTS",
                                  payload: res.data.posts,
                                });
                                setShowCreatePost(true);
                              }}
                              className="create-post-btn gradient-bg"
                            >
                              Create Poll
                            </button> */}

                            <button
                              onClick={() => setShowCreateGroup(true)}
                              className="create-post-btn gradient-bg"
                            >
                              Create Group
                            </button>
                          </div>
                        </div>

                        {showCreatePost && (
                          <CreatePost
                            communities={
                              postType === "text" ? state.communities : []
                            }
                            posts={postType === "poll" ? state.posts : []}
                            postType={postType}
                            onCreatePost={handleCreatePost}
                            onCancel={() => setShowCreatePost(false)}
                            userId={user.id}
                          />
                        )}

                        {showCreateGroup && (
                          <CreateGroup
                            onGroupCreated={handleCreateGroup}
                            onCancel={() => setShowCreateGroup(false)}
                          />
                        )}

                        <Feed1
                          posts={filteredPosts}
                          onAddComment={handleAddComment}
                          currentUser={user}
                          onPollVote={handlePollVote}
                        />
                      </div>
                    </div>
                  )
                }
              />
              <Route
                path="/posts/:postId"
                element={
                  <PostDetail
                    currentUser={user}
                    onAddComment={handleAddComment}
                  />
                }
              />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
