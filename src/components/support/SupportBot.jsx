import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { 
  HelpCircle, 
  X, 
  MessageSquare, 
  Send, 
  CheckCircle, 
  ArrowRight, 
  Bot, 
  Info,
  ChevronLeft
} from 'lucide-react';

const FAQ_ITEMS = [
  {
    id: 'submit-request',
    question: 'How do I submit a request?',
    answer: 'Select "Get Help", choose the area where you need assistance, select a topic, explain your question in a few sentences, and submit your request. You can then track its status under "My Requests".',
    link: '/get-help',
    linkLabel: 'Go to Get Help',
  },
  {
    id: 'find-expert',
    question: 'How do I find an expert?',
    answer: 'You do not have to search through directories! Our system automatically routes your request only to approved, available experts matching your specific category and topic. As soon as an expert accepts, you will be notified.',
  },
  {
    id: 'become-expert',
    question: 'How do I become an expert?',
    answer: 'Click "Become an Expert" in the top menu. Enter your background, select the categories and topics you can mentor in, and submit your application. An administrator will review your credentials before activating your account.',
    link: '/expert/register',
    linkLabel: 'Apply as an Expert',
  },
  {
    id: 'see-requests',
    question: 'Where can I see my requests?',
    answer: 'All requests you submit are tracked securely under "My Requests". You can view assigned mentors, statuses, chat messages, and schedule meetings.',
    link: '/my-requests',
    linkLabel: 'View My Requests',
  },
  {
    id: 'chat-expert',
    question: 'How do I chat with an expert?',
    answer: 'Once an eligible expert accepts your request, a private conversation is unlocked in your request details. Simply open the request in "My Requests" and click "Chat with Expert".',
    link: '/my-requests',
    linkLabel: 'Open My Requests',
  },
  {
    id: 'request-meeting',
    question: 'How do I request a meeting?',
    answer: 'After an expert accepts your request, open your request and click "Request a Meeting". Choose your preferred date, time, and session format (video call or chat). The expert can then confirm or suggest another time.',
  },
  {
    id: 'technical-problem',
    question: 'I am having a technical problem.',
    answer: 'If you encounter any page errors, button issues, or submission delays, please submit a ticket directly to our support engineers using the form below.',
    action: 'contact_form',
  },
  {
    id: 'contact-team',
    question: 'Contact the support team.',
    answer: 'You can submit a ticket to our support team below. We review inquiries in the administrator queue.',
    action: 'contact_form',
  },
];

export default function SupportBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);
  const [showContactForm, setShowContactForm] = useState(false);
  const { currentUser } = useAuth();
  const { submitSupportInquiry } = useData();

  // Contact form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Auto-fill from current user if present
  useEffect(() => {
    if (currentUser) {
      setName(currentUser.full_name || '');
      setEmail(currentUser.email || '');
    }
  }, [currentUser]);

  // Listen for custom trigger from footer or navbar
  useEffect(() => {
    const handleOpen = (e) => {
      setIsOpen(true);
      if (e?.detail?.showContactForm) {
        setShowContactForm(true);
        setActiveFaq(null);
      }
    };
    window.addEventListener('open-support-bot', handleOpen);
    return () => window.removeEventListener('open-support-bot', handleOpen);
  }, []);

  const handleFaqClick = (item) => {
    if (item.action === 'contact_form') {
      setShowContactForm(true);
      setActiveFaq(null);
    } else {
      setActiveFaq(item);
      setShowContactForm(false);
    }
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    setIsSubmitting(true);
    try {
      submitSupportInquiry({
        name,
        email,
        subject: 'In-App Support Ticket',
        message,
      });
      setIsSubmitted(true);
      setMessage('');
    } catch (err) {
      console.error('Failed to submit support inquiry:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="support-bot-fab"
        aria-label="Need Help Support Bot"
        id="floating-support-bot-btn"
      >
        <Bot size={20} />
        <span>Need Help?</span>
      </button>

      {/* Support Window */}
      {isOpen && (
        <div className="support-bot-window" id="support-bot-panel">
          {/* Header */}
          <div className="support-bot-header">
            <div className="flex items-center gap-2">
              <div 
                style={{
                  width: '1.75rem', 
                  height: '1.75rem', 
                  borderRadius: '50%', 
                  background: 'var(--color-primary-600)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Bot size={15} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff' }}>The Problem Solvers Support</h4>
                <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Automated Guidance & Helpdesk</span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              style={{ color: '#94a3b8', padding: '0.2rem' }}
              aria-label="Close support bot"
              id="support-bot-close-btn"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="support-bot-body">
            {/* Guidance disclaimer */}
            <div 
              style={{
                background: 'rgba(37, 99, 235, 0.12)',
                border: '1px solid rgba(37, 99, 235, 0.25)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.65rem 0.85rem',
                fontSize: '0.78rem',
                color: '#93c5fd',
                display: 'flex',
                gap: '0.5rem',
                alignItems: 'flex-start',
              }}
            >
              <Info size={16} style={{ flexShrink: 0, marginTop: '2px', color: '#60a5fa' }} />
              <span>
                Need help? Select an automated topic below or reach out to our team directly.
              </span>
            </div>

            {/* Back Button if in detail view */}
            {(activeFaq || showContactForm) && (
              <button
                onClick={() => {
                  setActiveFaq(null);
                  setShowContactForm(false);
                  setIsSubmitted(false);
                }}
                className="btn btn-secondary btn-sm"
                style={{ alignSelf: 'flex-start', padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}
                id="support-bot-back-btn"
              >
                <ChevronLeft size={14} /> Back to questions
              </button>
            )}

            {/* View 1: Question List */}
            {!activeFaq && !showContactForm && (
              <div className="flex flex-col gap-2" style={{ marginTop: '0.25rem' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Frequently Asked Questions
                </span>
                {FAQ_ITEMS.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleFaqClick(item)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '10px',
                      padding: '0.7rem 0.85rem',
                      textAlign: 'left',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.15s ease',
                      cursor: 'pointer',
                    }}
                    id={`faq-item-${item.id}`}
                  >
                    <span>{item.question}</span>
                    <ArrowRight size={14} style={{ color: 'var(--color-primary-400)' }} />
                  </button>
                ))}

                <div style={{ marginTop: '0.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '0.85rem', textAlign: 'center' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      window.dispatchEvent(new CustomEvent('open-contact-modal'));
                    }}
                    className="btn btn-primary btn-sm"
                    style={{ width: '100%' }}
                  >
                    <Mail size={14} /> Open Full Contact Form
                  </button>
                </div>
              </div>
            )}

            {/* View 2: Active FAQ Answer */}
            {activeFaq && (
              <div className="flex flex-col gap-3 animate-fade-in">
                <h5 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#ffffff' }}>{activeFaq.question}</h5>
                <p style={{ fontSize: '0.88rem', lineHeight: '1.6', color: '#cbd5e1' }}>
                  {activeFaq.answer}
                </p>

                {activeFaq.link && (
                  <Link
                    to={activeFaq.link}
                    onClick={() => setIsOpen(false)}
                    className="btn btn-primary btn-sm"
                    style={{ alignSelf: 'flex-start', marginTop: '0.5rem' }}
                  >
                    {activeFaq.linkLabel} <ArrowRight size={14} />
                  </Link>
                )}

                <div style={{ marginTop: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '0.75rem' }}>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      window.dispatchEvent(new CustomEvent('open-contact-modal'));
                    }}
                    style={{ fontSize: '0.82rem', color: 'var(--color-primary-400)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                  >
                    Still need help? Open full contact form →
                  </button>
                </div>
              </div>
            )}

            {/* View 3: Contact Support Form */}
            {showContactForm && (
              <div className="flex flex-col gap-2 animate-fade-in">
                <h5 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff' }}>Contact The Support Team</h5>
                <p style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
                  Submit your inquiry and our administrators will review it promptly.
                </p>

                {isSubmitted ? (
                  <div 
                    style={{
                      background: 'rgba(16, 185, 129, 0.12)',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      borderRadius: 'var(--radius-md)',
                      padding: '1.25rem',
                      textAlign: 'center',
                      color: '#34d399',
                      marginTop: '1rem',
                    }}
                  >
                    <CheckCircle size={32} style={{ margin: '0 auto 0.5rem', color: '#10b981' }} />
                    <h6 style={{ fontWeight: 700, fontSize: '0.95rem', color: '#ffffff' }}>Inquiry Submitted</h6>
                    <p style={{ fontSize: '0.8rem', color: '#a7f3d0', marginTop: '0.25rem' }}>
                      Thank you. Your message has been saved to the support queue for review.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} style={{ marginTop: '0.5rem' }}>
                    <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                      <label className="form-label" style={{ fontSize: '0.8rem', color: '#e2e8f0' }}>Full Name</label>
                      <input
                        type="text"
                        required
                        className="form-input"
                        style={{ 
                          padding: '0.6rem 0.85rem', 
                          fontSize: '0.85rem', 
                          background: 'rgba(255, 255, 255, 0.05)', 
                          border: '1px solid rgba(255, 255, 255, 0.14)', 
                          color: '#ffffff',
                          borderRadius: '8px'
                        }}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your full name"
                        id="support-form-name"
                      />
                    </div>

                    <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                      <label className="form-label" style={{ fontSize: '0.8rem', color: '#e2e8f0' }}>Email Address</label>
                      <input
                        type="email"
                        required
                        className="form-input"
                        style={{ 
                          padding: '0.6rem 0.85rem', 
                          fontSize: '0.85rem', 
                          background: 'rgba(255, 255, 255, 0.05)', 
                          border: '1px solid rgba(255, 255, 255, 0.14)', 
                          color: '#ffffff',
                          borderRadius: '8px'
                        }}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your.email@example.com"
                        id="support-form-email"
                      />
                    </div>

                    <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                      <label className="form-label" style={{ fontSize: '0.8rem', color: '#e2e8f0' }}>How can we help?</label>
                      <textarea
                        required
                        rows={3}
                        className="form-textarea"
                        style={{ 
                          padding: '0.6rem 0.85rem', 
                          fontSize: '0.85rem', 
                          minHeight: '80px',
                          background: 'rgba(255, 255, 255, 0.05)', 
                          border: '1px solid rgba(255, 255, 255, 0.14)', 
                          color: '#ffffff',
                          borderRadius: '8px'
                        }}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Please describe your question or issue..."
                        id="support-form-message"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn btn-primary btn-sm"
                      style={{ width: '100%', marginTop: '0.5rem' }}
                      id="support-form-submit-btn"
                    >
                      <Send size={14} />
                      {isSubmitting ? 'Sending...' : 'Submit Inquiry'}
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
