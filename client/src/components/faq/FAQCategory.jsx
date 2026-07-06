import React from 'react';
import FAQItem from './FAQItem';

/**
 * Renders a category heading and its FAQ items inside a subtle card wrapper.
 * Only one item across all categories can be expanded — the parent page
 * passes the currently expanded ID and a toggle handler.
 */
export default function FAQCategory({ category, expandedId, onToggle }) {
  const { title, icon, description, items } = category;

  return (
    <section className="faq-category-card">
      <div className="faq-category-header">
        {icon && <span className="faq-category-icon">{icon}</span>}
        <div>
          <h2 className="faq-category-title">{title}</h2>
          {description && <p className="faq-category-desc">{description}</p>}
        </div>
      </div>

      <div className="faq-category-items">
        {items.map((item, idx) => {
          const id = `${title}-${idx}`;
          return (
            <FAQItem
              key={id}
              id={id}
              question={item.question}
              answer={item.answer}
              isExpanded={expandedId === id}
              onToggle={onToggle}
            />
          );
        })}
      </div>
    </section>
  );
}
