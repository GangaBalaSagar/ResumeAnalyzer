import React from 'react';

/**
 * Renders a curated list of popular questions with answers always visible.
 * This is NOT an accordion — answers are shown inline for quick scanning.
 *
 * @param {{ question: string, answer: string }[]} questions
 */
export default function FAQPopularQuestions({ questions = [] }) {
  if (questions.length === 0) return null;

  return (
    <section style={{ marginBottom: '3rem' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '0.5rem', fontSize: '1.5rem', fontWeight: 700 }}>
        Popular Questions
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

      <div className="popular-questions-grid">
        {questions.map((q, i) => (
          <div key={i} className="popular-question-card">
            <h4 className="popular-question-title">{q.question}</h4>
            <p className="popular-question-answer">{q.answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
