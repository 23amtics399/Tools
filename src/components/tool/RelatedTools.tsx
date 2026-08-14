import React from 'react';
import { ToolDefinition } from '../../types/tool';
import { ToolCard } from '../home/ToolCard';
export const RelatedTools: React.FC<{ tools: ToolDefinition[] }> = ({ tools }) => (
  <section>
    <h2 style={{ color: 'var(--color-text)' }}>Related Tools</h2>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
      {tools.map(t => <ToolCard key={t.id} tool={t} />)}
    </div>
  </section>
);

export default RelatedTools;
