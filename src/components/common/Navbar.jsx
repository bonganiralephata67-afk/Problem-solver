import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Compass, 
  Menu, 
  X, 
  LogOut, 
  User
} from 'lucide-react';

export default function Navbar() {
  const { currentUser, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolledDown, setIsScrolledDown] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      // Past the hero CTA buttons (~260px)
      if (window.scrollY > 250) {
        setIsScrolledDown(true);
      } else {
        setIsScrolledDown(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleContactUs = () => {
    window.dispatchEvent(new CustomEvent('open-contact-modal'));
  };

  const handleHowItWorksClick = (e) => {
    if (location.pathname === '/') {
      e.preventDefault();
      const el = document.getElementById('how-it-works');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/#how-it-works');
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="site-header">
      <div className="container nav-container">
        {/* Logo */}
        <Link to="/" className="brand-logo" id="nav-brand-logo">
          <div className="brand-icon">
            <Compass size={22} />
          </div>
          <span>The Problem Solvers</span>
        </Link>

        {/* Center Links: Just Home and How It Works */}
        <nav className="nav-links">
          <Link 
            to="/" 
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} 
            id="nav-link-home"
          >
            Home
          </Link>

          <a 
            href="#how-it-works" 
            onClick={handleHowItWorksClick} 
            className="nav-link" 
            id="nav-link-how-it-works"
          >
            How It Works
          </a>

          {/* Only show contextual link if explicitly logged in */}
          {currentUser?.role === 'seeker' && (
            <Link 
              to="/my-requests" 
              className={`nav-link ${location.pathname === '/my-requests' ? 'active' : ''}`} 
              id="nav-link-my-requests"
            >
              My Requests
            </Link>
          )}

          {currentUser?.role === 'expert' && (
            <Link 
              to="/expert/dashboard" 
              className={`nav-link ${location.pathname === '/expert/dashboard' ? 'active' : ''}`} 
              id="nav-link-expert-dashboard"
            >
              Expert Dashboard
            </Link>
          )}

          {currentUser?.role === 'admin' && (
            <Link 
              to="/admin" 
              className={`nav-link ${location.pathname === '/admin' ? 'active' : ''}`} 
              id="nav-link-admin"
            >
              Admin Portal
            </Link>
          )}
        </nav>

        {/* Right Actions */}
        <div className="nav-actions">
          {currentUser ? (
            <div className="flex items-center gap-3">
              {isScrolledDown && location.pathname === '/' && (
                <Link 
                  to="/get-help" 
                  className="btn btn-primary btn-sm animate-fade-in" 
                  id="nav-scrolled-get-help-btn"
                  style={{ padding: '0.4rem 0.85rem', fontSize: '0.84rem' }}
                >
                  Get Help
                </Link>
              )}
              <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--color-text-main)' }}>
                {currentUser.full_name}
              </span>
              <button
                onClick={() => signOut()}
                className="btn btn-secondary btn-sm"
                title="Sign Out"
                id="nav-sign-out-btn"
                style={{ padding: '0.4rem 0.65rem' }}
              >
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <>
              {/* Dynamic scroll behavior on landing page */}
              {location.pathname === '/' && isScrolledDown ? (
                <div className="flex items-center gap-2 animate-fade-in" id="nav-scrolled-actions">
                  <Link 
                    to="/get-help" 
                    className="btn btn-primary btn-sm" 
                    id="nav-scrolled-get-help-btn"
                    style={{ padding: '0.42rem 0.95rem', fontSize: '0.85rem' }}
                  >
                    Get Help
                  </Link>
                  <Link 
                    to="/expert/register" 
                    className="btn btn-secondary btn-sm" 
                    id="nav-scrolled-become-expert-btn"
                    style={{ padding: '0.42rem 0.95rem', fontSize: '0.85rem' }}
                  >
                    Become an Expert
                  </Link>
                </div>
              ) : (
                <button 
                  type="button"
                  onClick={handleContactUs} 
                  className="btn btn-secondary btn-sm animate-fade-in" 
                  id="nav-contact-us-btn"
                  style={{ padding: '0.45rem 1rem', fontSize: '0.88rem', fontWeight: 600 }}
                >
                  Contact Us
                </button>
              )}
            </>
          )}

          {/* Mobile menu toggle */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
            id="mobile-menu-toggle-btn"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div 
          style={{
            background: 'var(--color-bg-surface)',
            borderBottom: '1px solid var(--color-border)',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
          className="animate-fade-in"
        >
          <Link to="/" onClick={() => setMobileMenuOpen(false)} className="nav-link">Home</Link>
          <a href="#how-it-works" onClick={handleHowItWorksClick} className="nav-link">How It Works</a>
          
          {currentUser ? (
            <>
              {currentUser.role === 'seeker' && (
                <Link to="/my-requests" onClick={() => setMobileMenuOpen(false)} className="nav-link">My Requests</Link>
              )}
              {currentUser.role === 'expert' && (
                <Link to="/expert/dashboard" onClick={() => setMobileMenuOpen(false)} className="nav-link">Expert Dashboard</Link>
              )}
              {currentUser.role === 'admin' && (
                <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="nav-link">Admin Portal</Link>
              )}
              <button onClick={() => { signOut(); setMobileMenuOpen(false); }} className="btn btn-secondary btn-sm" style={{ width: 'fit-content' }}>
                Sign Out ({currentUser.full_name})
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-2 pt-2" style={{ borderTop: '1px solid var(--color-border)' }}>
              <Link to="/get-help" onClick={() => setMobileMenuOpen(false)} className="btn btn-primary btn-sm" style={{ textAlign: 'center' }}>
                Get Help
              </Link>
              <Link to="/expert/register" onClick={() => setMobileMenuOpen(false)} className="btn btn-secondary btn-sm" style={{ textAlign: 'center' }}>
                Become an Expert
              </Link>
              <button 
                type="button"
                onClick={() => { handleContactUs(); setMobileMenuOpen(false); }} 
                className="btn btn-secondary btn-sm" 
                style={{ textAlign: 'center' }}
                id="mobile-contact-us-btn"
              >
                Contact Us
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
