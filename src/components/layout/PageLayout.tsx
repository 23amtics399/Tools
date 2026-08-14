import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import styles from './PageLayout.module.css';

export const PageLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className={styles.wrapper}>
    <Header />
    <main className={styles.main}>{children}</main>
    <Footer />
  </div>
);

export default PageLayout;
