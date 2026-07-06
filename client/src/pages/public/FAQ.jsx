import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FAQ_CATEGORIES, POPULAR_QUESTIONS } from '../../data/faq';
import FAQCategory from '../../components/faq/FAQCategory';
import FAQPopularQuestions from '../../components/faq/FAQPopularQuestions';

/**
 * Public FAQ page.
 * Structure: Hero → Introduction → Popular Questions → Accordion Categories → Need More Help → CTA
 */
export default function FAQ() {
  const [expandedId, setExpandedId] = useState(null);
  const navigate = useNavigate();

  const handleToggle = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <main style={{ maxWidth: 'var(--max-width)', margin: '0 auto', padding: '2rem 1rem' }}>
      {/* 1 — HERO */}
      <section style={{ padding: '5rem 1rem 2rem', textAlign: 'center' }}>
        <h1 style={{ marginBottom: '0.75rem', fontSize: '2.4rem', fontWeight: 800 }}>
          Frequently Asked Questions
        </h1>
        <div
          style={{
            width: '80px',
            height: '4px',
            borderRadius: '2px',
            background: 'linear-gradient(90deg, var(--primary), var(--primary-600))',
            margin: '0 auto 1.5rem',
          }}
        />
        <p
          style={{
            color: 'var(--text-soft)',
            maxWidth: '620px',
            margin: '0 auto',
            lineHeight: 1.6,
            fontSize: '1.08rem',
          }}
        >
          Find answers to the most common questions about Resume Analyzer Pro — from resume
          analysis and ATS scoring to security and your account.
        </p>
      </section>

      {/* 2 — SHORT INTRODUCTION */}
      <section style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <p
          style={{
            color: 'var(--text-soft)',
            maxWidth: '640px',
            margin: '0 auto',
            lineHeight: 1.55,
          }}
        >
          Below you'll find concise answers to the most common concerns from job seekers
          using Resume Analyzer Pro. Can't find what you need? Scroll to the bottom for
          additional help.
        </p>
      </section>

      {/* 3 — POPULAR QUESTIONS */}
      <FAQPopularQuestions questions={POPULAR_QUESTIONS} />

      {/* 4 — ACCORDION CATEGORIES */}
      <section style={{ marginBottom: '3rem' }}>
        <h2
          style={{
            textAlign: 'center',
            marginBottom: '0.5rem',
            fontSize: '1.5rem',
            fontWeight: 700,
          }}
        >
          Browse by Category
        </h2>
        <div
          style={{
            width: '50px',
            height: '3px',
            borderRadius: '2px',
            background: 'linear-gradient(90deg, var(--primary), var(--primary-600))',
            margin: '0 auto 2rem',
          }}
        />

        {FAQ_CATEGORIES.map((cat, idx) => (
          <FAQCategory
            key={idx}
            category={cat}
            expandedId={expandedId}
            onToggle={handleToggle}
          />
        ))}
      </section>

      {/* 5 — NEED MORE HELP */}
      <section
        style={{
          padding: '3.5rem 1.5rem',
          textAlign: 'center',
          background: 'rgba(255,255,255,0.03)',
          borderRadius: 'var(--radius)',
          border: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <h2 style={{ marginBottom: '0.75rem', fontSize: '1.5rem', fontWeight: 700 }}>
          Need More Help?
        </h2>
        <p
          style={{
            color: 'var(--text-soft)',
            maxWidth: '480px',
            margin: '0 auto 2rem',
            lineHeight: 1.55,
          }}
        >
          If you couldn't find the answer you're looking for, create a free account and
          start exploring Resume Analyzer Pro for yourself.
        </p>

        {/* 6 — CREATE FREE ACCOUNT CTA */}
        <button className="btn" onClick={() => navigate('/signup')}>
          Create Free Account
        </button>
      </section>
    </main>
  );
}
