import React from 'react';

export default function ListItem({ title, description }) {
  return (
    <li style={{ marginBottom: '0.75rem' }}>
      <strong>{title}</strong>: <span style={{ color: 'var(--text-soft)' }}>{description}</span>
    </li>
  );
}
