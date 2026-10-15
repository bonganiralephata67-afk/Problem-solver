import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Compass, 
  Menu, 
  X, 
  HelpCircle, 
  UserCheck, 
  LogOut, 
  LayoutDashboard, 
  ShieldCheck, 
  FileText 
} from 'lucide-react';

export default function Navbar() {
  const { currentUser, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

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

        {/* Desktop Navigation Links */}
        <nav className="nav-links">
          <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} id="nav-link-home">
            Home
          </Link>
          <a href="#how-it-works" onClick={handleHowItWorksClick} className="nav-link" id="nav-link-how-it-works">
            How It Works
          </a>
          <Link 
            to="/expert/register" 
            className={`nav-link ${location.pathname === '/expert/register' ? 'active' : ''}`}
            id="nav-link-become-expert"
          >
            Become an Expert
          </Link>

          {/* Role specific links */}
          {currentUser?.role === 'seeker' && (
            <Link to="/my-requests" className={`nav-link ${location.pathname === '/my-requests' ? 'active' : ''}`} id="nav-link-my-requests">
              My Requests
            </Link>
          )}

          {currentUser?.role === 'expert' && (
            <Link to="/expert/dashboard" className={`nav-link ${location.pathname === '/expert/dashboard' ? 'active' : ''}`} id="nav-link-expert-dashboard">
              Expert Dashboard
            </Link>
          )}

          {currentUser?.role === 'admin' && (
            <Link to="/admin" className={`nav-link ${location.pathname === '/admin' ? 'active' : ''}`} id="nav-link-admin">
              Admin Portal
            </Link>
          )}
        </nav>

        {/* Actions */}
        <div className="nav-actions">
          {currentUser ? (
            <div className="flex items-center gap-3">
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>
                {currentUser.full_name}
              </span>
              <button
                onClick={() => signOut()}
                className="btn btn-secondary btn-sm"
                title="Sign Out"
                id="nav-sign-out-btn"
              >
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <Link to="/auth" className="btn btn-secondary btn-sm" id="nav-sign-in-btn">
              Sign In
            </Link>
          )}

          {/* Prominent Get Help CTA button */}
          <Link to="/get-help" className="btn btn-primary" id="nav-get-help-btn">
            Get Help
          </Link>

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
            background: '#ffffff',
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
          <Link to="/expert/register" onClick={() => setMobileMenuOpen(false)} className="nav-link">Become an Expert</Link>
          <Link to="/my-requests" onClick={() => setMobileMenuOpen(false)} className="nav-link">My Requests</Link>
          {currentUser?.role === 'expert' && (
            <Link to="/expert/dashboard" onClick={() => setMobileMenuOpen(false)} className="nav-link">Expert Dashboard</Link>
          )}
          {currentUser?.role === 'admin' && (
            <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="nav-link">Admin Portal</Link>
          )}
          <Link to="/get-help" onClick={() => setMobileMenuOpen(false)} className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
            Get Help
          </Link>
        </div>
      )}
    </header>
  );
}
