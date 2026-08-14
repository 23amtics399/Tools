import React from 'react';
import { ToolDefinition } from '../../types/tool';
export const ComingSoon: React.FC<{ tool: ToolDefinition }> = ({ tool }) => (
  <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'var(--color-bg-card)', borderRadius: 'var(--radius-xl)', border: '1px dashed var(--color-border)' }}>
    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🚀</div>
    <h2 style={{ color: 'var(--color-text)', marginBottom: '1rem' }}>{tool.name} is coming soon!</h2>
    <p style={{ color: 'var(--color-text-muted)', maxWidth: '500px', margin: '0 auto' }}>We're working hard to bring this tool to you. Stay tuned!</p>
  </div>
);

export default ComingSoon;
