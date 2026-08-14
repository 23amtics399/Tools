import React from 'react';
import { Link } from 'react-router-dom';
import styles from './ToolCard.module.css';
import { ToolDefinition } from '../../types/tool';
import { Badge } from '../ui/Badge';

export const ToolCard: React.FC<{ tool: ToolDefinition }> = ({ tool }) => {
  return (
    <Link to={tool.path} className={`${styles.card} ${tool.status === 'coming-soon' ? styles.comingSoon : ''}`}>
      <div className={styles.icon}>{tool.icon}</div>
      <div className={styles.content}>
        <h3 className={styles.name}>{tool.name}</h3>
        <p className={styles.desc}>{tool.shortDescription}</p>
      </div>
      {tool.status === 'coming-soon' && (
        <div className={styles.badgeWrapper}>
          <Badge variant="coming-soon">Coming Soon</Badge>
        </div>
      )}
    </Link>
  );
};

export default ToolCard;
