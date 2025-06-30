import { useState, useEffect } from 'react';
import { MapPin, ChevronDown } from 'lucide-react';
import './LocationSelector.css';

const LocationSelector = ({ currentLocation, onLocationChange, locations, activeUserCount, communityCount }) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.location-selector')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleLocationSelect = (location) => {
    onLocationChange(location);
    setIsOpen(false);
  };

  const formatLocation = (loc) => {
    if (!loc) return 'Unknown';
    if (typeof loc === 'string') return loc;
    if (typeof loc === 'object') {
      return loc.coordinates ? `(${loc.coordinates.join(', ')})` : JSON.stringify(loc);
    }
    return String(loc);
  };

  return (
    <div className="location-selector card">
      <div className="location-header">
        <MapPin className="location-icon" size={20} />
        <h3>Your Location</h3>
      </div>

      <div className="location-dropdown">
        <button className="location-btn" onClick={() => setIsOpen(!isOpen)}>
          <span>{formatLocation(currentLocation)}</span>
          <ChevronDown className={`chevron ${isOpen ? 'open' : ''}`} size={16} />
        </button>

        {isOpen && (
          <div className="location-menu">
            {locations?.map((location, index) => (
              <button
                key={index}
                className={`location-item ${JSON.stringify(location) === JSON.stringify(currentLocation) ? 'active' : ''}`}
                onClick={() => handleLocationSelect(location)}
              >
                {formatLocation(location)}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="location-stats">
        <div className="stat">
          <span className="stat-number">{activeUserCount || 0}</span>
          <span className="stat-label">Active Users</span>
        </div>
        <div className="stat">
          <span className="stat-number">{communityCount || 0}</span>
          <span className="stat-label">Communities</span>
        </div>
      </div>
    </div>
  );
};

export default LocationSelector;
