import React from 'react';
import { BENEFITS } from '../../data/landing';

/**
 * Three benefit cards framed as user outcomes.
 * Builds emotional connection — "why should I care?"
 */
export default function BenefitsSection() {
  return (
    <section className="landing-section" style={{ textAlign: 'center' }}>
      <h2 className="landing-section-title">Why People Use It</h2>
      <div className="landing-accent" style={{ margin: '0 auto 2.5rem' }} />

      <div className="benefits-grid">
        {BENEFITS.map((b, i) => (
          <div key={i} className="benefit-card">
            <span className="benefit-icon">{b.icon}</span>
            <h3 className="benefit-title">{b.title}</h3>
            <p className="benefit-desc">{b.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
