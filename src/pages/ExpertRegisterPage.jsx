import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { EDUCATION_LEVELS } from '../data/initialData';
import { 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ShieldCheck, 
  Briefcase, 
  GraduationCap, 
  MessageSquare, 
  Video, 
  PhoneCall,
  ArrowRight
} from 'lucide-react';

export default function ExpertRegisterPage() {
  const { categories, topics, registerExpertApplication } = useData();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Basic Info
  const [fullName, setFullName] = useState(currentUser?.full_name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [headline, setHeadline] = useState('');
  const [bio, setBio] = useState('');

  // Selected Categories & Topics
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
  const [selectedTopicIds, setSelectedTopicIds] = useState([]);
  const [selectedEducationLevels, setSelectedEducationLevels] = useState([]);
  const [sessionTypes, setSessionTypes] = useState(['chat', 'video_meeting']);

  // State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const toggleCategory = (catId) => {
    setSelectedCategoryIds(prev => 
      prev.includes(catId) ? prev.filter(id => id !== catId) : [...prev, catId]
    );
  };

  const toggleTopic = (topicId) => {
    setSelectedTopicIds(prev => 
      prev.includes(topicId) ? prev.filter(id => id !== topicId) : [...prev, topicId]
    );
  };

  const toggleEducationLevel = (level) => {
    setSelectedEducationLevels(prev => 
      prev.includes(level) ? prev.filter(l => l !== level) : [...prev, level]
    );
  };

  const toggleSessionType = (type) => {
    setSessionTypes(prev => {
      if (prev.includes(type)) {
        if (prev.length === 1) return prev; // keep at least one
        return prev.filter(t => t !== type);
      }
      return [...prev, type];
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName.trim() || !email.trim() || !headline.trim() || !bio.trim()) {
      setErrorMsg('Please fill in all basic profile details.');
      return;
    }

    if (selectedCategoryIds.length === 0) {
      setErrorMsg('Please select at least one area of expertise.');
      return;
    }

    if (selectedTopicIds.length === 0) {
      setErrorMsg('Please select at least one specific topic you can guide people with.');
      return;
    }

    setIsSubmitting(true);
    try {
      registerExpertApplication({
        user_id: currentUser?.id || crypto.randomUUID(),
        full_name: fullName.trim(),
        email: email.trim(),
        headline: headline.trim(),
        bio: bio.trim(),
        categories_requested: selectedCategoryIds,
        topics_requested: selectedTopicIds,
        education_levels: selectedEducationLevels,
        session_types: sessionTypes,
      });

      setIsSubmitted(true);
    } catch (err) {
      console.error('Expert registration failed:', err);
      setErrorMsg('An error occurred during submission. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ padding: '3rem 1.5rem 5rem' }}>
      <div className="wizard-container" style={{ maxWidth: '820px' }}>
        {isSubmitted ? (
          <div style={{ textAlign: 'center', padding: '2rem 1rem' }} className="animate-fade-in" id="expert-application-submitted">
            <div 
              style={{
                width: '4.5rem',
                height: '4.5rem',
                borderRadius: '50%',
                background: '#ecfdf5',
                color: '#10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
              }}
            >
              <CheckCircle2 size={40} />
            </div>

            <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.75rem' }}>
              Application Submitted (Pending Review)
            </h1>

            <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem', lineHeight: '1.6', maxWidth: '600px', margin: '0 auto 2rem' }}>
              Thank you for applying to become an expert on The Problem Solvers! Your profile has been received and is currently under review by our support administrators.
            </p>

            <div 
              style={{
                background: '#fffbeb',
                border: '1px solid #fde68a',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem',
                textAlign: 'left',
                maxWidth: '560px',
                margin: '0 auto 2.5rem',
                color: '#92400e',
                fontSize: '0.9rem',
                display: 'flex',
                gap: '0.75rem',
              }}
            >
              <Clock size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong>Quality & Trust Protection</strong>
                <p style={{ marginTop: '0.25rem', lineHeight: '1.45' }}>
                  To maintain high standards, new experts cannot receive live matching requests until an administrator verifies your application. You can review applications in the Admin portal if testing.
                </p>
              </div>
            </div>

            <div className="flex justify-center gap-3">
              <Link to="/admin" className="btn btn-secondary" id="preview-in-admin-btn">
                View in Admin Portal
              </Link>
              <Link to="/" className="btn btn-primary">
                Return Home
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} id="expert-registration-form">
            <div style={{ marginBottom: '2rem' }}>
              <div className="flex items-center gap-2" style={{ color: 'var(--color-primary-600)', marginBottom: '0.5rem' }}>
                <ShieldCheck size={20} />
                <span style={{ fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase' }}>Expert Application</span>
              </div>
              <h1 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                Become an Expert or Mentor
              </h1>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem', lineHeight: '1.5' }}>
                Join our network of teachers, career coaches, developers, designers, and entrepreneurs helping people move forward.
              </p>
            </div>

            {errorMsg && (
              <div 
                style={{
                  background: '#fee2e2',
                  border: '1px solid #fecaca',
                  color: '#dc2626',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '1.5rem',
                }}
              >
                <AlertCircle size={18} />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Section 1: Basic Details */}
            <div style={{ marginBottom: '2.5rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.25rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>
                1. Basic Details
              </h3>

              <div className="grid gap-3" style={{ gridTemplateColumns: '1fr 1fr' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="expert-full-name">Full Name</label>
                  <input
                    id="expert-full-name"
                    type="text"
                    required
                    className="form-input"
                    placeholder="e.g., Dr. Nomvula Sithole"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="expert-email">Email Address</label>
                  <input
                    id="expert-email"
                    type="email"
                    required
                    className="form-input"
                    placeholder="e.g., nomvula@mentor.org"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="expert-headline">Professional Headline</label>
                <input
                  id="expert-headline"
                  type="text"
                  required
                  className="form-input"
                  placeholder="e.g., Senior Fullstack Engineer | Ex-Amazon | Tech Mentor"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                />
                <span className="form-hint">A single concise sentence summarizing your role and specialty.</span>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="expert-bio">Short Biography & Experience</label>
                <textarea
                  id="expert-bio"
                  rows={4}
                  required
                  className="form-textarea"
                  placeholder="Share a brief overview of your background, years in industry, and how you enjoy helping learners and professionals..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
              </div>
            </div>

            {/* Section 2: Expertise */}
            <div style={{ marginBottom: '2.5rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>
                2. Which areas can you help people with?
              </h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
                Select the categories and specific topics you are qualified to mentor. You will only receive requests matching these selections.
              </p>

              {/* Categories checkboxes */}
              <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', marginBottom: '1.5rem' }}>
                {categories.filter(c => c.is_active).map((cat) => {
                  const isChecked = selectedCategoryIds.includes(cat.id);
                  return (
                    <label
                      key={cat.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.65rem',
                        padding: '0.75rem 1rem',
                        background: isChecked ? 'var(--color-primary-50)' : 'var(--color-bg-subtle)',
                        border: `1.5px solid ${isChecked ? 'var(--color-primary-600)' : 'var(--color-border)'}`,
                        borderRadius: 'var(--radius-md)',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        transition: 'all 0.15s ease',
                      }}
                      id={`expert-cat-checkbox-${cat.slug}`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleCategory(cat.id)}
                        style={{ width: '16px', height: '16px' }}
                      />
                      <span>{cat.name}</span>
                    </label>
                  );
                })}
              </div>

              {/* Subcategories / Topics for selected categories */}
              {selectedCategoryIds.length > 0 && (
                <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                  <label className="form-label" style={{ marginBottom: '0.75rem', display: 'block' }}>
                    Select specific subcategories & topics you cover:
                  </label>

                  {selectedCategoryIds.map((catId) => {
                    const cat = categories.find(c => c.id === catId);
                    const catTopics = topics.filter(t => t.category_id === catId);
                    if (catTopics.length === 0) return null;

                    return (
                      <div key={catId} style={{ marginBottom: '1rem' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-primary-700)', display: 'block', marginBottom: '0.4rem' }}>
                          {cat?.name}:
                        </span>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                          {catTopics.map((top) => {
                            const isTopicChecked = selectedTopicIds.includes(top.id);
                            return (
                              <button
                                key={top.id}
                                type="button"
                                onClick={() => toggleTopic(top.id)}
                                className={`btn btn-sm ${isTopicChecked ? 'btn-primary' : 'btn-secondary'}`}
                                style={{ borderRadius: 'var(--radius-full)' }}
                                id={`expert-topic-btn-${top.slug}`}
                              >
                                {top.name}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Education levels for academic mentors */}
              <div style={{ marginTop: '1.5rem' }}>
                <label className="form-label" style={{ marginBottom: '0.5rem', display: 'block' }}>
                  Target Education Levels (Optional for Academic/School mentors):
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {EDUCATION_LEVELS.map((lvl) => {
                    const isSelected = selectedEducationLevels.includes(lvl);
                    return (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => toggleEducationLevel(lvl)}
                        className={`btn btn-sm ${isSelected ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ borderRadius: 'var(--radius-full)' }}
                      >
                        {lvl}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Section 3: Session Preferences */}
            <div style={{ marginBottom: '2.5rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>
                3. Session Preferences
              </h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                Select the consultation formats you are open to offering:
              </p>

              <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                {[
                  { id: 'chat', label: 'Chat Messaging', icon: MessageSquare },
                  { id: 'video_meeting', label: 'Video Meeting', icon: Video },
                  { id: 'online_call', label: 'Online Voice Call', icon: PhoneCall },
                ].map((type) => {
                  const Icon = type.icon;
                  const isChecked = sessionTypes.includes(type.id);
                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => toggleSessionType(type.id)}
                      className={`btn ${isChecked ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ padding: '0.85rem', flexDirection: 'column', gap: '0.4rem' }}
                      id={`pref-session-${type.id}`}
                    >
                      <Icon size={20} />
                      <span style={{ fontSize: '0.85rem' }}>{type.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-between items-center" style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem' }}>
              <Link to="/" className="btn btn-secondary">
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary btn-lg"
                id="submit-expert-application-btn"
              >
                <CheckCircle2 size={18} />
                {isSubmitting ? 'Submitting Application...' : 'Submit Expert Application'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
