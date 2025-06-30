import { useEffect, useState } from 'react';
import api from '../../utils/axiosInstance';
import './AdminPanel.css';

const AdminPanel = ({ currentUser }) => {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('posts');
  const fetchPosts = async () => {
    try {
      const res = await api.get('/posts');
      setPosts(res.data.posts || []);
    } catch (err) {
      console.error('Error fetching posts:', err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get('/mod/users');
      setUsers(res.data || []);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  useEffect(() => {
    fetchPosts();
    fetchUsers();
  }, []);

  const deletePost = async (postId) => {
    try {
      await api.delete(`/mod/posts/${postId}`);
      fetchPosts();
    } catch (err) {
      console.error('Failed to delete post:', err);
    }
  };

  const deleteComment = async (commentId) => {
    try {
      await api.delete(`/mod/comments/${commentId}`);
      fetchPosts();
    } catch (err) {
      console.error('Failed to delete comment:', err);
    }
  };

  const deletePoll = async (pollId) => {
    try {
      await api.delete(`/mod/polls/${pollId}`);
      fetchPosts();
    } catch (err) {
      console.error('Failed to delete poll:', err);
    }
  };

  const toggleUserStatus = async (id) => {
    try {
      await api.patch(`/mod/users/${id}/toggle`);
      fetchUsers();
    } catch (err) {
      console.error('Failed to toggle user:', err);
    }
  };

  const formatDate = (d) => new Date(d).toLocaleString();
  return (
    <div className="admin-panel">
      <h2>Admin Dashboard</h2>
      <div className="admin-tabs">
        <button onClick={() => setActiveTab('posts')}>Posts</button>
        <button onClick={() => setActiveTab('users')}>Users</button>
      </div>

      {activeTab === 'posts' && (
        <div>
          <h3>Manage Posts</h3>
          {posts.map(post => (
            <div key={post._id} className="admin-post">
              <h4>{post.title}</h4>
              <p>{post.content}</p>
              <small>By: {post.author?.username} | {formatDate(post.createdAt)}</small>
              <div style={{ marginTop: 8 }}>
                <button onClick={() => deletePost(post._id)}>🗑️ Delete Post</button>
                {post.poll && (
                  <button onClick={() => deletePoll(post.poll._id)}>🗑️ Delete Poll</button>

                )}
              </div>

              {post.comments?.length > 0 && (
                <div className="admin-comments">
                  <h5>Comments:</h5>
                  {post.comments.map(comment => (
                    <div key={comment._id} className="admin-comment">
                      <p>{comment.content}</p>
                      <small>By: {comment.author?.username || 'User'} | {formatDate(comment.createdAt)}</small>
                      <button onClick={() => deleteComment(comment._id)}>Delete Comment</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {activeTab === 'users' && (
        <div>
          <h3>Manage Users</h3>
          {users.map(user => (
            <div key={user._id} className="admin-user">
              <strong>{user.username}</strong> - {user.email} - {user.role}
              {user._id !== currentUser.id && (
                <button onClick={() => toggleUserStatus(user._id)}>
                  {user.status === 'suspended' ? 'Activate' : 'Suspend'}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
