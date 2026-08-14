import React from 'react';
import styles from './ErrorMessage.module.css';
import { Button } from './Button';

export const ErrorMessage: React.FC<{ message: string; onRetry?: () => void }> = ({ message, onRetry }) => (
  <div className={styles.container}>
    <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    <span className={styles.message}>{message}</span>
    {onRetry && <Button variant="secondary" size="sm" onClick={onRetry}>Retry</Button>}
  </div>
);

export default ErrorMessage;
