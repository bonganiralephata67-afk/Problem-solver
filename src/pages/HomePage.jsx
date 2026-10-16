import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { 
  ArrowRight, 
  GraduationCap, 
  Briefcase, 
  TrendingUp, 
  FileText, 
  Palette, 
  Code, 
  Compass, 
  HelpCircle,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

// Diverse photo set: Black students, Black entrepreneurs, White students, White professionals/educators
import mentorCenter from '../assets/mentors/mentor_center.jpg';
import mentorLeft1 from '../assets/mentors/mentor_left1.jpg';
import mentorLeft2 from '../assets/mentors/mentor_left2.jpg';
import mentorRight1 from '../assets/mentors/mentor_right1.jpg';
import mentorRight2 from '../assets/mentors/mentor_right2.jpg';
import blackMaleStudent from '../assets/mentors/black_male_student.jpg';
import blackFemaleEntrepreneur from '../assets/mentors/black_female_entrepreneur.jpg';
import blackMaleEntrepreneur from '../assets/mentors/black_male_entrepreneur.jpg';
import blackFemaleStudent from '../assets/mentors/black_female_student.jpg';
import whiteStudentCreative from '../assets/mentors/white_student_creative.jpg';

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

// 3 Curated Rotation Sets with a rich mix of Black students at school, Black entrepreneurs, White students and mentors
const MENTOR_ROTATION_SETS = [
  // Set 1: Black tech entrepreneur in center, Black school student on left, White engineering student on right
  [
    { img: mentorLeft1, alt: "Professional Mentor" },
    { img: blackFemaleStudent, alt: "Student Scholar" },
    { img: blackMaleEntrepreneur, alt: "Tech Founder & Entrepreneur", role: "Verified Expert" },
    { img: whiteStudentCreative, alt: "Engineering Student" },
    { img: blackMaleStudent, alt: "University Student" }
  ],
  // Set 2: Black female entrepreneur in center, Black university student on left, White educator on right
  [
    { img: blackMaleStudent, alt: "University Student" },
    { img: mentorLeft2, alt: "Creative Mentor" },
    { img: blackFemaleEntrepreneur, alt: "Business Entrepreneur", role: "Verified Expert" },
    { img: mentorRight1, alt: "Software Engineer" },
    { img: mentorRight2, alt: "Academic Educator" }
  ],
  // Set 3: White tech mentor in center, Black female entrepreneur on left, Black male entrepreneur on right, Black student on right
  [
    { img: whiteStudentCreative, alt: "Creative Student" },
    { img: blackFemaleEntrepreneur, alt: "Business Entrepreneur" },
    { img: mentorCenter, alt: "Verified Expert Mentor", role: "Verified Expert" },
    { img: blackMaleEntrepreneur, alt: "Tech Entrepreneur" },
    { img: blackFemaleStudent, alt: "Biology Student" }
  ]
];

export default function HomePage() {
  const { categories } = useData();
  const navigate = useNavigate();
  const [activeSetIndex, setActiveSetIndex] = useState(0);

  // Smoothly rotate through diverse pictures every 4.2 seconds (not too fast)
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSetIndex((prev) => (prev + 1) % MENTOR_ROTATION_SETS.length);
    }, 4200);
    return () => clearInterval(timer);
  }, []);

  const handleCategoryClick = (categoryId) => {
    navigate(`/get-help?category=${categoryId}`);
  };

  return (
    <div className="clean-page-bg">
      {/* HERO SECTION - CLEAN SLEEK DARK DESIGN (No blue circle) */}
      <section className="hero-wrapper">
        <div className="container">
          <div className="hero-center animate-slide-up">
            <div className="hero-pill">
              <CheckCircle2 size={15} style={{ color: 'var(--color-primary-400)' }} />
              <span>Simple On-Demand Expert Matching</span>
            </div>

            {/* Exact headline kept in bold */}
            <h1 className="hero-title">
              Get help from real people who understand what you're looking for.
            </h1>

            {/* Exact subheading kept, grouped with title via Law of Proximity */}
            <p className="hero-subtitle">
              Less time searching. More time achieving. Find the right guidance to help you get where you want to be.
            </p>

            {/* Spaced CTA Buttons */}
            <div className="hero-cta">
              <Link to="/get-help" className="btn btn-primary btn-lg" id="hero-get-help-btn">
                Get Help <ArrowRight size={18} />
              </Link>

              <Link to="/expert/register" className="btn btn-secondary btn-lg" id="hero-become-expert-btn">
                Become an Expert
              </Link>
            </div>

            {/* FANNED MENTORS CARDS (Diverse Black & White students & entrepreneurs, animated crossfade, non-clickable) */}
            <div className="hero-mentors-fanned" aria-hidden="true">
              {/* Far Left Card (Slot 0) */}
              <div className="fanned-card fanned-card-left1">
                {MENTOR_ROTATION_SETS.map((set, sIdx) => (
                  <img
                    key={sIdx}
                    src={set[0].img}
                    alt={set[0].alt}
                    className={`fanned-img-layer ${sIdx === activeSetIndex ? 'active' : ''}`}
                  />
                ))}
              </div>

              {/* Left Inner Card (Slot 1) */}
              <div className="fanned-card fanned-card-left2">
                {MENTOR_ROTATION_SETS.map((set, sIdx) => (
                  <img
                    key={sIdx}
                    src={set[1].img}
                    alt={set[1].alt}
                    className={`fanned-img-layer ${sIdx === activeSetIndex ? 'active' : ''}`}
                  />
                ))}
              </div>

              {/* Center Featured Card (Slot 2) */}
              <div className="fanned-card fanned-card-center">
                {MENTOR_ROTATION_SETS.map((set, sIdx) => (
                  <img
                    key={sIdx}
                    src={set[2].img}
                    alt={set[2].alt}
                    className={`fanned-img-layer ${sIdx === activeSetIndex ? 'active' : ''}`}
                  />
                ))}
                <div className="fanned-card-badge">
                  <div className="flex items-center gap-1">
                    <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span>
                    <span>Verified Expert</span>
                  </div>
                  <ShieldCheck size={14} style={{ color: 'var(--color-primary-400)' }} />
                </div>
              </div>

              {/* Right Inner Card (Slot 3) */}
              <div className="fanned-card fanned-card-right1">
                {MENTOR_ROTATION_SETS.map((set, sIdx) => (
                  <img
                    key={sIdx}
                    src={set[3].img}
                    alt={set[3].alt}
                    className={`fanned-img-layer ${sIdx === activeSetIndex ? 'active' : ''}`}
                  />
                ))}
              </div>

              {/* Far Right Card (Slot 4) */}
              <div className="fanned-card fanned-card-right2">
                {MENTOR_ROTATION_SETS.map((set, sIdx) => (
                  <img
                    key={sIdx}
                    src={set[4].img}
                    alt={set[4].alt}
                    className={`fanned-img-layer ${sIdx === activeSetIndex ? 'active' : ''}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="section" id="how-it-works" style={{ background: 'var(--color-bg-base)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-tag">How It Works</span>
            <h2 className="section-title">Connect in three simple steps</h2>
            <p style={{ maxWidth: '580px', margin: '0 auto', color: 'var(--color-text-muted)', fontSize: '1.05rem' }}>
              The platform connects people who need help with suitable, verified experts with zero directory searching.
            </p>
          </div>

          <div className="steps-grid">
            <div className="step-card" id="step-card-1">
              <div className="step-number">Step 01</div>
              <h3 className="step-title">Tell us what you need help with</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                Select your area, pick the specific topic, and explain your question in a few sentences.
              </p>
            </div>

            <div className="step-card" id="step-card-2">
              <div className="step-number">Step 02</div>
              <h3 className="step-title">Your request goes to suitable experts</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                Our system routes your question strictly to approved, available mentors who selected that specific topic and education level.
              </p>
            </div>

            <div className="step-card" id="step-card-3">
              <div className="step-number">Step 03</div>
              <h3 className="step-title">An expert accepts, and you connect</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                The first matching expert to accept unlocks private consultation chat and an option to arrange a meeting.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* EXPLORE POPULAR CATEGORIES */}
      <section className="section" style={{ background: 'var(--color-bg-surface)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Areas of Expertise</span>
            <h2 className="section-title">Popular Categories</h2>
            <p style={{ maxWidth: '580px', margin: '0 auto', color: 'var(--color-text-muted)', fontSize: '1.05rem' }}>
              Select any category to open the help form with that area already selected.
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
                    <IconComponent size={20} />
                  </div>
                  <div>
                    <h3 className="category-title">{category.name}</h3>
                    <p className="category-desc">{category.description}</p>
                  </div>
                  <div className="flex items-center gap-1" style={{ color: 'var(--color-primary-400)', fontSize: '0.88rem', fontWeight: 600, marginTop: 'auto' }}>
                    <span>Request help</span>
                    <ArrowRight size={14} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* TRUST & INTEGRITY BANNER */}
      <section className="section" style={{ background: 'var(--color-bg-base)', borderTop: '1px solid var(--color-border)', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '640px' }}>
          <div className="flex items-center justify-center gap-2" style={{ color: 'var(--color-primary-400)', marginBottom: '0.75rem' }}>
            <ShieldCheck size={20} />
            <span style={{ fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Verified Mentorship
            </span>
          </div>

          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem', color: '#ffffff' }}>
            Ready to get started?
          </h2>

          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem', lineHeight: '1.6', marginBottom: '2.5rem' }}>
            Connect with people who can guide you forward today. It takes less than two minutes.
          </p>

          <div className="hero-cta">
            <Link to="/get-help" className="btn btn-primary btn-lg" id="bottom-cta-get-help">
              Get Help <ArrowRight size={18} />
            </Link>
            <Link to="/expert/register" className="btn btn-secondary btn-lg" id="bottom-cta-become-expert">
              Become an Expert
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
