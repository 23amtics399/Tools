import React from 'react';
import styles from './ProgressBar.module.css';

export const ProgressBar: React.FC<{ progress: number; label?: string }> = ({ progress, label }) => (
  <div className={styles.container}>
    {label && <div className={styles.label}>{label} <span>{Math.round(progress)}%</span></div>}
    <div className={styles.track}>
      <div className={styles.fill} style={{ width: `${progress}%` }} />
    </div>
  </div>
);

export default ProgressBar;
