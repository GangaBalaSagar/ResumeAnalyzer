import React from 'react';
import { HOW_IT_HELPS } from '../../data/landing';

/**
 * Inline mini-mockup visuals for each "How It Helps" block.
 * Pure HTML/CSS — no images, no empty boxes.
 */
function UploadMockup() {
  return (
    <div className="hih-visual">
      <div className="hih-mini-card">
        <div className="hih-upload-zone">
          <span className="hih-upload-icon">⇪</span>
          <span className="hih-upload-label">resume_final.pdf</span>
          <span className="hih-upload-size">245 KB · PDF</span>
        </div>
      </div>
    </div>
  );
}

function AnalyzeMockup() {
  return (
    <div className="hih-visual">
      <div className="hih-mini-card">
        <div className="hih-analyze-row">
          <span className="hih-dot hih-dot--active" />
          <span className="hih-analyze-label">Comparing resume to job description…</span>
        </div>
        <div className="hih-analyze-bar">
          <div className="hih-analyze-fill" style={{ width: '72%' }} />
        </div>
        <div className="hih-analyze-tags">
          <span className="chip match">React</span>
          <span className="chip match">APIs</span>
          <span className="chip miss">Docker</span>
        </div>
      </div>
    </div>
  );
}

function ScoreMockup() {
  return (
    <div className="hih-visual">
      <div className="hih-mini-card">
        <div className="hih-score-row">
          <span className="hih-score-big">78%</span>
          <span className="hih-score-label">ATS Match</span>
        </div>
        <div className="hih-score-bars">
          <div className="hih-bar-row"><span className="hih-bar-name">Keywords</span><div className="hih-bar"><div className="hih-bar-fill" style={{ width: '85%' }} /></div></div>
          <div className="hih-bar-row"><span className="hih-bar-name">Skills</span><div className="hih-bar"><div className="hih-bar-fill" style={{ width: '70%' }} /></div></div>
          <div className="hih-bar-row"><span className="hih-bar-name">Format</span><div className="hih-bar"><div className="hih-bar-fill" style={{ width: '92%' }} /></div></div>
        </div>
      </div>
    </div>
  );
}

function ImproveMockup() {
  return (
    <div className="hih-visual">
      <div className="hih-mini-card">
        <div className="hih-suggestion-item">
          <span className="hih-check">✓</span>
          <span>Add "CI/CD" to your experience section</span>
        </div>
        <div className="hih-suggestion-item">
          <span className="hih-check">✓</span>
          <span>Quantify your API performance metrics</span>
        </div>
        <div className="hih-suggestion-item hih-suggestion-pending">
          <span className="hih-pending">○</span>
          <span>Include a cloud platforms section</span>
        </div>
      </div>
    </div>
  );
}

const MOCKUPS = [UploadMockup, AnalyzeMockup, ScoreMockup, ImproveMockup];

/**
 * Four alternating feature blocks showing how the product helps users.
 * Each block: heading + explanation + highlights + inline mockup.
 */
export default function HowItHelps() {
  return (
    <section className="landing-section">
      <h2 className="landing-section-title" style={{ textAlign: 'center' }}>How It Helps You</h2>
      <div className="landing-accent" style={{ margin: '0 auto 3rem' }} />

      {HOW_IT_HELPS.map((block, idx) => {
        const MockupComponent = MOCKUPS[idx];
        const isReversed = idx % 2 === 1;

        return (
          <div
            key={block.id}
            className="hih-block"
            data-reversed={isReversed || undefined}
          >
            <div className="hih-content">
              <h3 className="hih-heading">{block.heading}</h3>
              <p className="hih-explanation">{block.explanation}</p>
              <div className="hih-highlights">
                {block.highlights.map((hl, i) => (
                  <span key={i} className="chip">{hl}</span>
                ))}
              </div>
            </div>
            <MockupComponent />
          </div>
        );
      })}
    </section>
  );
}
