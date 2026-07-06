import React from 'react';

/**
 * Single accordion item for a question/answer pair.
 * Accessible: uses button with aria-expanded and aria-controls.
 * Chevron rotates on expand; smooth max-height transition.
 */
export default function FAQItem({ id, question, answer, isExpanded, onToggle }) {
  const handleClick = () => onToggle(id);

  return (
    <div className={`faq-accordion-item${isExpanded ? ' faq-accordion-item--open' : ''}`}>
      <h3 style={{ margin: 0 }}>
        <button
          type="button"
          id={`faq-question-${id}`}
          aria-controls={`faq-answer-${id}`}
          aria-expanded={isExpanded}
          onClick={handleClick}
          className="faq-accordion-trigger"
        >
          <span className="faq-accordion-question">{question}</span>
          <span className="faq-accordion-chevron" aria-hidden="true">
            ▸
          </span>
        </button>
      </h3>

      <div
        id={`faq-answer-${id}`}
        role="region"
        aria-labelledby={`faq-question-${id}`}
        className="faq-accordion-panel"
      >
        <p className="faq-accordion-answer">{answer}</p>
      </div>
    </div>
  );
}
