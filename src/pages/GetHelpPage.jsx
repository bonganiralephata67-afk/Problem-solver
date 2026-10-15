import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { EDUCATION_LEVELS } from '../data/initialData';
import { 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  GraduationCap, 
  Briefcase, 
  TrendingUp, 
  FileText, 
  Palette, 
  Code, 
  Compass, 
  HelpCircle,
  MessageSquare,
  Video,
  PhoneCall,
  ShieldCheck
} from 'lucide-react';

const ICON_MAP = {
  GraduationCap,
  Briefcase,
  TrendingUp,
  FileText,
  Palette,
  Code,
  Compass,
  HelpCircle,
};

export default function GetHelpPage() {
  const { categories, topics, submitHelpRequest } = useData();
  const { currentUser, signIn } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Form Fields
  const [name, setName] = useState(currentUser?.full_name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [categoryId, setCategoryId] = useState('');
  const [topicId, setTopicId] = useState('');
  const [educationLevel, setEducationLevel] = useState('');
  const [inquiry, setInquiry] = useState('');
  const [preferredSessionType, setPreferredSessionType] = useState('chat');
  const [customCategoryText, setCustomCategoryText] = useState('');

  // UI state
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pre-fill from query param
  useEffect(() => {
    const preCategory = searchParams.get('category');
    if (preCategory && categories.some(c => c.id === preCategory)) {
      setCategoryId(preCategory);
    }
  }, [searchParams, categories]);

  // Update name/email if currentUser exists
  useEffect(() => {
    if (currentUser) {
      if (!name) setName(currentUser.full_name || '');
      if (!email) setEmail(currentUser.email || '');
    }
  }, [currentUser]);

  const selectedCategory = categories.find(c => c.id === categoryId);
  const relevantTopics = topics.filter(t => t.category_id === categoryId);
  const selectedTopic = topics.find(t => t.id === topicId);

  // Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    // Validation
    if (!name.trim()) {
      setErrorMsg('Please enter your name.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    if (!categoryId) {
      setErrorMsg('Please select an area where you need help.');
      return;
    }

    if (selectedCategory?.slug !== 'other' && !topicId) {
      setErrorMsg('Please select a specific topic from the list.');
      return;
    }

    if (selectedCategory?.has_education_level && !educationLevel) {
      setErrorMsg('Please select your current education level.');
      return;
    }

    if (!inquiry.trim() || inquiry.trim().length < 8) {
      setErrorMsg('Please explain your question in a few words or sentences.');
      return;
    }

    setIsSubmitting(true);

    try {
      const finalInquiry = selectedCategory?.slug === 'other' && customCategoryText
        ? `[Custom: ${customCategoryText}] ${inquiry.trim()}`
        : inquiry.trim();

      // If user is not yet logged in, register them as the seeker with their entered name/email
      let activeUserId = currentUser?.id;
      if (!currentUser) {
        const authRes = await signUp(email.trim(), 'temporary-guest-password', name.trim(), 'seeker');
        activeUserId = authRes?.user?.id;
      }

      const newRequest = await submitHelpRequest({
        seeker_id: activeUserId || null,
        seeker_name: name.trim(),
        seeker_email: email.trim(),
        category_id: categoryId,
        topic_id: topicId || relevantTopics[0]?.id || '22222222-0008-0000-0000-000000000001',
        education_level: selectedCategory?.has_education_level ? educationLevel : null,
        inquiry: finalInquiry,
        preferred_session_type: preferredSessionType,
      });

      navigate(`/request-submitted/${newRequest.id}`);
    } catch (err) {
      console.error('Submission failed:', err);
      setErrorMsg('An error occurred while submitting your request. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ background: 'var(--color-bg-base)', minHeight: 'calc(100vh - 4.5rem)', padding: '4rem 1.5rem 6rem' }}>
      <div className="container" style={{ maxWidth: '820px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.75rem', color: 'var(--color-text-main)' }}>
            Request Help
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem', maxWidth: '580px', margin: '0 auto', lineHeight: '1.6' }}>
            Select the area where you need assistance, pick your topic, and tell us your question.
          </p>
        </div>

        {/* Global Error Banner */}
        {errorMsg && (
          <div 
            style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#dc2626',
              padding: '1rem 1.5rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              marginBottom: '2rem',
            }}
            id="get-help-error-alert"
          >
            <AlertCircle size={20} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="streamlined-form-card" id="get-help-unified-form">
          {/* SECTION 1: AREA & TOPIC */}
          <div style={{ marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--color-text-main)' }}>
              1. Which area do you need help with?
            </h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Select a category to view matching topics:
            </p>

            {/* Category selection cards with generous spacing */}
            <div className="category-pill-grid">
              {categories.filter(c => c.is_active).map((cat) => {
                const Icon = ICON_MAP[cat.icon] || HelpCircle;
                const isSelected = categoryId === cat.id;

                return (
                  <div
                    key={cat.id}
                    className={`category-pill-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => {
                      setCategoryId(cat.id);
                      setTopicId('');
                      setErrorMsg('');
                    }}
                    id={`cat-card-${cat.slug}`}
                  >
                    <div style={{ color: isSelected ? 'var(--color-primary-400)' : 'var(--color-text-main)' }}>
                      <Icon size={22} />
                    </div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, lineHeight: '1.3' }}>
                      {cat.name}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Subcategory Topic Chips */}
            {categoryId && relevantTopics.length > 0 && selectedCategory?.slug !== 'other' && (
              <div 
                style={{
                  background: 'var(--color-bg-subtle)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.5rem',
                  marginTop: '1.5rem',
                }}
                className="animate-fade-in"
              >
                <label className="form-label" style={{ marginBottom: '0.75rem', display: 'block' }}>
                  Select specific topic in {selectedCategory.name}:
                </label>
                <div className="topic-chips-container">
                  {relevantTopics.map((top) => {
                    const isTopicSelected = topicId === top.id;
                    return (
                      <button
                        key={top.id}
                        type="button"
                        onClick={() => {
                          setTopicId(top.id);
                          setErrorMsg('');
                        }}
                        className={`topic-chip ${isTopicSelected ? 'selected' : ''}`}
                        id={`topic-chip-${top.slug}`}
                      >
                        {top.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* If Other Category */}
            {selectedCategory?.slug === 'other' && (
              <div className="form-group" style={{ marginTop: '1.5rem' }}>
                <label className="form-label">What kind of assistance do you need?</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Legal compliance or custom consultation"
                  value={customCategoryText}
                  onChange={(e) => setCustomCategoryText(e.target.value)}
                  id="custom-category-input"
                />
              </div>
            )}

            {/* Education Level (if applicable) */}
            {selectedCategory?.has_education_level && (
              <div className="form-group" style={{ marginTop: '1.75rem' }}>
                <label className="form-label">What is your current education level?</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem' }}>
                  {EDUCATION_LEVELS.map((lvl) => {
                    const isLevelSelected = educationLevel === lvl;
                    return (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => {
                          setEducationLevel(lvl);
                          setErrorMsg('');
                        }}
                        className={`topic-chip ${isLevelSelected ? 'selected' : ''}`}
                        id={`edu-level-${lvl.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                      >
                        {lvl}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* SECTION 2: QUESTION & CONTACT */}
          <div className="form-section-divider">
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--color-text-main)' }}>
              2. Explain your question & your details
            </h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '1.75rem' }}>
              Explain what you are trying to do or what you are struggling with. A few sentences are enough.
            </p>

            <div className="form-group">
              <label className="form-label" htmlFor="inquiry-input">
                Tell us what you need help with
              </label>
              <textarea
                id="inquiry-input"
                rows={4}
                required
                className="form-textarea"
                placeholder={
                  selectedCategory?.slug === 'education'
                    ? "e.g., I'm in Grade 12 and need help understanding algebra and functions before my exams."
                    : selectedCategory?.slug === 'career-advice'
                    ? "e.g., I'm working in customer service and want to transition into software development. I need guidance on where to start."
                    : selectedCategory?.slug === 'entrepreneurship'
                    ? "e.g., I have a business idea and need help understanding how to apply for business funding."
                    : "e.g., Explain what you are trying to do..."
                }
                value={inquiry}
                onChange={(e) => setInquiry(e.target.value)}
              />
            </div>

            {/* Preferred session format */}
            <div className="form-group" style={{ marginTop: '1.75rem' }}>
              <label className="form-label">Preferred Session Format</label>
              <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                {[
                  { id: 'chat', label: 'In-App Chat', icon: MessageSquare },
                  { id: 'video_meeting', label: 'Video Call', icon: Video },
                  { id: 'online_call', label: 'Voice Call', icon: PhoneCall },
                ].map((type) => {
                  const Icon = type.icon;
                  const isChecked = preferredSessionType === type.id;
                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setPreferredSessionType(type.id)}
                      className={`btn ${isChecked ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ padding: '0.85rem 1rem', fontSize: '0.9rem' }}
                      id={`session-type-${type.id}`}
                    >
                      <Icon size={16} />
                      <span>{type.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Contact Info */}
            <div className="grid gap-4" style={{ gridTemplateColumns: '1fr 1fr', marginTop: '1.75rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" htmlFor="seeker-name">Your Full Name</label>
                <input
                  id="seeker-name"
                  type="text"
                  required
                  className="form-input"
                  placeholder="e.g. Sipho Ndlovu"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" htmlFor="seeker-email">Email Address</label>
                <input
                  id="seeker-email"
                  type="email"
                  required
                  className="form-input"
                  placeholder="e.g. sipho@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <div 
            style={{ 
              borderTop: '1px solid var(--color-border)', 
              paddingTop: '2.5rem', 
              marginTop: '2.5rem',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div className="flex items-center gap-2" style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
              <ShieldCheck size={16} style={{ color: 'var(--color-accent-teal)' }} />
              <span>Only approved mentors in this topic receive your inquiry.</span>
            </div>

            <div className="flex items-center gap-3">
              <Link to="/" className="btn btn-secondary">
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary btn-lg"
                id="submit-help-request-btn"
              >
                <CheckCircle2 size={18} />
                <span>{isSubmitting ? 'Submitting...' : 'Submit Request'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
