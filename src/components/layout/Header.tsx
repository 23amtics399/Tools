import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';
import { ToolsBySJILogo } from '../icons/ToolsBySJILogo';
import { MenuIcon, CloseIcon } from '../icons/IconRegistry';
import styles from './Header.module.css';

export const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/tools' && location.pathname === '/') return true;
    if (path === '/tools' && location.pathname === '/tools') return true;
    if (path !== '/tools' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          <ToolsBySJILogo />
        </Link>
        <nav className={`${styles.nav} ${isOpen ? styles.open : ''}`}>
          <Link to="/tools" className={`${styles.link} ${isActive('/tools') ? styles.active : ''}`} onClick={() => setIsOpen(false)}>All Tools</Link>
          <Link to="/pdf" className={`${styles.link} ${isActive('/pdf') ? styles.active : ''}`} onClick={() => setIsOpen(false)}>PDF Tools</Link>
          <Link to="/image" className={`${styles.link} ${isActive('/image') ? styles.active : ''}`} onClick={() => setIsOpen(false)}>Image Tools</Link>
        </nav>
        <div className={styles.controls}>
          <ThemeToggle />
          <button className={styles.menuBtn} onClick={() => setIsOpen(!isOpen)} aria-label="Menu">
             {isOpen ? <CloseIcon size={24} /> : <MenuIcon size={24} />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
