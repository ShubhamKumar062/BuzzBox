import { useState, useEffect } from 'react';
import { MapPin, ChevronDown } from 'lucide-react';
import './LocationSelector.css';

const LocationSelector = ({ currentLocation, onLocationChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [locations] = useState([
    'Downtown NYC',
    'Brooklyn Heights',
    'Williamsburg',
    'East Village',
    'SoHo',
    'Upper West Side',
    'Harlem',
    'Queens Village'
  ]);

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

  return (
    <div className="location-selector card">
      <div className="location-header">
        <MapPin className="location-icon" size={20} />
        <h3>Your Location</h3>
      </div>
      
      <div className="location-dropdown">
        <button 
          className="location-btn"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span>{currentLocation}</span>
          <ChevronDown 
            className={`chevron ${isOpen ? 'open' : ''}`} 
            size={16} 
          />
        </button>
        
        {isOpen && (
          <div className="location-menu">
            {locations.map(location => (
              <button
                key={location}
                className={`location-item ${location === currentLocation ? 'active' : ''}`}
                onClick={() => handleLocationSelect(location)}
              >
                {location}
              </button>
            ))}
          </div>
        )}
      </div>
      
      <div className="location-stats">
        <div className="stat">
          <span className="stat-number">127</span>
          <span className="stat-label">Active Users</span>
        </div>
        <div className="stat">
          <span className="stat-number">23</span>
          <span className="stat-label">Communities</span>
        </div>
      </div>
    </div>
  );
};

export default LocationSelector;