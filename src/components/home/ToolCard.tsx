import React from 'react';
import { Link } from 'react-router-dom';
import styles from './ToolCard.module.css';
import { ToolDefinition } from '../../types/tool';
import { Badge } from '../ui/Badge';
import { ToolIcon } from '../icons/ToolIcon';

export const ToolCard: React.FC<{ tool: ToolDefinition }> = ({ tool }) => {
  return (
    <Link to={tool.path} className={`${styles.card} ${styles[tool.category]} ${tool.status === 'coming-soon' ? styles.comingSoon : ''}`}>
      <div className={styles.icon}>
        <ToolIcon name={tool.icon} />
      </div>
      <h3 className={styles.name}>{tool.name}</h3>
      <p className={styles.desc}>{tool.shortDescription}</p>
      {tool.status === 'coming-soon' && (
        <div className={styles.badgeWrapper}>
          <Badge variant="coming-soon">Coming Soon</Badge>
        </div>
      )}
    </Link>
  );
};

export default ToolCard;
