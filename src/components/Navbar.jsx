import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { Search, ShoppingCart, User, LogOut, ChevronDown, Lock } from 'lucide-react';

export default function Navbar() {
  const {
    user,
    logout,
    searchQuery,
    setSearchQuery,
    setIsLoginModalOpen,
    cartItemCount,
    setIsCartOpen,
    setActiveCategory,
    setSelectedProduct
  } = useContext(AppContext);

  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setSelectedProduct(null);
  };

  const handleLogoClick = () => {
    setActiveCategory('Home');
    setSearchQuery('');
    setSelectedProduct(null);
  };

  return (
    <nav className="navbar-section">
      <div className="container navbar-container">
        {/* Site Logo */}
        <div className="navbar-logo" onClick={handleLogoClick}>
          SH  <span>LUXE INTERIOR</span>
        </div>

        {/* Central Searchbar */}
        <div className="navbar-search-container">
          <div className="search-bar-wrapper">
            <Search className="search-icon" size={18} />
            <input
              type="text"
              className="search-input"
              placeholder="Search modular kitchen, doors, wardrobes..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
            {searchQuery && (
              <button className="clear-search" onClick={() => setSearchQuery('')}>
                &times;
              </button>
            )}
          </div>
        </div>

        {/* Right Corner Buttons (Cart, Profile, Login) */}
        <div className="navbar-actions">
          {/* Cart Icon Button */}
          <button
            className="navbar-action-btn cart-btn"
            onClick={() => setIsCartOpen(true)}
            aria-label="Open Cart"
          >
            <ShoppingCart size={22} />
            {cartItemCount > 0 && <span className="badge">{cartItemCount}</span>}
          </button>

          {/* User/Admin Login Dropdown */}
          <div className="profile-dropdown-wrapper">
            {user ? (
              <div className="logged-in-profile">
                <button
                  className="btn btn-secondary profile-btn"
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                >
                  <User size={16} />
                  <span className="profile-name">
                    {user.role === 'admin' ? 'Admin' : user.username}
                  </span>
                  <ChevronDown size={14} />
                </button>

                {isProfileDropdownOpen && (
                  <div className="dropdown-menu">
                    <div className="dropdown-header">
                      <p className="user-email">{user.username}</p>
                      <p className="user-role-badge">
                        {user.role === 'admin' ? 'Administrator' : 'Customer'}
                      </p>
                    </div>
                    {user.role === 'admin' && (
                      <div className="admin-status-indicator">
                        <Lock size={12} /> Admin Mode Enabled
                      </div>
                    )}
                    <button
                      className="dropdown-item logout-btn"
                      onClick={() => {
                        logout();
                        setIsProfileDropdownOpen(false);
                      }}
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="logged-out-profile">
                <button
                  className="btn btn-primary login-trigger-btn"
                  onClick={() => setIsLoginModalOpen(true)}
                >
                  <User size={16} />
                  <span>Login</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Inline styles for Navbar component to maintain encapsulation under vanilla CSS */}
      <style>{`
        .navbar-section {
          background-color: var(--bg-card);
          border-bottom: 1px solid var(--border);
          position: sticky;
          top: 0;
          z-index: 100;
          padding: 14px 0;
          box-shadow: var(--shadow-sm);
        }

        .navbar-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }

        .navbar-logo {
          font-family: var(--font-serif);
          font-size: 1.8rem;
          font-weight: 800;
          color: var(--primary-hover);
          cursor: pointer;
          user-select: none;
          letter-spacing: 0.5px;
          flex-shrink: 0;
          transition: transform var(--transition-fast);
        }
        .navbar-logo:hover {
          transform: scale(1.02);
        }
        .navbar-logo span {
          color: var(--secondary);
          font-weight: 400;
        }

        .navbar-search-container {
          flex-grow: 1;
          max-width: 500px;
          margin: 0 auto;
        }

        .search-bar-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .search-icon {
          position: absolute;
          left: 14px;
          color: var(--text-muted);
          pointer-events: none;
        }

        .search-input {
          width: 100%;
          padding: 10px 40px 10px 42px;
          border-radius: var(--radius-full);
          border: 1px solid var(--border);
          background-color: var(--bg-input);
          color: var(--text-main);
          outline: none;
          font-size: 0.95rem;
          transition: all var(--transition-fast);
        }
        .search-input:focus {
          border-color: var(--primary);
          background-color: var(--bg-card);
          box-shadow: 0 0 0 3px rgba(180, 83, 9, 0.1);
        }

        .clear-search {
          position: absolute;
          right: 14px;
          font-size: 1.2rem;
          color: var(--text-muted);
        }
        .clear-search:hover {
          color: var(--primary);
        }

        .navbar-actions {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-shrink: 0;
        }

        .navbar-action-btn {
          position: relative;
          color: var(--text-main);
          padding: 10px;
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
        }
        .navbar-action-btn:hover {
          background-color: var(--primary-light);
          color: var(--primary-hover);
        }

        .profile-dropdown-wrapper {
          position: relative;
        }

        .profile-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          font-size: 0.9rem;
        }

        .profile-name {
          max-width: 100px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .login-trigger-btn {
          padding: 8px 20px;
          border-radius: var(--radius-full);
          font-size: 0.9rem;
        }

        .dropdown-menu {
          position: absolute;
          right: 0;
          top: calc(100% + 8px);
          background-color: var(--bg-card);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-lg);
          border: 1px solid var(--border);
          width: 220px;
          padding: 8px;
          display: flex;
          flex-direction: column;
          z-index: 110;
          animation: slideUp var(--transition-fast) forwards;
        }

        .dropdown-header {
          padding: 12px 16px;
          border-bottom: 1px solid var(--border-light);
          text-align: left;
        }

        .user-email {
          font-weight: 600;
          font-size: 0.95rem;
          color: var(--text-main);
          word-break: break-all;
        }

        .user-role-badge {
          font-size: 0.75rem;
          color: var(--primary);
          background-color: var(--primary-light);
          padding: 2px 6px;
          border-radius: var(--radius-sm);
          display: inline-block;
          margin-top: 4px;
          font-weight: 600;
        }

        .admin-status-indicator {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          font-size: 0.75rem;
          color: #16a34a;
          font-weight: 500;
          background-color: #f0fdf4;
          margin: 6px 0;
          border-radius: var(--radius-sm);
        }

        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          padding: 10px 16px;
          font-size: 0.9rem;
          color: var(--text-main);
          text-align: left;
          border-radius: var(--radius-sm);
          transition: background-color var(--transition-fast);
        }
        .dropdown-item:hover {
          background-color: var(--bg-input);
          color: var(--primary);
        }

        .logout-btn {
          color: #dc2626;
          border-top: 1px solid var(--border-light);
          margin-top: 4px;
          border-radius: var(--radius-sm);
        }
        .logout-btn:hover {
          background-color: #fef2f2;
          color: #b91c1c;
        }

        @media (max-width: 768px) {
          .navbar-logo {
            font-size: 1.4rem;
          }
          .profile-name {
            display: none;
          }
          .navbar-search-container {
            order: 3;
            max-width: 100%;
            width: 100%;
            margin-top: 8px;
          }
          .navbar-container {
            flex-wrap: wrap;
          }
        }
      `}</style>
    </nav>
  );
}
