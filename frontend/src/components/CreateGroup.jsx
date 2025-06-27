import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import api from '../utils/axiosInstance';

const CreateGroup = ({ onGroupCreated, onCancel }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState(null);

 useEffect(() => {
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude, longitude } = pos.coords;
      setLocation({
        type: 'Point',
        coordinates: [longitude, latitude],
      });
    },
    (err) => {
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
    if (!name.trim() || !description.trim() || !location) {
      alert('All fields are required.');
      return;
    }
    const newGroup = {
      name: name.trim(),
      description: description.trim(),
      location,
    };

    try {
      const res = await api.post('/groups', newGroup);
      onGroupCreated(res.data); 
      onCancel();
    } catch (err) {
      console.error('Group creation failed:', err.response?.data || err.message);
      alert('Failed to create group. Check console for details.');
    }
  };

  const isValid = name.trim() && description.trim();

  return (
    <div className="create-post-overlay">
      <div className="create-post-modal card">
        <div className="create-post-header">
          <h2>Create a Community</h2>
          <button onClick={onCancel} className="close-btn">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="create-post-form">
          <div className="form-group">
            <label htmlFor="name">Community Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter a name for your community"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the purpose of this community"
              rows={4}
              maxLength={1000}
              required
            />
            <div className="char-count">{description.length}/1000</div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onCancel} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={!isValid} className="gradient-bg">
              Create Group
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGroup;
