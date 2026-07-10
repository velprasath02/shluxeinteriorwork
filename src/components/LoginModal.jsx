import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { X, Lock, User, UserCheck, Mail, MessageSquare } from 'lucide-react';

export default function LoginModal() {
  const { isLoginModalOpen, setIsLoginModalOpen, login, register } = useContext(AppContext);
  
  const [activeTab, setActiveTab] = useState('user'); // 'user' or 'admin'
  const [isRegistering, setIsRegistering] = useState(false); // only for 'user' tab
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Reset inputs when modal opens/closes or when tab changes
  useEffect(() => {
    setUsername('');
    setPassword('');
    setEmail('');
    setError('');
    setIsRegistering(false);
    setIsSubmitting(false);
  }, [isLoginModalOpen, activeTab]);

  if (!isLoginModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      setIsSubmitting(true);
      
      if (activeTab === 'admin') {
        if (!username.trim()) {
          setError('Please enter your admin username.');
          setIsSubmitting(false);
          return;
        }
        if (!password) {
          setError('Please enter your password.');
          setIsSubmitting(false);
          return;
        }
        const result = await login(username.trim(), password);
        if (!result.success) {
          setError(result.message || 'Invalid Admin credentials!');
        }
      } else {
        if (isRegistering) {
          if (!username.trim()) {
            setError('Please enter a username.');
            setIsSubmitting(false);
            return;
          }
          if (!email.trim()) {
            setError('Please enter your email address.');
            setIsSubmitting(false);
            return;
          }
          if (!password) {
            setError('Please enter a password.');
            setIsSubmitting(false);
            return;
          }
          const result = await register(username.trim(), password, email.trim());
          if (!result.success) {
            setError(result.error || 'Registration failed. Username or email might be taken.');
          }
        } else {
          if (!email.trim()) {
            setError('Please enter your email address.');
            setIsSubmitting(false);
            return;
          }
          if (!password) {
            setError('Please enter your password.');
            setIsSubmitting(false);
            return;
          }
          const result = await login(email.trim(), password);
          if (!result.success) {
            setError(result.message || 'Invalid email or password.');
          }
        }
      }
    } catch (err) {
      setError('Connection failure. Check if database server is active.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target.className === 'modal-backdrop' && !isSubmitting) {
      setIsLoginModalOpen(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-content login-modal-content">
        <button 
          className="modal-close" 
          onClick={() => setIsLoginModalOpen(false)}
          aria-label="Close modal"
          disabled={isSubmitting}
        >
          <X size={20} />
        </button>

        <h3 className="login-modal-title">Welcome to SELVA HARISH</h3>
        <p className="login-modal-subtitle">
          {activeTab === 'admin' 
            ? 'Administrator authentication portal' 
            : isRegistering 
              ? 'Create a customer account to save your consultations'
              : 'Sign in to access your dashboard and manage furniture collections'
          }
        </p>

        {/* Tab Selectors */}
        <div className="login-tabs">
          <button
            type="button"
            className={`login-tab-btn ${activeTab === 'user' ? 'active' : ''}`}
            onClick={() => setActiveTab('user')}
            disabled={isSubmitting}
          >
            <User size={16} /> Customer Login
          </button>
          <button
            type="button"
            className={`login-tab-btn ${activeTab === 'admin' ? 'active' : ''}`}
            onClick={() => setActiveTab('admin')}
            disabled={isSubmitting}
          >
            <Lock size={16} /> Admin Login
          </button>
        </div>

        {/* Error message */}
        {error && <div className="login-error-alert">{error}</div>}

        {/* Form */}
        <form onSubmit={handleSubmit} className="login-form">
          {/* Admin Tab Username input */}
          {activeTab === 'admin' && (
            <div className="form-group">
              <label htmlFor="login-admin-username">Username</label>
              <div className="input-with-icon">
                <User className="input-icon-left" size={18} />
                <input
                  id="login-admin-username"
                  type="text"
                  className="form-control"
                  placeholder="Enter admin username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  disabled={isSubmitting}
                />
              </div>
            </div>
          )}

          {/* User Tab Registration Username input */}
          {activeTab === 'user' && isRegistering && (
            <div className="form-group">
              <label htmlFor="login-username">Username</label>
              <div className="input-with-icon">
                <User className="input-icon-left" size={18} />
                <input
                  id="login-username"
                  type="text"
                  className="form-control"
                  placeholder="Enter your name"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  disabled={isSubmitting}
                />
              </div>
            </div>
          )}

          {/* User Tab Email input (both login and register) */}
          {activeTab === 'user' && (
            <div className="form-group">
              <label htmlFor="login-email">Email Address</label>
              <div className="input-with-icon">
                <Mail className="input-icon-left" size={18} />
                <input
                  id="login-email"
                  type="email"
                  className="form-control"
                  placeholder="e.g. customer@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  disabled={isSubmitting}
                />
              </div>
            </div>
          )}

          {/* Password input (rendered for all tabs) */}
          <div className="form-group">
            <label htmlFor="login-password">Password</label>
            <div className="input-with-icon">
              <Lock className="input-icon-left" size={18} />
              <input
                id="login-password"
                type="password"
                className="form-control"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                disabled={isSubmitting}
              />
            </div>
          </div>



          <button 
            type="submit" 
            className="btn btn-primary btn-block login-submit-btn"
            disabled={isSubmitting}
          >
            {activeTab === 'admin' ? (
              <Lock size={16} />
            ) : isRegistering ? (
              <MessageSquare size={16} />
            ) : (
              <UserCheck size={16} />
            )}
            <span>
              {isSubmitting 
                ? 'Authenticating...' 
                : activeTab === 'admin' 
                  ? 'Sign In as Admin' 
                  : isRegistering 
                    ? 'Create Account & Sign In' 
                    : 'Sign In as Customer'
              }
            </span>
          </button>

          {/* Toggle between Customer Login / Customer Registration */}
          {activeTab === 'user' && (
            <div className="login-mode-toggle-footer">
              {isRegistering ? (
                <p>
                  Already have an account?{' '}
                  <button 
                    type="button" 
                    className="toggle-mode-btn"
                    onClick={() => { setIsRegistering(false); setError(''); }}
                    disabled={isSubmitting}
                  >
                    Log In
                  </button>
                </p>
              ) : (
                <p>
                  Don't have an account?{' '}
                  <button 
                    type="button" 
                    className="toggle-mode-btn"
                    onClick={() => { setIsRegistering(true); setError(''); }}
                    disabled={isSubmitting}
                  >
                    Sign Up
                  </button>
                </p>
              )}
            </div>
          )}
        </form>
      </div>

      <style>{`
        .login-modal-content {
          max-width: 440px;
          text-align: center;
        }

        .login-modal-title {
          font-family: var(--font-serif);
          font-size: 1.6rem;
          color: var(--primary-hover);
          margin-bottom: 6px;
        }

        .login-modal-subtitle {
          font-size: 0.85rem;
          color: var(--text-muted);
          margin-bottom: 24px;
        }

        .login-tabs {
          display: flex;
          border-bottom: 2px solid var(--border-light);
          margin-bottom: 24px;
          gap: 12px;
        }

        .login-tab-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px 6px;
          font-weight: 600;
          font-size: 0.9rem;
          color: var(--text-muted);
          border-bottom: 3px solid transparent;
          border-radius: 0;
          margin-bottom: -2px;
          transition: all var(--transition-fast);
        }
        .login-tab-btn:hover {
          color: var(--primary);
        }
        .login-tab-btn.active {
          color: var(--primary);
          border-bottom-color: var(--primary);
        }

        .input-with-icon {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon-left {
          position: absolute;
          left: 14px;
          color: var(--text-muted);
          pointer-events: none;
        }

        .input-with-icon .form-control {
          padding-left: 42px;
        }

        .login-error-alert {
          background-color: #fef2f2;
          border: 1px solid #fca5a5;
          color: #b91c1c;
          padding: 10px 16px;
          border-radius: var(--radius-md);
          font-size: 0.88rem;
          font-weight: 500;
          margin-bottom: 20px;
          text-align: left;
          animation: slideUp var(--transition-fast) forwards;
        }

        .admin-hint-text {
          font-size: 0.8rem;
          color: var(--text-muted);
          background-color: var(--bg-input);
          padding: 10px;
          border-radius: var(--radius-md);
          border: 1px dashed var(--border);
          margin-bottom: 20px;
          text-align: left;
        }

        .login-submit-btn {
          width: 100%;
          padding: 12px;
          font-weight: 600;
          margin-top: 10px;
        }
        .login-submit-btn:disabled {
          background-color: var(--text-muted);
          cursor: not-allowed;
        }

        .btn-block {
          width: 100%;
        }

        .login-mode-toggle-footer {
          margin-top: 20px;
          font-size: 0.88rem;
          color: var(--text-muted);
        }

        .toggle-mode-btn {
          font-weight: 600;
          color: var(--primary);
          text-decoration: underline;
        }
        .toggle-mode-btn:hover {
          color: var(--primary-hover);
        }
      `}</style>
    </div>
  );
}
