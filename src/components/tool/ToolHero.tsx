import React from 'react';
import { Link } from 'react-router-dom';
import styles from './ToolHero.module.css';
import { ToolDefinition } from '../../types/tool';
import { Badge } from '../ui/Badge';

export const ToolHero: React.FC<{ tool: ToolDefinition }> = ({ tool }) => (
  <div className={styles.hero}>
    <div className={styles.breadcrumbs}>
      <Link to="/">Home</Link> / <Link to={`/${tool.category}`}>{tool.category.charAt(0).toUpperCase() + tool.category.slice(1)}</Link> / <span>{tool.name}</span>
    </div>
    <div className={styles.header}>
      <span className={styles.icon}>{tool.icon}</span>
      <h1 className={styles.title}>{tool.name}</h1>
      <Badge variant="info">{tool.category.toUpperCase()}</Badge>
    </div>
    <p className={styles.desc}>{tool.description}</p>
  </div>
);

export default ToolHero;
