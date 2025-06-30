import { useState } from 'react';
import { Users, TrendingUp, Clock } from 'lucide-react';
import './CommunityList.css';

const CommunityList = ({ communities, selectedCommunity, onCommunitySelect }) => {
  const [sortBy, setSortBy] = useState('members');

  const sortedCommunities = [...communities].sort((a, b) => {
    switch (sortBy) {
      case 'members':
        return b.members - a.members;
      case 'activity':
        return b.postsToday - a.postsToday;
      case 'recent':
        return new Date(b.lastActivity) - new Date(a.lastActivity);
      default:
        return 0;
    }
  });

  return (
    <div className="community-list card">
      <div className="community-header">
        <h3>Communities</h3>
      
      </div>

      <div className="community-item-container">
        <button
          className={`community-item ${selectedCommunity === 'all' ? 'active' : ''}`}
          onClick={() => onCommunitySelect('all')}
        >
          <div className="community-info">
            <span className="community-name">All Communities</span>
            <span className="community-stats">
              {communities.reduce((total, c) => total + c.members, 0)} members
            </span>
          </div>
        </button>

        {sortedCommunities.map(community => (
          <button
            key={community._id}
            className={`community-item ${selectedCommunity === community._id ? 'active' : ''}`}
            onClick={() => onCommunitySelect(community._id)}
          >
            <div className="community-avatar">
              {community.name.substring(0, 2).toUpperCase()}
            </div>
            <div className="community-info">
              <span className="community-name">{community.name}</span>
              <div className="community-stats">
                <span>{community.members.toLocaleString()} members</span>
                <span className="separator">•</span>
                <span className="activity-indicator">
                  {community.postsToday} posts today
                </span>
              </div>
            </div>
            {community.isNew && (
              <span className="new-badge">New</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CommunityList;
