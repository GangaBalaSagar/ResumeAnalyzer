import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Landing hero — split layout.
 * Left: headline + subtitle + CTAs
 * Right: static product mockup built from HTML/CSS
 */
export default function LandingHero() {
  const navigate = useNavigate();

  return (
    <section className="landing-hero">
      {/* -------- Left: Copy -------- */}
      <div className="landing-hero-copy">
        <p className="landing-hero-badge">AI-Powered Resume Analysis</p>

        <h1 className="landing-hero-headline">
          Know exactly how your resume scores —{' '}
          <span className="landing-hero-highlight">before you apply</span>
        </h1>

        <p className="landing-hero-subtitle">
          Upload your resume, paste a job description, and get an instant ATS
          compatibility score with actionable improvement suggestions powered by AI.
        </p>

        <div className="landing-hero-actions">
          <button className="btn" onClick={() => navigate('/app/analyze')}>
            Analyze Your Resume
          </button>
          <button
            className="btn landing-btn-outline"
            onClick={() => navigate('/signup')}
          >
            Create Free Account
          </button>
        </div>
      </div>

      {/* -------- Right: Product Mockup -------- */}
      <div className="landing-mockup" aria-hidden="true">
        {/* Score card */}
        <div className="mockup-card mockup-score-card">
          <div className="mockup-score-ring">
            <svg viewBox="0 0 80 80" width="80" height="80">
              <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
              <circle
                cx="40" cy="40" r="34" fill="none"
                stroke="var(--primary)" strokeWidth="6"
                strokeDasharray="164" strokeDashoffset="30"
                strokeLinecap="round"
                transform="rotate(-90 40 40)"
              />
            </svg>
            <span className="mockup-score-value">86%</span>
          </div>
          <div className="mockup-score-meta">
            <span className="mockup-label">ATS Match Score</span>
            <span className="mockup-sublabel">Senior Frontend Engineer</span>
          </div>
        </div>

        {/* Skills preview */}
        <div className="mockup-card mockup-skills-card">
          <span className="mockup-card-title">Skills Match</span>
          <div className="mockup-chips">
            <span className="chip match">React</span>
            <span className="chip match">TypeScript</span>
            <span className="chip match">Node.js</span>
            <span className="chip miss">GraphQL</span>
            <span className="chip miss">AWS</span>
          </div>
        </div>

        {/* Suggestion preview */}
        <div className="mockup-card mockup-suggestion-card">
          <span className="mockup-card-title">AI Suggestion</span>
          <p className="mockup-suggestion-text">
            Add a "GraphQL" section highlighting your API experience to improve keyword match by ~8%.
          </p>
        </div>
      </div>
    </section>
  );
}
