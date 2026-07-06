import React from 'react';
import { Link } from 'react-router-dom';
import { CAPABILITY_CARDS } from '../../data/landing';

/**
 * Four capability overview cards + link to Features page.
 * Summarises product depth without duplicating the Features page.
 */
export default function CapabilitiesOverview() {
  return (
    <section className="landing-section" style={{ textAlign: 'center' }}>
      <h2 className="landing-section-title">Core Product Capabilities</h2>
      <div className="landing-accent" style={{ margin: '0 auto 2.5rem' }} />

      <div className="capabilities-grid">
        {CAPABILITY_CARDS.map((card, i) => (
          <div key={i} className="capability-overview-card">
            <div className="capability-overview-icon">{card.icon}</div>
            <h3 className="capability-overview-title">{card.title}</h3>
            <p className="capability-overview-desc">{card.description}</p>
          </div>
        ))}
      </div>

      <Link to="/features" className="landing-explore-link">
        Explore all Features →
      </Link>
    </section>
  );
}
