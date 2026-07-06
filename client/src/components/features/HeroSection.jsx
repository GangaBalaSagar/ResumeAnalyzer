import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Hero section for the public Features page.
 * Buttons navigate to Analyze and Signup routes.
 */
export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <section
      style={{
        padding: '5rem 1rem 4rem',
        textAlign: 'center',
        position: 'relative',
      }}
    >
      <h1 style={{ marginBottom: '0.75rem', fontSize: '2.4rem', fontWeight: 800 }}>
        Land More Interviews Faster
      </h1>

      {/* Accent line */}
      <div
        style={{
          width: '80px',
          height: '4px',
          borderRadius: '2px',
          background: 'linear-gradient(90deg, var(--primary), var(--primary-600))',
          margin: '0 auto 1.5rem',
        }}
      />

      <p
        style={{
          marginBottom: '2.5rem',
          color: 'var(--text-soft)',
          maxWidth: '620px',
          margin: '0 auto 2.5rem',
          lineHeight: 1.6,
          fontSize: '1.08rem',
        }}
      >
        AI‑powered resume analysis gives you the exact feedback you need to get past
        ATS filters and land the interview you deserve.
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
