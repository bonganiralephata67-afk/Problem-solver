import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Shield, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="flex items-center gap-2" style={{ marginBottom: '1rem' }}>
              <div className="brand-icon" style={{ width: '2rem', height: '2rem' }}>
                <Compass size={18} />
              </div>
              <span style={{ color: '#ffffff', fontWeight: 800, fontSize: '1.2rem', fontFamily: 'var(--font-heading)' }}>
                The Problem Solvers
              </span>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.6', maxWidth: '320px' }}>
              Connecting people who need help with suitable, verified experts, mentors, tutors, and professionals.
            </p>
          </div>

          <div>
            <h4 className="footer-title">Platform</h4>
            <ul className="footer-links">
              <li><Link to="/get-help" id="footer-link-get-help">Get Help</Link></li>
              <li><a href="/#how-it-works" id="footer-link-how-it-works">How It Works</a></li>
              <li><Link to="/expert/register" id="footer-link-become-expert">Become an Expert</Link></li>
              <li><Link to="/my-requests" id="footer-link-my-requests">My Requests</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-title">Support</h4>
            <ul className="footer-links">
              <li><a href="#support" onClick={(e) => { e.preventDefault(); window.dispatchEvent(new CustomEvent('open-support-bot')); }}>Contact Support</a></li>
              <li><Link to="/auth">Sign In</Link></li>
              <li><Link to="/admin">Admin Portal</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-title">Legal & Trust</h4>
            <ul className="footer-links">
              <li><span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Privacy Policy</span></li>
              <li><span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Terms of Service</span></li>
              <li><span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Safety & Guidelines</span></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} The Problem Solvers. All rights reserved.</p>
          <div className="flex items-center gap-2" style={{ color: '#64748b' }}>
            <Shield size={14} />
            <span>Built with integrity & category-based routing.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
