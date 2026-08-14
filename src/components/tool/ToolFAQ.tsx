import React from 'react';
export const ToolFAQ: React.FC<{ faqs: any[]; toolName: string }> = ({ faqs, toolName }) => (
  <section style={{ margin: '3rem 0' }}>
    <h2 style={{ color: 'var(--color-text)', marginBottom: '1.5rem' }}>{toolName} FAQ</h2>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {faqs.map((f, i) => (
        <div key={i} style={{ background: 'var(--color-bg-card)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
          <h4 style={{ color: 'var(--color-text)', margin: '0 0 0.5rem' }}>{f.question}</h4>
          <p style={{ color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.6 }}>{f.answer}</p>
        </div>
      ))}
    </div>
  </section>
);

export default ToolFAQ;
