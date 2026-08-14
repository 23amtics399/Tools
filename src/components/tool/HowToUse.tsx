import React from 'react';
export const HowToUse: React.FC<{ steps: string[]; toolName: string }> = ({ steps, toolName }) => (
  <section style={{ margin: '3rem 0' }}>
    <h2 style={{ color: 'var(--color-text)', marginBottom: '1.5rem' }}>How to use {toolName}</h2>
    <ol style={{ color: 'var(--color-text-muted)', lineHeight: '1.6', paddingLeft: '1.5rem' }}>
      {steps.map((s, i) => <li key={i} style={{ marginBottom: '0.5rem' }}>{s}</li>)}
    </ol>
  </section>
);

export default HowToUse;
