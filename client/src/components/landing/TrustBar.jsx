import React from 'react';
import { TRUST_ITEMS } from '../../data/landing';

/**
 * Horizontal trust bar — renders immediately below the hero.
 * Five short proof-points to build credibility at a glance.
 */
export default function TrustBar() {
  return (
    <section className="trust-bar">
      {TRUST_ITEMS.map((item, i) => (
        <div key={i} className="trust-bar-item">
          <span className="trust-bar-icon">{item.icon}</span>
          <span className="trust-bar-label">{item.label}</span>
        </div>
      ))}
    </section>
  );
}
