import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import heroMentorImg from '../assets/hero_mentor.jpg';
import { 
  ArrowRight, 
  Play,
  CheckCircle2, 
  GraduationCap, 
  Briefcase, 
  TrendingUp, 
  FileText, 
  Palette, 
  Code, 
  Compass, 
  HelpCircle,
  ShieldCheck,
  Zap,
  Users,
  Sparkles,
  MessageSquare
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

export default function HomePage() {
  const { categories } = useData();
  const navigate = useNavigate();

  const handleCategoryClick = (categoryId) => {
    navigate(`/get-help?category=${categoryId}`);
  };

  const handleHowItWorksScroll = (e) => {
    e.preventDefault();
    const el = document.getElementById('how-it-works');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div>
      {/* HERO SECTION - Exact Match with Reference Design Layout */}
      <section className="hero-gradient-bg hero-wrapper">
        <div className="container">
          <div className="hero-grid">
            {/* Left Content */}
            <div className="animate-slide-up">
              <div className="hero-pill">
                <span>👋 Welcome to The Problem Solvers</span>
                <Sparkles size={14} style={{ color: 'var(--color-primary-600)' }} />
              </div>

              <h1 className="hero-title">
                Learn, Grow, and Succeed <span className="highlight-tag">Together</span>
              </h1>

              <p className="hero-subtitle">
                The on-demand platform connecting people who need guidance with verified experts, mentors, and educators. From school subjects and career transitions to business funding and code.
              </p>

              <div className="hero-cta">
                <Link to="/get-help" className="btn btn-primary btn-lg" id="hero-get-help-btn">
                  Get Help <ArrowRight size={18} />
                </Link>

                <a 
                  href="#how-it-works" 
                  onClick={handleHowItWorksScroll} 
                  className="btn btn-secondary btn-lg" 
                  id="hero-how-it-works-btn"
                >
                  <Play size={16} style={{ color: 'var(--color-primary-600)', fill: 'var(--color-primary-600)' }} />
                  <span>How It Works</span>
                </a>
              </div>
            </div>

            {/* Right Visual Graphic with Overlapping Floating Badges */}
            <div className="hero-visual-container animate-fade-in">
              {/* Top-Right Floating Stat Badge */}
              <div 
                className="hero-floating-stat animate-float-badge" 
                style={{ top: '10px', right: '-15px' }}
                id="hero-stat-mentors"
              >
                <div className="avatar-stack">
                  <div className="avatar-stack-item" style={{ background: '#3b82f6' }}>TM</div>
                  <div className="avatar-stack-item" style={{ background: '#10b981' }}>SJ</div>
                  <div className="avatar-stack-item" style={{ background: '#8b5cf6' }}>LD</div>
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--color-text-main)', lineHeight: 1.1 }}>
                    300+
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                    Expert Mentors
                  </div>
                </div>
              </div>

              {/* Main Image Frame */}
              <div className="hero-image-frame">
                <img 
                  src={heroMentorImg} 
                  alt="Friendly verified mentor ready to assist" 
                />
              </div>

              {/* Bottom-Left Floating Stat Badge */}
              <div 
                className="hero-floating-stat animate-float-badge" 
                style={{ bottom: '15px', left: '-20px', animationDelay: '2s' }}
                id="hero-stat-matches"
              >
                <div 
                  style={{
                    width: '2.5rem',
                    height: '2.5rem',
                    borderRadius: 'var(--radius-full)',
                    background: '#ecfdf5',
                    color: '#059669',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Zap size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--color-text-main)', lineHeight: 1.1 }}>
                    Instant Match
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                    Direct Expert Routing
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE BAND (Identical aesthetic to dark banner in screenshot) */}
      <div className="marquee-band">
        <div className="marquee-content">
          <div className="marquee-item">
            <span>Education & School Subjects</span>
            <span className="accent-star">✦</span>
          </div>
          <div className="marquee-item">
            <span>Career Advice & Transitions</span>
            <span className="accent-star">✦</span>
          </div>
          <div className="marquee-item">
            <span>Business Funding & Validation</span>
            <span className="accent-star">✦</span>
          </div>
          <div className="marquee-item">
            <span>Product Design & Figma</span>
            <span className="accent-star">✦</span>
          </div>
          <div className="marquee-item">
            <span>Software Development & Code</span>
            <span className="accent-star">✦</span>
          </div>
          <div className="marquee-item">
            <span>Business Analysis & BPMN</span>
            <span className="accent-star">✦</span>
          </div>
          <div className="marquee-item">
            <span>Product Management Roadmaps</span>
            <span className="accent-star">✦</span>
          </div>
          {/* Repeating clone for seamless infinite marquee loop */}
          <div className="marquee-item">
            <span>Education & School Subjects</span>
            <span className="accent-star">✦</span>
          </div>
          <div className="marquee-item">
            <span>Career Advice & Transitions</span>
            <span className="accent-star">✦</span>
          </div>
          <div className="marquee-item">
            <span>Business Funding & Validation</span>
            <span className="accent-star">✦</span>
          </div>
          <div className="marquee-item">
            <span>Product Design & Figma</span>
            <span className="accent-star">✦</span>
          </div>
        </div>
      </div>

      {/* HOW IT WORKS SECTION */}
      <section className="section" id="how-it-works" style={{ background: '#ffffff' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Frictionless 3-Step Journey</span>
            <h2 className="section-title">How The Problem Solvers Works</h2>
            <p style={{ maxWidth: '600px', margin: '0 auto', color: 'var(--color-text-muted)' }}>
              Just like hailing a ride on Bolt: explain what you need, our backend routes it to eligible experts, one accepts, and you connect immediately.
            </p>
          </div>

          <div className="steps-grid">
            <div className="step-card" id="step-card-1">
              <div className="step-number">1</div>
              <h3 className="step-title">Tell us what you need help with</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                Select your area, pick the specific subcategory topic, and write a couple of sentences explaining what you are trying to solve.
              </p>
            </div>

            <div className="step-card" id="step-card-2">
              <div className="step-number">2</div>
              <h3 className="step-title">Your request routes to matching experts</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                Our system checks verified categories, specific topics, and education levels. Only approved, available mentors see your inquiry.
              </p>
            </div>

            <div className="step-card" id="step-card-3">
              <div className="step-number">3</div>
              <h3 className="step-title">An expert accepts & you connect</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                Once an expert reviews and accepts, a private chat unlocks and you can arrange an online consultation session right away.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* DUAL PATHWAYS: HOW TO GET HELP vs HOW TO BECOME AN EXPERT */}
      <section className="section" style={{ background: 'var(--color-bg-subtle)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Choose Your Journey</span>
            <h2 className="section-title">Two Ways to Engage</h2>
            <p style={{ maxWidth: '580px', margin: '0 auto', color: 'var(--color-text-muted)' }}>
              Whether you need guidance for your studies, career, or business, or want to share your expertise to help others move forward.
            </p>
          </div>

          <div className="pathways-grid">
            {/* Pathway 1: For Help Seekers */}
            <div className="pathway-card featured" id="pathway-get-help">
              <div 
                style={{
                  width: '3rem',
                  height: '3rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--color-primary-600)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                }}
              >
                <HelpCircle size={26} />
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.75rem' }}>
                Need Assistance? Get Help
              </h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                Students, entrepreneurs, and career transitioners: submit your question with zero unnecessary questions. Only approved mentors in that exact topic will receive it.
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '2rem' }}>
                <li className="flex items-center gap-2" style={{ fontSize: '0.9rem', color: 'var(--color-text-main)' }}>
                  <CheckCircle2 size={16} style={{ color: 'var(--color-accent-teal)' }} />
                  <span>No browsing long directories or complex booking filters</span>
                </li>
                <li className="flex items-center gap-2" style={{ fontSize: '0.9rem', color: 'var(--color-text-main)' }}>
                  <CheckCircle2 size={16} style={{ color: 'var(--color-accent-teal)' }} />
                  <span>Privacy protected: your contact info is never exposed publicly</span>
                </li>
                <li className="flex items-center gap-2" style={{ fontSize: '0.9rem', color: 'var(--color-text-main)' }}>
                  <CheckCircle2 size={16} style={{ color: 'var(--color-accent-teal)' }} />
                  <span>Direct in-app chat & calendar session scheduling</span>
                </li>
              </ul>

              <div style={{ marginTop: 'auto' }}>
                <Link to="/get-help" className="btn btn-primary" id="pathway-cta-get-help">
                  Start a Help Request <ArrowRight size={16} />
                </Link>
              </div>
            </div>

            {/* Pathway 2: For Experts & Mentors */}
            <div className="pathway-card" id="pathway-become-expert">
              <div 
                style={{
                  width: '3rem',
                  height: '3rem',
                  borderRadius: 'var(--radius-md)',
                  background: '#090d16',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                }}
              >
                <ShieldCheck size={26} />
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.75rem' }}>
                Are You an Expert? Share Your Knowledge
              </h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                Educators, lecturers, software developers, product designers, and business mentors: register your approved topics and receive only questions you are qualified to solve.
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '2rem' }}>
                <li className="flex items-center gap-2" style={{ fontSize: '0.9rem', color: 'var(--color-text-main)' }}>
                  <CheckCircle2 size={16} style={{ color: '#059669' }} />
                  <span>Full control over your availability toggle (Online/Offline)</span>
                </li>
                <li className="flex items-center gap-2" style={{ fontSize: '0.9rem', color: 'var(--color-text-main)' }}>
                  <CheckCircle2 size={16} style={{ color: '#059669' }} />
                  <span>Review inquiry details before accepting any request</span>
                </li>
                <li className="flex items-center gap-2" style={{ fontSize: '0.9rem', color: 'var(--color-text-main)' }}>
                  <CheckCircle2 size={16} style={{ color: '#059669' }} />
                  <span>Track accepted requests and scheduled consultation appointments</span>
                </li>
              </ul>

              <div style={{ marginTop: 'auto' }}>
                <Link to="/expert/register" className="btn btn-secondary" id="pathway-cta-become-expert">
                  Apply as an Expert <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* POPULAR CATEGORIES */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Areas of Expertise</span>
            <h2 className="section-title">Popular Categories</h2>
            <p style={{ maxWidth: '600px', margin: '0 auto', color: 'var(--color-text-muted)' }}>
              Click any category below to immediately open the help request with that area preselected.
            </p>
          </div>

          <div className="categories-grid">
            {categories.filter(c => c.is_active).map((category) => {
              const IconComponent = ICON_MAP[category.icon] || HelpCircle;
              return (
                <div
                  key={category.id}
                  className="category-card"
                  onClick={() => handleCategoryClick(category.id)}
                  id={`home-category-${category.slug}`}
                >
                  <div className="category-icon">
                    <IconComponent size={24} />
                  </div>
                  <div>
                    <h3 className="category-title">{category.name}</h3>
                    <p className="category-desc">{category.description}</p>
                  </div>
                  <div className="flex items-center gap-1" style={{ color: 'var(--color-primary-600)', fontSize: '0.85rem', fontWeight: 700, marginTop: 'auto' }}>
                    <span>Find suitable mentors</span>
                    <ArrowRight size={14} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
