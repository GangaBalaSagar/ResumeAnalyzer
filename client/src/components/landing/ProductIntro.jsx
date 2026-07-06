import React from 'react';

/**
 * Concise product explanation section.
 * Under 150 words, no jargon, simple value statement.
 */
export default function ProductIntro() {
  return (
    <section className="landing-section" style={{ textAlign: 'center' }}>
      <h2 className="landing-section-title">What Is Resume Analyzer Pro?</h2>
      <div className="landing-accent" />
      <p className="landing-section-text" style={{ maxWidth: '720px', margin: '0 auto' }}>
        Resume Analyzer Pro is an AI-powered platform that evaluates your resume against
        any job description you are targeting. Upload your resume, paste the job posting,
        and receive a clear ATS compatibility score along with a detailed breakdown of
        matched skills, missing keywords, and section-by-section analysis. The platform
        generates specific, copy-ready suggestions so you know exactly what to change.
        Save every analysis, track your improvement over time, and access your reports
        from a secure personal workspace whenever you need them.
      </p>
    </section>
  );
}
