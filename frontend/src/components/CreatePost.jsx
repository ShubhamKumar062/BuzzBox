import { useState, useEffect } from 'react';
import { X, Type, BarChart3, Image } from 'lucide-react';
import api from '../utils/axiosInstance';

const CreatePost = ({ onCreatePost, onCancel }) => {
  const [postType, setPostType] = useState('text');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [location, setLocation] = useState(null);
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await api.get('/groups');
        setGroups(res.data.groups || []);
      } catch (err) {
        console.error('Failed to load groups:', err.response?.data || err.message);
      }
    };
    fetchGroups();
  }, []);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setLocation({
          type: 'Point',
          coordinates: [coords.longitude, coords.latitude],
        });
      },
      () => {
        console.warn('Location access denied. Using default location.');
        setLocation({
          type: 'Point',
          coordinates: [77.1025, 28.7041],
        });
      }
    );
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !selectedGroup || !location) {
      alert('Title, Group, and Location are required.');
      return;
    }

    const payload = {
      title: title.trim(),
      content: content.trim(),
      groupId: selectedGroup,
      location,
    };

    try {
      const res = await api.post('/posts', payload);
      onCreatePost(res.data.post);
      onCancel();
    } catch (err) {
      console.error('Post creation failed:', err.response?.data || err.message);
      alert('Failed to create post. See console for details.');
    }
  };

  return (
    <div className="create-post-overlay">
      <div className="create-post-modal card">
        <div className="create-post-header">
          <h2>Create a Post</h2>
          <button onClick={onCancel} className="close-btn"><X size={20} /></button>
        </div>

        <div className="post-type-selector">
          <button className={`type-btn ${postType === 'text' ? 'active': ''}`} onClick={() => setPostType('text')}><Type size={16}/> Text</button>
          <button className="type-btn" disabled><BarChart3 size={16}/> Poll</button>
          <button className="type-btn" disabled><Image size={16}/> Image</button>
        </div>

        <form onSubmit={handleSubmit} className="create-post-form">
          <div className="form-group">
            <label htmlFor="group">Select Group</label>
            <select id="group" value={selectedGroup} onChange={e => setSelectedGroup(e.target.value)} required>
              <option value="">Choose a group</option>
              {groups.map(g => (
                <option key={g._id} value={g._id}>{g.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input id="title" type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="What's your post about?" maxLength={300} required />
            <div className="char-count">{title.length}/300</div>
          </div>

          {postType === 'text' && (
            <div className="form-group">
              <label htmlFor="content">Text (optional)</label>
              <textarea id="content" value={content} onChange={e => setContent(e.target.value)} placeholder="Tell your community more..." rows={6} maxLength={10000}/>
              <div className="char-count">{content.length}/10000</div>
            </div>
          )}

          <div className="form-actions">
            <button type="button" onClick={onCancel} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={!title || !selectedGroup} className="gradient-bg">Post</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
