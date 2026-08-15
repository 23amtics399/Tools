import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

export const Footer: React.FC = () => (
  <footer className={styles.footer}>
    <div className={styles.container}>
      <div className={styles.brand}>
        <h3>Tools by sji.one</h3>
        <p className={styles.tagline}>Made with &hearts; for privacy</p>
        <p className={styles.privacy}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
          All processing happens in your browser
        </p>
      </div>
      <div className={styles.links}>
        <Link to="/privacy">Privacy Policy</Link>
        <Link to="/about">About</Link>
        <a href="https://github.com" target="_blank" rel="noreferrer">GitHub</a>
      </div>
    </div>
  </footer>
);

export default Footer;
