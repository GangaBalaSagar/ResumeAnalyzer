import React from 'react';

/**
 * Reusable section header with optional accent divider.
 * @param {string} title       – Section heading
 * @param {string} [subtitle]  – Optional subheading
 * @param {string} [description] – Optional description paragraph
 * @param {boolean} [accent]   – Show gradient accent line below title
 */
export default function SectionHeader({ title, subtitle, description, accent = false }) {
  return (
    <header style={{ marginBottom: '2rem', textAlign: 'center' }}>
      <h2 style={{ marginBottom: accent ? '0.5rem' : '0.25rem', fontSize: '1.65rem', fontWeight: 700 }}>
        {title}
      </h2>

      {accent && (
        <div
          style={{
            width: '50px',
            height: '3px',
            borderRadius: '2px',
            background: 'linear-gradient(90deg, var(--primary), var(--primary-600))',
            margin: '0 auto 0.75rem',
          }}
        />
      )}

      {subtitle && (
        <h3 className="small" style={{ marginBottom: '0.5rem', color: 'var(--text-soft)' }}>
          {subtitle}
        </h3>
      )}

      {description && (
        <p style={{ color: 'var(--text-soft)', maxWidth: '700px', margin: '0 auto', lineHeight: 1.55 }}>
          {description}
        </p>
      )}
    </header>
  );
}
