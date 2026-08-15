import React from 'react';
import styles from './PrivacyBanner.module.css';
import { InfoIcon, ProcessingIcon, SuccessIcon } from '../icons/IconRegistry';

export const PrivacyBanner: React.FC = () => (
  <section className={styles.section}>
    <div className={styles.grid}>
      <div className={styles.card}>
        <div className={styles.icon}><InfoIcon size={32} /></div>
        <h3>100% Private</h3>
        <p>All processing happens locally in your browser. Your files are never uploaded.</p>
      </div>
      <div className={styles.card}>
        <div className={styles.icon}><ProcessingIcon size={32} /></div>
        <h3>Lightning Fast</h3>
        <p>No upload or download wait times. Processing uses your device's power.</p>
      </div>
      <div className={styles.card}>
        <div className={styles.icon}><SuccessIcon size={32} /></div>
        <h3>Free Forever</h3>
        <p>No hidden fees, no watermarks, no subscriptions. Just free tools.</p>
      </div>
    </div>
  </section>
);

export default PrivacyBanner;
