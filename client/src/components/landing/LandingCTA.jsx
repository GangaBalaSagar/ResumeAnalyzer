import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Final call-to-action section for the Landing page.
 * Headline + paragraph + two CTA buttons.
 */
export default function LandingCTA() {
  const navigate = useNavigate();

  return (
    <section className="landing-cta">
      <h2 className="landing-cta-headline">Ready to Improve Your Resume?</h2>

      <p className="landing-cta-text">
        Upload your resume, get your ATS score, and start making data-driven improvements — it only takes a minute.
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
    </section>
  );
}
