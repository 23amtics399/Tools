import React from 'react';
import styles from './Toggle.module.css';

export const Toggle: React.FC<{ checked: boolean; onChange: (c: boolean) => void; label: string }> = ({ checked, onChange, label }) => (
  <label className={styles.container}>
    <span className={styles.label}>{label}</span>
    <div className={`${styles.switch} ${checked ? styles.checked : ''}`}>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className={styles.input} />
      <span className={styles.thumb} />
    </div>
  </label>
);

export default Toggle;
