import React from 'react';
import { PROCESS_STEPS } from '../../data/landing';

/**
 * Four small numbered steps in a horizontal row.
 * Shows the product is simple to use. No timeline graphics.
 */
export default function SimpleProcess() {
  return (
    <section className="landing-section" style={{ textAlign: 'center' }}>
      <h2 className="landing-section-title">How It Works</h2>
      <div className="landing-accent" style={{ margin: '0 auto 2.5rem' }} />

      <div className="process-steps">
        {PROCESS_STEPS.map((step, i) => (
          <React.Fragment key={i}>
            <div className="process-step">
              <span className="process-step-number">{step.number}</span>
              <h4 className="process-step-label">{step.label}</h4>
              <p className="process-step-desc">{step.description}</p>
            </div>
            {i < PROCESS_STEPS.length - 1 && (
              <span className="process-step-arrow" aria-hidden="true">→</span>
            )}
          </React.Fragment>
        ))}
      </div>
    </section>
  );
}
