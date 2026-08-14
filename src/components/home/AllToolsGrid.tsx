import React from 'react';
import styles from './AllToolsGrid.module.css';
import { ToolDefinition } from '../../types/tool';
import { ToolCard } from './ToolCard';

export const AllToolsGrid: React.FC<{ tools: ToolDefinition[]; searchQuery?: string }> = ({ tools, searchQuery }) => {
  const categories = Array.from(new Set(tools.map(t => t.category)));
  return (
    <div className={styles.container}>
      {categories.map(cat => {
        const catTools = tools.filter(t => {
          if (t.category !== cat) return false;
          if (!searchQuery) return true;
          const q = searchQuery.toLowerCase();
          return (
            t.name.toLowerCase().includes(q) ||
            t.description.toLowerCase().includes(q) ||
            t.seo.keywords.some(k => k.toLowerCase().includes(q)) ||
            t.category.toLowerCase().includes(q)
          );
        });
        if (catTools.length === 0) return null;
        return (
          <section key={cat} className={styles.section}>
            <h2 className={styles.header}>{cat.replace('-', ' ').toUpperCase()}</h2>
            <div className={styles.grid}>
              {catTools.map(t => <ToolCard key={t.id} tool={t} />)}
            </div>
          </section>
        );
      })}
    </div>
  );
};

export default AllToolsGrid;
