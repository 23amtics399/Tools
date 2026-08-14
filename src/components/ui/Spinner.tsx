import React from 'react';
import styles from './Spinner.module.css';

export const Spinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  return <div className={`${styles.spinner} ${styles[size]}`} aria-label="Loading" />;
};

export default Spinner;
