import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';
import styles from './Header.module.css';

export const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          <span className={styles.logoText}>Tools</span>
          <span className={styles.subtitle}>by sji.one</span>
        </Link>
        <nav className={`${styles.nav} ${isOpen ? styles.open : ''}`}>
          <Link to="/image" className={styles.link} onClick={() => setIsOpen(false)}>Image Tools</Link>
          <Link to="/pdf" className={styles.link} onClick={() => setIsOpen(false)}>PDF Tools</Link>
          <Link to="/tools" className={styles.link} onClick={() => setIsOpen(false)}>All Tools</Link>
        </nav>
        <div className={styles.controls}>
          <ThemeToggle />
          <button className={styles.menuBtn} onClick={() => setIsOpen(!isOpen)} aria-label="Menu">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              {isOpen ? <path d="M6 18L18 6M6 6l12 12" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
