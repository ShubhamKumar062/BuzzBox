import { useState, useEffect } from 'react';
import api from '../utils/axiosInstance';
import { TrendingUp, Clock, Star, MessageCircle, Share2, Bookmark } from 'lucide-react';
import './Feed1.css';

const Feed1 = () => {
  const [posts, setPosts] = useState([]);
  const [sortBy, setSortBy] = useState('hot');
  const [visiblePosts, setVisiblePosts] = useState(6);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await api.get('/posts');
      setPosts(res.data.posts || []);
    } catch (err) {
      console.error('Error fetching posts:', err);
    }
  };

  const sortedPosts = [...posts].sort((a, b) => {
    const scoreA = a.upvotes - a.downvotes;
    const scoreB = b.upvotes - b.downvotes;
    switch (sortBy) {
      case 'hot':
        return scoreB - scoreA;
      case 'new':
        return new Date(b.timestamp) - new Date(a.timestamp);
      case 'top':
        return b.upvotes - a.upvotes;
      default:
        return 0;
    }
  });
  const displayedPosts = sortedPosts.slice(0, visiblePosts);

  return (
    <div className="feed-wrapper">
      <div className="sort-buttons">
        <button className={sortBy === 'hot' ? 'active' : ''} onClick={() => setSortBy('hot')}><TrendingUp size={16} /> Hot</button>
        <button className={sortBy === 'new' ? 'active' : ''} onClick={() => setSortBy('new')}><Clock size={16} /> New</button>
        <button className={sortBy === 'top' ? 'active' : ''} onClick={() => setSortBy('top')}><Star size={16} /> Top</button>
      </div>

      <div className="posts">
        {displayedPosts.map((post) => (
          <div className="post-card" key={post._id}>
            <div className="post-header">
              <span className="group-tag">{post.group?.name || 'Community'}</span>
              <span className="author">u/{post.author?.username || 'User'}</span>
              <span className="timestamp">{new Date(post.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <h3 className="post-title">{post.title}</h3>
            {post.content && <p className="post-content">{post.content}</p>}

            <div className="post-actions">
              <span><MessageCircle size={16} /> {post.comments?.length || 0} Comments</span>
              <span><Share2 size={16} /> Share</span>
              <span><Bookmark size={16} /> </span>
            </div>
          </div>
        ))}
      </div>

      {visiblePosts < sortedPosts.length && (
        <div className="load-more">
          <button onClick={() => setVisiblePosts(prev => prev + 6)}>Load More Posts</button>
        </div>
      )}
    </div>
  );
};

export default Feed1;
