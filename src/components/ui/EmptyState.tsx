import React from 'react';
import styles from './EmptyState.module.css';

export const EmptyState: React.FC<{ icon?: React.ReactNode; title: string; description?: string }> = ({ icon, title, description }) => (
  <div className={styles.container}>
    {icon && <div className={styles.icon}>{icon}</div>}
    <h3 className={styles.title}>{title}</h3>
    {description && <p className={styles.description}>{description}</p>}
  </div>
);

export default EmptyState;
