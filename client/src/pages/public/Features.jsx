import React from 'react';
import { CAPABILITIES } from '../../data/features';
import HeroSection from '../../components/features/HeroSection';
import SectionHeader from '../../components/features/SectionHeader';
import CapabilitySection from '../../components/features/CapabilitySection';
import FinalCTA from '../../components/features/FinalCTA';

/**
 * Public Features page.
 * Structure: Hero → Product Overview → 6 Core Capabilities → Final CTA
 */
export default function Features() {
  return (
    <main style={{ maxWidth: 'var(--max-width)', margin: '0 auto', padding: '2rem 1rem' }}>
      {/* 1 — HERO */}
      <HeroSection />

      {/* 2 — PRODUCT OVERVIEW */}
      <section style={{ marginBottom: '4rem', textAlign: 'center' }}>
        <SectionHeader
          title="Product Overview"
          accent
        />
        <p
          style={{
            color: 'var(--text-soft)',
            maxWidth: '740px',
            margin: '0 auto',
            lineHeight: 1.65,
            fontSize: '1.02rem',
          }}
        >
          Resume Analyzer Pro is an AI‑powered platform that helps you turn your resume
          into a job‑winning document. Upload your resume, paste a job description, and receive
          a clear ATS match score with concrete, copy‑ready improvement suggestions. Iterate
          quickly, track your progress across multiple versions, and keep everything safely
          stored in your private workspace. Whether you are applying for your first role or your
          twentieth, the platform gives you the data you need to stand out.
        </p>
      </section>

      {/* 3 — CORE CAPABILITIES */}
      <section style={{ marginBottom: '2rem' }}>
        <SectionHeader
          title="Core Capabilities"
          description="Everything you need to optimise your resume for any job application."
          accent
        />
      </section>

      {CAPABILITIES.map((cap, idx) => (
        <CapabilitySection
          key={cap.id}
          index={idx}
          icon={cap.icon}
          title={cap.title}
          subtitle={cap.subtitle}
          description={cap.description}
          why={cap.why}
          benefits={cap.benefits}
          highlights={cap.highlights}
        />
      ))}

      {/* 4 — FINAL CTA */}
      <FinalCTA />
    </main>
  );
}
