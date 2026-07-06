import React from 'react';
import LandingHero from '../../components/landing/LandingHero';
import TrustBar from '../../components/landing/TrustBar';
import ProductIntro from '../../components/landing/ProductIntro';
import HowItHelps from '../../components/landing/HowItHelps';
import CapabilitiesOverview from '../../components/landing/CapabilitiesOverview';
import BenefitsSection from '../../components/landing/BenefitsSection';
import SimpleProcess from '../../components/landing/SimpleProcess';
import LandingCTA from '../../components/landing/LandingCTA';

/**
 * Public Landing page — main marketing page.
 * 8 sections in order: Hero → Trust → Intro → How It Helps →
 * Capabilities → Benefits → Process → Final CTA
 */
export default function Landing() {
  return (
    <main style={{ maxWidth: 'var(--max-width)', margin: '0 auto', padding: '0 1rem 2rem' }}>
      <LandingHero />
      <TrustBar />
      <ProductIntro />
      <HowItHelps />
      <CapabilitiesOverview />
      <BenefitsSection />
      <SimpleProcess />
      <LandingCTA />
    </main>
  );
}
