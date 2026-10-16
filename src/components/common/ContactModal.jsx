import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { 
  X, 
  Mail, 
  Send, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  MessageSquare,
  HelpCircle,
  GraduationCap,
  Briefcase
} from 'lucide-react';

export default function ContactModal() {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser } = useAuth();
  const { submitSupportInquiry } = useData();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState('finding_expert');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Auto-fill if user is logged in
  useEffect(() => {
    if (currentUser) {
      setName(currentUser.full_name || '');
      setEmail(currentUser.email || '');
    }
  }, [currentUser]);

  // Listen for trigger from Navbar, Footer, or any other button
  useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true);
      setIsSubmitted(false);
    };
    window.addEventListener('open-contact-modal', handleOpen);
    return () => window.removeEventListener('open-contact-modal', handleOpen);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    setIsSubmitting(true);
    try {
      const topicLabels = {
        finding_expert: 'Help Finding an Expert',
        becoming_expert: 'Becoming a Verified Expert',
        existing_request: 'Question about My Request',
        partnership: 'Partnership & Collaboration',
        technical_support: 'Technical Support / Issue',
        other: 'General Inquiry'
      };

      submitSupportInquiry({
        name,
        email,
        subject: topicLabels[topic] || 'General Inquiry',
        message,
      });

      setIsSubmitted(true);
      setMessage('');
    } catch (err) {
      console.error('Error submitting contact form:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      setIsSubmitted(false);
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <div className="contact-modal-backdrop" onClick={handleClose}>
      <div 
        className="contact-modal-card animate-scale-up" 
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-modal-title"
      >
        {/* Header */}
        <div className="contact-modal-header">
          <div className="flex items-center gap-3">
            <div className="contact-icon-pill">
              <Mail size={18} />
            </div>
            <div>
              <span className="contact-badge">We're here to help</span>
              <h3 id="contact-modal-title" className="contact-modal-title">Get in Touch</h3>
            </div>
          </div>
          <button 
            type="button" 
            onClick={handleClose} 
            className="contact-close-btn"
            aria-label="Close modal"
            id="contact-modal-close-btn"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="contact-modal-body">
          {isSubmitted ? (
            <div className="contact-success-state animate-fade-in">
              <div className="contact-success-icon">
                <CheckCircle2 size={42} />
              </div>
              <h4>Message Received!</h4>
              <p>
                Thank you for reaching out, <strong>{name}</strong>. Our team has received your message and will review it promptly.
              </p>
              <div className="contact-success-notice">
                <Clock size={16} />
                <span>We typically respond to <strong>{email}</strong> within 2 to 4 hours.</span>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="btn btn-primary"
                style={{ marginTop: '1.5rem', width: '100%', maxWidth: '240px' }}
                id="contact-modal-done-btn"
              >
                Close Window
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="contact-form">
              <p className="contact-modal-subtext">
                Have a question about finding the right mentor, joining as an expert, or need assistance? Fill out the form below.
              </p>

              {/* Name & Email Row */}
              <div className="contact-form-grid">
                <div className="form-group">
                  <label htmlFor="contact-name" className="contact-label">
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Sipho Ndlovu"
                    className="contact-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="contact-email" className="contact-label">
                    Email Address <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. sipho@example.com"
                    className="contact-input"
                  />
                </div>
              </div>

              {/* Topic Selector */}
              <div className="form-group">
                <label htmlFor="contact-topic" className="contact-label">
                  What is this regarding?
                </label>
                <div className="contact-topic-selector">
                  <button
                    type="button"
                    className={`contact-topic-chip ${topic === 'finding_expert' ? 'active' : ''}`}
                    onClick={() => setTopic('finding_expert')}
                  >
                    <HelpCircle size={14} /> Need Help Finding an Expert
                  </button>
                  <button
                    type="button"
                    className={`contact-topic-chip ${topic === 'becoming_expert' ? 'active' : ''}`}
                    onClick={() => setTopic('becoming_expert')}
                  >
                    <Briefcase size={14} /> Becoming a Verified Expert
                  </button>
                  <button
                    type="button"
                    className={`contact-topic-chip ${topic === 'existing_request' ? 'active' : ''}`}
                    onClick={() => setTopic('existing_request')}
                  >
                    <GraduationCap size={14} /> My Request or Session
                  </button>
                  <button
                    type="button"
                    className={`contact-topic-chip ${topic === 'technical_support' ? 'active' : ''}`}
                    onClick={() => setTopic('technical_support')}
                  >
                    <MessageSquare size={14} /> Technical Support / Issue
                  </button>
                  <button
                    type="button"
                    className={`contact-topic-chip ${topic === 'other' ? 'active' : ''}`}
                    onClick={() => setTopic('other')}
                  >
                    Other Inquiry
                  </button>
                </div>
              </div>

              {/* Message Box */}
              <div className="form-group">
                <label htmlFor="contact-message" className="contact-label">
                  Your Message <span className="text-red-400">*</span>
                </label>
                <textarea
                  id="contact-message"
                  required
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us what you're looking for or how we can help you..."
                  className="contact-textarea"
                />
              </div>

              {/* Trust Indicators */}
              <div className="contact-trust-row">
                <div className="flex items-center gap-1.5 text-xs text-muted">
                  <Clock size={14} style={{ color: 'var(--color-primary-400)' }} />
                  <span>Average response time: <strong>&lt; 4 hours</strong></span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted">
                  <ShieldCheck size={14} style={{ color: '#10b981' }} />
                  <span>Confidential & secure</span>
                </div>
              </div>

              {/* Actions */}
              <div className="contact-modal-actions">
                <button
                  type="button"
                  onClick={handleClose}
                  className="btn btn-secondary"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary"
                  id="contact-form-submit-btn"
                >
                  {isSubmitting ? (
                    <span>Sending message...</span>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <Send size={16} />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
