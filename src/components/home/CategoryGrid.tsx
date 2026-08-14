import React from 'react';
import styles from './CategoryGrid.module.css';
import { CategoryInfo, ToolDefinition } from '../../types/tool';

export const CategoryGrid: React.FC<{ categories: CategoryInfo[]; tools: ToolDefinition[] }> = ({ categories, tools }) => (
  <div className={styles.grid}>
    {categories.map(cat => {
      const count = tools.filter(t => t.category === cat.id).length;
      return (
        <div key={cat.id} className={styles.card} style={{ '--hover-color': cat.color } as React.CSSProperties}>
          <div className={styles.icon}>{cat.icon}</div>
          <h3 className={styles.name}>{cat.name}</h3>
          <p className={styles.desc}>{cat.description}</p>
          <div className={styles.count}>{count} tools</div>
        </div>
      );
    })}
  </div>
);

export default CategoryGrid;
