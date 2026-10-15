import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { 
  ArrowRight, 
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
  Users
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

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-pill">
            <Zap size={14} />
            <span>Fast, verified category matching</span>
          </div>

          <h1 className="hero-title">
            Need help? Let's find the right person.
          </h1>

          <p className="hero-subtitle">
            From school subjects and career advice to business, entrepreneurship, and product design, 
            connect with people who can help you move forward.
          </p>

          <div className="hero-cta">
            <Link to="/get-help" className="btn btn-primary btn-lg" id="hero-get-help-btn">
              Get Help <ArrowRight size={18} />
            </Link>
            <Link to="/expert/register" className="btn btn-secondary btn-lg" id="hero-become-expert-btn">
              Become an Expert
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="section" id="how-it-works" style={{ background: 'var(--color-bg-subtle)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Simple 3-Step Process</span>
            <h2 className="section-title">How It Works</h2>
            <p style={{ maxWidth: '600px', margin: '0 auto', color: 'var(--color-text-muted)' }}>
              Like hailing a ride, submitting your request instantly routes it to matching experts ready to assist.
            </p>
          </div>

          <div className="steps-grid">
            <div className="step-card" id="step-card-1">
              <div className="step-number">1</div>
              <h3 className="step-title">Tell us what you need help with</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
                Select your area, pick the specific topic, and write a few sentences explaining your question or challenge.
              </p>
            </div>

            <div className="step-card" id="step-card-2">
              <div className="step-number">2</div>
              <h3 className="step-title">Your request goes to suitable experts</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
                Our automated routing checks approved expertise, education levels, and active availability. No generic broadcasts.
              </p>
            </div>

            <div className="step-card" id="step-card-3">
              <div className="step-number">3</div>
              <h3 className="step-title">An expert accepts, and you connect</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
                The first matching expert to accept unlocks private messaging and an easy way to schedule an online video or call.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Categories Section */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Areas of Expertise</span>
            <h2 className="section-title">Explore Categories</h2>
            <p style={{ maxWidth: '600px', margin: '0 auto', color: 'var(--color-text-muted)' }}>
              Choose a category below to start your request with that area preselected.
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
                  <div className="flex items-center gap-1" style={{ color: 'var(--color-primary-600)', fontSize: '0.85rem', fontWeight: 600, marginTop: 'auto' }}>
                    <span>Request assistance</span>
                    <ArrowRight size={14} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trust & Guarantee Banner */}
      <section className="section" style={{ background: '#0f172a', color: '#ffffff', padding: '3.5rem 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="flex items-center justify-center gap-2" style={{ color: '#60a5fa', marginBottom: '0.75rem' }}>
            <ShieldCheck size={20} />
            <span style={{ fontWeight: 700, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Responsible & Fair Platform
            </span>
          </div>
          <h2 style={{ color: '#ffffff', fontSize: '2rem', fontWeight: 800, marginBottom: '1rem' }}>
            Ready to find guidance?
          </h2>
          <p style={{ color: '#94a3b8', maxWidth: '640px', margin: '0 auto 2rem', fontSize: '1.05rem', lineHeight: '1.6' }}>
            Get started in under two minutes. No complex registration forms, no directory browsing, and no hidden charges.
          </p>
          <Link to="/get-help" className="btn btn-primary btn-lg" id="bottom-cta-get-help">
            Get Help Now <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
