import React from 'react';

/**
 * Displays a single capability as a substantial showcase section.
 * Alternates layout based on index (even = icon‑left, odd = icon‑right).
 * No buttons, no links — purely informational.
 *
 * @param {number} index       – Used to alternate layout direction
 * @param {string} icon        – Emoji icon
 * @param {string} title       – Capability headline
 * @param {string} subtitle    – Short tagline
 * @param {string} description – Main description paragraph
 * @param {string} why         – "Why it matters" paragraph
 * @param {string[]} benefits  – List of benefit strings
 * @param {string[]} highlights – Highlight chip labels
 */
export default function CapabilitySection({
  index = 0,
  icon,
  title,
  subtitle,
  description,
  why,
  benefits = [],
  highlights = [],
}) {
  const isReversed = index % 2 === 1;

  return (
    <section className="capability-section" data-reversed={isReversed || undefined}>
      {/* Icon + text column */}
      <div className="capability-main">
        {/* Icon block */}
        <div className="capability-icon-block">
          <span className="capability-icon">{icon}</span>
        </div>

        <div className="capability-text">
          <h3 className="capability-title">{title}</h3>
          {subtitle && <p className="capability-subtitle">{subtitle}</p>}
          <p className="capability-description">{description}</p>
        </div>
      </div>

      {/* Details column */}
      <div className="capability-details">
        {/* Why it matters */}
        {why && (
          <div className="capability-why">
            <h4 className="capability-why-heading">Why It Matters</h4>
            <p className="capability-why-text">{why}</p>
          </div>
        )}

        {/* Benefits */}
        {benefits.length > 0 && (
          <ul className="capability-benefits">
            {benefits.map((b, i) => (
              <li key={i} className="capability-benefit">
                <span className="capability-benefit-check">✓</span>
                {b}
              </li>
            ))}
          </ul>
        )}

        {/* Highlight chips */}
        {highlights.length > 0 && (
          <div className="capability-highlights">
            {highlights.map((hl, i) => (
              <span key={i} className="chip">{hl}</span>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
