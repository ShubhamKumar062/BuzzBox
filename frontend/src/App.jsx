import { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { useApp } from './context/AppContext';
import api from './utils/axiosInstance';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import Header from './components/Header';
import LocationSelector from './components/LocationSelector';
import CommunityList from './components/CommunityList';
import Feed1 from './components/Feed1'; 
import CreatePost from './components/CreatePost';
import CreateGroup from './components/CreateGroup';
import AdminPanel from './components/AdminPanel/AdminPanel';
import LoadingSpinner from './components/LoadingSpinner';
import './App.css';

function App() {
  const { user, isAuthenticated, users, login, signup, logout, toggleUserStatus } = useAuth();
  const { state, dispatch } = useApp();

  const [authMode, setAuthMode] = useState('login');
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  const handleLogin = async (credentials) => {
    const result = await login(credentials);
    if (!result.success) {
      alert(result.error);
    }
  };

  const handleSignup = async (userData) => {
    const result = await signup(userData);
    if (!result.success) {
      alert(result.error);
    }
  };

  const handleLocationChange = (location) => {
    dispatch({ type: 'SET_LOCATION', payload: location });
  };

  const handleCommunitySelect = (communityId) => {
    dispatch({ type: 'SET_COMMUNITY', payload: communityId });
  };

  const handleCreatePost = async (newPost) => {
  try {
    const res = await api.get('/posts');  
    dispatch({ type: 'SET_POSTS', payload: res.data.posts });
  } catch (err) {
    console.error('Failed to refresh posts:', err);
  }
  setShowCreatePost(false);
};


const handleCreateGroup = async (groupFromBackend) => {
  try {
    const res = await api.get('/groups');  
    dispatch({ type: 'SET_COMMUNITIES', payload: res.data.groups });
  } catch (err) {
    console.error('Failed to refresh groups:', err);
  }
  setShowCreateGroup(false);
};



  const handleVote = (postId, voteType) => {
    if (!isAuthenticated) return alert('Please login to vote');
    dispatch({ type: 'VOTE_POST', payload: { postId, voteType } });
  };

  const handleAddComment = (postId, commentText) => {
    if (!isAuthenticated) return alert('Please login to comment');
    const comment = {
      id: `comment_${Date.now()}`,
      author: user.name,
      content: commentText,
      timestamp: new Date().toISOString(),
      upvotes: 0,
      downvotes: 0,
      replies: []
    };
    dispatch({ type: 'ADD_COMMENT', payload: { postId, comment } });
  };

  const handlePollVote = (postId, optionIndex) => {
    if (!isAuthenticated) return alert('Please login to vote in polls');
    dispatch({ type: 'VOTE_POLL', payload: { postId, optionIndex } });
  };

  const handleDeletePost = (postId) => {
    dispatch({ type: 'DELETE_POST', payload: postId });
  };

  const handleDeleteComment = (postId, commentId) => {
    dispatch({ type: 'DELETE_COMMENT', payload: { postId, commentId } });
  };

  if (!isAuthenticated) {
    return authMode === 'login' ? (
      <Login onLogin={handleLogin} onSwitchToSignup={() => setAuthMode('signup')} />
    ) : (
      <Signup onSignup={handleSignup} onSwitchToLogin={() => setAuthMode('login')} />
    );
  }

  const filteredPosts = state.selectedCommunity === 'all' 
    ? state.posts 
    : state.posts.filter(post => post.community === state.selectedCommunity);

  if (state.loading) return <LoadingSpinner />;

  return (
    <div className="app">
      <Header 
        user={user} 
        notifications={state.notifications}
        onLogout={logout}
        onToggleAdmin={() => setShowAdminPanel(!showAdminPanel)}
        showAdminToggle={user.role === 'admin'}
      />
      
      <main className="main-content">
        <div className="container">
          {showAdminPanel && user.role === 'admin' ? (
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
                    {state.selectedCommunity === 'all' 
                      ? `Local Feed - ${state.currentLocation}` 
                      : `${state.communities.find(c => c.id === state.selectedCommunity)?.name || 'Community'}`
                    }
                  </h2>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button 
                      onClick={() => setShowCreatePost(true)}
                      className="create-post-btn gradient-bg"
                    >
                      Create Post
                    </button>
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
                    communities={state.communities}
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

                <Feed1 /> 
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
