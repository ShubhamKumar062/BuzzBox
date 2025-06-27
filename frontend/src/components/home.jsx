import { useEffect, useState } from 'react';
import Header from './Header';
import Feed from './Feed';
import CreatePost from './CreatePost';
import api from '../utils/axiosInstance';

const Home = () => {
  const [user, setUser] = useState(null);
  const [communities, setCommunities] = useState([]);
  const [posts, setPosts] = useState([]);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const loc = {
          type: 'Point',
          coordinates: [longitude, latitude]
        };
        setLocation(loc);
        fetchNearbyData(loc); 
      },
      (err) => {
        console.warn('Location access denied. Using default.');
        const defaultLoc = {
          type: 'Point',
          coordinates: [77.1025, 28.7041] 
        };
        setLocation(defaultLoc);
        fetchNearbyData(defaultLoc);
      }
    );

    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await api.get('/auth/me');
      setUser(res.data.user);
    } catch (err) {
      console.error('Auth failed:', err);
    }
  };

  const fetchNearbyData = async (loc) => {
    const [lng, lat] = loc.coordinates;

    try {
      const groupRes = await api.get(`/groups/nearby?lat=${lat}&lng=${lng}`);
      setCommunities(groupRes.data);
    } catch (err) {
      console.error('Failed to fetch groups', err);
    }

    try {
      const postRes = await api.get(`/posts/nearby?lat=${lat}&lng=${lng}`);
      setPosts(postRes.data);
    } catch (err) {
      console.error('Failed to fetch posts', err);
    }
  };

  const handleCreatePost = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
    setShowCreatePost(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.reload();
  };

  if (!user || !location) return <p>Loading...</p>;

  return (
    <div>
      <Header
        user={{
          name: user.username,
          email: user.email,
          role: user.role,
          avatar: null
        }}
        notifications={0}
        onLogout={handleLogout}
        onToggleAdmin={() => alert('Admin Panel')}
        showAdminToggle={user.role === 'admin'}
      />

      <div className="main-content">
        <button onClick={() => setShowCreatePost(true)} className="create-post-fab">
          + Create Post
        </button>

        {showCreatePost && (
          <CreatePost
            communities={communities}
            onCreatePost={handleCreatePost}
            onCancel={() => setShowCreatePost(false)}
          />
        )}

        <Feed
          posts={posts}
          currentUser={user}
          userVotes={[]} 
          bookmarkedPosts={[]} 
          onVote={() => {}} 
          onPollVote={() => {}}
          onAddComment={() => {}}
          onToggleBookmark={() => {}}
        />
      </div>
    </div>
  );
};

export default Home;
