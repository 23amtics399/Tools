import React from 'react';
import SearchBar from './SearchBar';
import styles from './Hero.module.css';
import { InfoIcon, ProcessingIcon, SuccessIcon } from '../icons/IconRegistry';

interface HeroProps {
  onSearch: (query: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onSearch }) => (
  <section className={styles.hero}>
    <div className={styles.content}>
      <h1 className={styles.title}>Free Online Image & PDF Tools</h1>
      <p className={styles.subtitle}>Compress, resize, crop, convert and manage your files directly in your browser.</p>
      
      <div className={styles.searchWrapper}>
        <SearchBar onSearch={onSearch} />
      </div>

      <div className={styles.trustIndicators}>
        <span className={styles.indicator}>
          <span className={styles.icon}><InfoIcon size={16} /></span> Private
        </span>
        <span className={styles.dot}>·</span>
        <span className={styles.indicator}>
          <span className={styles.icon}><ProcessingIcon size={16} /></span> Fast
        </span>
        <span className={styles.dot}>·</span>
        <span className={styles.indicator}>
          <span className={styles.icon}><SuccessIcon size={16} /></span> Free
        </span>
      </div>
    </div>
    
    <div className={styles.orbs}>
      <div className={styles.orb1} />
      <div className={styles.orb2} />
    </div>
  </section>
);

export default Hero;
