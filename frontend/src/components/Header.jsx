import { useState, useEffect } from 'react';
import { Search, Bell, User, Menu, X, LogOut, Shield } from 'lucide-react';
import { useDebounce } from '../hooks/useDebounce';
import './Header.css';

const Header = ({ user, notifications, onLogout, onToggleAdmin, showAdminToggle , posts }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

useEffect(() => {
  if (debouncedSearchQuery.length > 2 && posts?.length > 0) {
    const dynamicResults = posts.flatMap(post => [
      {
        type: 'post',
        title: post.title,
        id: post._id
      },
      {
        type: 'community',
        name: post.group?.name || 'Unknown Community',
        id: post.group?._id || 'unknown'
      },
      {
        type: 'user',
        name: post.author?.username || 'Anonymous',
        id: post.author?._id || 'anon'
      }
    ]);

    const filtered = dynamicResults.filter(item =>
      item.title?.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
      item.name?.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
    );

    setSearchResults(filtered);
    setShowSearchResults(true);
  } else {
    setShowSearchResults(false);
    setSearchResults([]);
  }
}, [debouncedSearchQuery, posts]);


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.search-container')) {
        setShowSearchResults(false);
      }
      if (!event.target.closest('.user-menu-container')) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-left">
          <button 
            className="mobile-menu-btn"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          
          <div className="logo">
            <h1 className="text-gradient">BuzzBox</h1>
            <span className="tagline">Hyperlocal News</span>
          </div>
        </div>

        <div className="search-container">
          <Search className="search-icon" size={20} />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search communities, posts..."
            className="search-input"
          />
          
          {showSearchResults && searchResults.length > 0 && (
            <div className="search-results">
              {searchResults.map((result, index) => (
                <div
                  key={index}
                  className="search-result-item"
                  onClick={() => {
                    if (result.type === 'post') {
                      window.location.href = `/posts/${result.id}`;
                    }
                  }}
                >
                  <span className="result-type">{result.type}</span>
                  <span className="result-name">
                    {result.name || result.title}
                  </span>
                </div>
              ))}

            </div>
          )}
        </div>

        <div className="header-right">      
          <div className="user-menu-container">
            <div 
              className="user-menu"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <div className="user-avatar">
                {user.avatar || <User size={20} />}
              </div>
              <span className="user-name">{user.name}</span>
              {user.role === 'admin' && (
                <span className="admin-badge">Admin</span>
              )}
            </div>
            
            {showUserMenu && (
              <div className="user-dropdown">
                <div className="user-info">
                  <div className="user-avatar-large">
                    {user.avatar}
                  </div>
                  <div>
                    <div className="user-name-large">{user.name}</div>
                    <div className="user-email">{user.email}</div>
                    <div className="user-role">{user.role}</div>
                  </div>
                </div>
                
                {showAdminToggle && (
                  <button className="dropdown-item admin-toggle" onClick={onToggleAdmin}>
                    <Shield size={16} />
                    Admin Panel
                  </button>
                )}
                
                <button className="dropdown-item logout" onClick={onLogout}>
                  <LogOut size={16} />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="mobile-menu">
          <nav className="mobile-nav">
            <a href="#" className="mobile-nav-item">Home</a>
            <a href="#" className="mobile-nav-item">Communities</a>
            <a href="#" className="mobile-nav-item">Messages</a>
            <a href="#" className="mobile-nav-item">Profile</a>
            {showAdminToggle && (
              <button className="mobile-nav-item admin-item" onClick={onToggleAdmin}>
                <Shield size={16} />
                Admin Panel
              </button>
            )}
            <button className="mobile-nav-item logout-item" onClick={onLogout}>
              <LogOut size={16} />
              Sign Out
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;