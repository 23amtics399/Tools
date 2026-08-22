import React from 'react';
import styles from './AllToolsGrid.module.css';
import { ToolDefinition } from '../../types/tool';
import { ToolCard } from './ToolCard';

export const AllToolsGrid: React.FC<{ tools: ToolDefinition[]; searchQuery?: string }> = ({ tools, searchQuery }) => {
  const filteredTools = tools.filter(t => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      t.name.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.seo.keywords.some(k => k.toLowerCase().includes(q)) ||
      t.category.toLowerCase().includes(q)
    );
  });

  if (filteredTools.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>No tools found matching your search.</p>
      </div>
    );
  }

  return (
    <div className={styles.grid}>
      {filteredTools.map(t => <ToolCard key={t.id} tool={t} />)}
    </div>
  );
};

export default AllToolsGrid;
