import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { EDUCATION_LEVELS } from '../data/initialData';
import { 
  ArrowRight, 
  ArrowLeft, 
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
  PhoneCall
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
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Wizard Step: 1, 2, 3, 4
  const [currentStep, setCurrentStep] = useState(1);

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

  // Pre-fill from query param if provided (e.g. from homepage category cards)
  useEffect(() => {
    const preCategory = searchParams.get('category');
    if (preCategory && categories.some(c => c.id === preCategory)) {
      setCategoryId(preCategory);
    }
  }, [searchParams, categories]);

  // Update name/email if currentUser changes
  useEffect(() => {
    if (currentUser) {
      if (!name) setName(currentUser.full_name || '');
      if (!email) setEmail(currentUser.email || '');
    }
  }, [currentUser]);

  const selectedCategory = categories.find(c => c.id === categoryId);
  const relevantTopics = topics.filter(t => t.category_id === categoryId);
  const selectedTopic = topics.find(t => t.id === topicId);

  // Step 1 Validation
  const handleNextFromStep1 = (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!name.trim()) {
      setErrorMsg('Please enter your name.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    setCurrentStep(2);
  };

  // Step 2 Validation
  const handleNextFromStep2 = () => {
    setErrorMsg('');
    if (!categoryId) {
      setErrorMsg('Please select an area where you need help.');
      return;
    }
    if (selectedCategory?.slug !== 'other' && !topicId) {
      setErrorMsg('Please select a specific topic.');
      return;
    }
    if (selectedCategory?.has_education_level && !educationLevel) {
      setErrorMsg('Please select your current education level.');
      return;
    }
    setCurrentStep(3);
  };

  // Step 3 Validation
  const handleNextFromStep3 = () => {
    setErrorMsg('');
    if (!inquiry.trim() || inquiry.trim().length < 10) {
      setErrorMsg('Please explain your question in at least 10 characters.');
      return;
    }
    setCurrentStep(4);
  };

  // Step 4 Final Submission
  const handleSubmitRequest = async () => {
    setErrorMsg('');
    setIsSubmitting(true);

    try {
      const finalInquiry = selectedCategory?.slug === 'other' && customCategoryText
        ? `[Custom Request: ${customCategoryText}] ${inquiry}`
        : inquiry;

      const newRequest = await submitHelpRequest({
        seeker_id: currentUser?.id || null,
        seeker_name: name,
        seeker_email: email,
        category_id: categoryId,
        topic_id: topicId || relevantTopics[0]?.id || '22222222-0008-0000-0000-000000000001',
        education_level: selectedCategory?.has_education_level ? educationLevel : null,
        inquiry: finalInquiry,
        preferred_session_type: preferredSessionType,
      });

      // Redirect to confirmation page
      navigate(`/request-submitted/${newRequest.id}`);
    } catch (err) {
      console.error('Submission failed:', err);
      setErrorMsg('An error occurred while submitting your request. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 1.5rem 5rem' }}>
      <div className="wizard-container">
        {/* Progress indicator */}
        <div className="wizard-progress">
          {[
            { step: 1, label: 'Your Details' },
            { step: 2, label: 'Area & Topic' },
            { step: 3, label: 'Your Question' },
            { step: 4, label: 'Review & Submit' },
          ].map((item) => (
            <div
              key={item.step}
              className={`wizard-step-node ${
                currentStep === item.step ? 'active' : currentStep > item.step ? 'completed' : ''
              }`}
            >
              <div className="wizard-step-circle">
                {currentStep > item.step ? <CheckCircle2 size={16} /> : item.step}
              </div>
              <span className="wizard-step-label">{item.label}</span>
            </div>
          ))}
        </div>

        {/* Global Error Banner */}
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
            id="form-error-alert"
          >
            <AlertCircle size={18} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* STEP 1: YOUR DETAILS */}
        {currentStep === 1 && (
          <form onSubmit={handleNextFromStep1} className="animate-fade-in" id="get-help-step-1-form">
            <h2 style={{ fontSize: '1.65rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              Step 1: Your Details
            </h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', marginBottom: '1.75rem' }}>
              Tell us who you are so matching experts can reach you once accepted.
            </p>

            <div className="form-group">
              <label className="form-label" htmlFor="seeker-name-input">
                What is your name?
              </label>
              <input
                id="seeker-name-input"
                type="text"
                required
                className="form-input"
                placeholder="e.g., Sipho Ndlovu"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="seeker-email-input">
                What is your email address?
              </label>
              <input
                id="seeker-email-input"
                type="email"
                required
                className="form-input"
                placeholder="e.g., sipho@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <span className="form-hint">
                We will use this to send you request updates and track your question securely.
              </span>
            </div>

            <div className="flex justify-between items-center" style={{ marginTop: '2rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--color-text-dim)' }}>
                Step 1 of 4
              </span>
              <button type="submit" className="btn btn-primary" id="step1-next-btn">
                Next: Choose Area <ArrowRight size={16} />
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: WHAT DO YOU NEED HELP WITH? */}
        {currentStep === 2 && (
          <div className="animate-fade-in" id="get-help-step-2">
            <h2 style={{ fontSize: '1.65rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              Which area do you need help with?
            </h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
              Select a category to view specific topics. Only approved experts in this topic can accept your request.
            </p>

            {/* Category selection cards */}
            <div className="selection-grid" style={{ marginBottom: '1.5rem' }}>
              {categories.filter(c => c.is_active).map((cat) => {
                const Icon = ICON_MAP[cat.icon] || HelpCircle;
                const isSelected = categoryId === cat.id;
                return (
                  <div
                    key={cat.id}
                    className={`selection-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => {
                      setCategoryId(cat.id);
                      setTopicId('');
                      setErrorMsg('');
                    }}
                    id={`category-select-${cat.slug}`}
                  >
                    <div 
                      style={{
                        width: '2.5rem',
                        height: '2.5rem',
                        borderRadius: 'var(--radius-sm)',
                        background: isSelected ? 'var(--color-primary-600)' : 'var(--color-primary-50)',
                        color: isSelected ? '#ffffff' : 'var(--color-primary-600)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Icon size={20} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{cat.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                        {cat.slug === 'education' ? 'Maths, Sciences, Accounting' :
                         cat.slug === 'career-advice' ? 'CV, Interviews, Tech transitions' :
                         cat.slug === 'entrepreneurship' ? 'Funding, Planning, Sales' :
                         cat.slug === 'software-development' ? 'Coding, Web, Fundamentals' : 'Specialized guidance'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Subcategory / Topic selection */}
            {categoryId && relevantTopics.length > 0 && selectedCategory?.slug !== 'other' && (
              <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem' }}>
                <label className="form-label" style={{ marginBottom: '0.75rem', display: 'block' }}>
                  Select specific topic in {selectedCategory.name}:
                </label>
                <div 
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                    gap: '0.65rem',
                  }}
                >
                  {relevantTopics.map((top) => (
                    <button
                      key={top.id}
                      type="button"
                      onClick={() => setTopicId(top.id)}
                      className={`btn btn-sm ${topicId === top.id ? 'btn-primary' : 'btn-secondary'}`}
                      style={{
                        textAlign: 'left',
                        justifyContent: 'flex-start',
                        padding: '0.6rem 0.85rem',
                        height: 'auto',
                        whiteSpace: 'normal',
                      }}
                      id={`topic-option-${top.slug}`}
                    >
                      {top.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Custom description if "Other" category */}
            {selectedCategory?.slug === 'other' && (
              <div className="form-group" style={{ marginTop: '1.5rem' }}>
                <label className="form-label">What kind of help do you need?</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Legal compliance for non-profits, or specialized consultation"
                  value={customCategoryText}
                  onChange={(e) => setCustomCategoryText(e.target.value)}
                  id="custom-category-input"
                />
                <span className="form-hint">
                  Where no direct category exists, your request will be routed to our support team for manual review.
                </span>
              </div>
            )}

            {/* Education Level selector if relevant (e.g. School Subjects) */}
            {selectedCategory?.has_education_level && (
              <div className="form-group" style={{ marginTop: '1.5rem' }}>
                <label className="form-label">What is your current education level?</label>
                <select
                  className="form-select"
                  value={educationLevel}
                  onChange={(e) => setEducationLevel(e.target.value)}
                  id="education-level-select"
                >
                  <option value="">-- Select Education Level --</option>
                  {EDUCATION_LEVELS.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
                <span className="form-hint">
                  Ensures we route your question to educators who teach this specific grade or level.
                </span>
              </div>
            )}

            <div className="flex justify-between items-center" style={{ marginTop: '2.5rem' }}>
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="btn btn-secondary"
                id="step2-back-btn"
              >
                <ArrowLeft size={16} /> Back
              </button>
              <button
                type="button"
                onClick={handleNextFromStep2}
                className="btn btn-primary"
                id="step2-next-btn"
              >
                Next: Explain Question <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: EXPLAIN YOUR QUESTION */}
        {currentStep === 3 && (
          <div className="animate-fade-in" id="get-help-step-3">
            <h2 style={{ fontSize: '1.65rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              Tell us what you need help with.
            </h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
              Explain what you are trying to do or what you are struggling with. A few sentences are enough.
            </p>

            <div className="form-group">
              <label className="form-label" htmlFor="inquiry-textarea">
                Your question or inquiry (Required)
              </label>
              <textarea
                id="inquiry-textarea"
                rows={5}
                className="form-textarea"
                value={inquiry}
                maxLength={1200}
                onChange={(e) => setInquiry(e.target.value)}
                placeholder={
                  selectedCategory?.slug === 'education'
                    ? "e.g., I'm in Grade 12 and need help understanding algebra and functions before my exams."
                    : selectedCategory?.slug === 'career-advice'
                    ? "e.g., I'm working in customer service and want to transition into software development. I need guidance on where to start."
                    : selectedCategory?.slug === 'entrepreneurship'
                    ? "e.g., I have a business idea and need help understanding how to apply for business funding and which documents are required."
                    : selectedCategory?.slug === 'business-analysis'
                    ? "e.g., I want to become a business analyst but do not know which skills and certifications I need to learn first."
                    : selectedCategory?.slug === 'product-design'
                    ? "e.g., I have a product design portfolio but need help improving my case studies before applying for jobs."
                    : "e.g., Explain what you are trying to solve..."
                }
              />
              <div className="flex justify-between items-center" style={{ fontSize: '0.8rem', color: 'var(--color-text-dim)' }}>
                <span>Be clear and specific so the right expert can quickly assist you.</span>
                <span>{inquiry.length} / 1200</span>
              </div>
            </div>

            <div className="form-group" style={{ marginTop: '1.5rem' }}>
              <label className="form-label">Preferred Session Format</label>
              <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                {[
                  { id: 'chat', label: 'Chat Messaging', icon: MessageSquare },
                  { id: 'video_meeting', label: 'Video Meeting', icon: Video },
                  { id: 'online_call', label: 'Voice Call', icon: PhoneCall },
                ].map((type) => {
                  const Icon = type.icon;
                  const isSelected = preferredSessionType === type.id;
                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setPreferredSessionType(type.id)}
                      className={`btn ${isSelected ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ padding: '0.75rem', flexDirection: 'column', gap: '0.35rem' }}
                      id={`session-type-${type.id}`}
                    >
                      <Icon size={18} />
                      <span style={{ fontSize: '0.85rem' }}>{type.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-between items-center" style={{ marginTop: '2.5rem' }}>
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="btn btn-secondary"
                id="step3-back-btn"
              >
                <ArrowLeft size={16} /> Back
              </button>
              <button
                type="button"
                onClick={handleNextFromStep3}
                className="btn btn-primary"
                id="step3-next-btn"
              >
                Review & Confirm <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: REVIEW & SUBMIT */}
        {currentStep === 4 && (
          <div className="animate-fade-in" id="get-help-step-4">
            <h2 style={{ fontSize: '1.65rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              Review Your Request
            </h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
              Please confirm your details before sending your request to matching experts.
            </p>

            <div 
              style={{
                background: 'var(--color-bg-subtle)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
              }}
            >
              <div className="flex justify-between items-center" style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem' }}>
                <span style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Full Name</span>
                <strong style={{ fontSize: '0.95rem' }}>{name}</strong>
              </div>

              <div className="flex justify-between items-center" style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem' }}>
                <span style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Email Address</span>
                <strong style={{ fontSize: '0.95rem' }}>{email}</strong>
              </div>

              <div className="flex justify-between items-center" style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem' }}>
                <span style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Main Category</span>
                <strong style={{ fontSize: '0.95rem' }}>{selectedCategory?.name}</strong>
              </div>

              <div className="flex justify-between items-center" style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem' }}>
                <span style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Specific Topic</span>
                <strong style={{ fontSize: '0.95rem' }}>
                  {selectedCategory?.slug === 'other' ? (customCategoryText || 'General Consultation') : (selectedTopic?.name || 'Selected Topic')}
                </strong>
              </div>

              {selectedCategory?.has_education_level && educationLevel && (
                <div className="flex justify-between items-center" style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem' }}>
                  <span style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Education Level</span>
                  <strong style={{ fontSize: '0.95rem' }}>{educationLevel}</strong>
                </div>
              )}

              <div className="flex justify-between items-center" style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem' }}>
                <span style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Preferred Session</span>
                <strong style={{ fontSize: '0.95rem', textTransform: 'capitalize' }}>
                  {preferredSessionType.replace('_', ' ')}
                </strong>
              </div>

              <div>
                <span style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', display: 'block', marginBottom: '0.35rem' }}>
                  Your Question
                </span>
                <div 
                  style={{
                    background: '#ffffff',
                    padding: '0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-border)',
                    fontSize: '0.9rem',
                    lineHeight: '1.5',
                  }}
                >
                  {inquiry}
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center" style={{ marginTop: '2.5rem' }}>
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="btn btn-secondary"
                disabled={isSubmitting}
                id="step4-back-btn"
              >
                <ArrowLeft size={16} /> Edit Details
              </button>
              <button
                type="button"
                onClick={handleSubmitRequest}
                className="btn btn-primary btn-lg"
                disabled={isSubmitting}
                id="submit-request-final-btn"
              >
                <CheckCircle2 size={18} />
                {isSubmitting ? 'Submitting Request...' : 'Submit Request'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
