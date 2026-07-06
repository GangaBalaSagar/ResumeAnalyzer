import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Final call‑to‑action block for the Features page.
 * Headline → short paragraph → two wired buttons.
 */
export default function FinalCTA() {
  const navigate = useNavigate();

  return (
    <section
      className="final-cta-section"
      style={{
        padding: '4rem 1.5rem',
        textAlign: 'center',
        marginTop: '2rem',
        background: 'rgba(255,255,255,0.03)',
        borderRadius: 'var(--radius)',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <h2 style={{ marginBottom: '0.75rem', fontSize: '1.65rem', fontWeight: 700 }}>
        Ready to Improve Your Next Application?
      </h2>

      <p
        style={{
          color: 'var(--text-soft)',
          maxWidth: '520px',
          margin: '0 auto 2rem',
          lineHeight: 1.55,
        }}
      >
        Upload your resume, get your ATS score, and start making data‑driven improvements today — it only takes a minute.
      </p>

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button className="btn" onClick={() => navigate('/app/analyze')}>
          Analyze Resume
        </button>
        <button
          className="btn"
          onClick={() => navigate('/signup')}
          style={{
            background: 'transparent',
            border: '1.5px solid var(--primary)',
            color: 'var(--primary)',
          }}
        >
          Create Free Account
        </button>
      </div>
    </section>
  );
}
