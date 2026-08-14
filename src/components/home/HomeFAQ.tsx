import React, { useState } from 'react';
import styles from './HomeFAQ.module.css';

const faqs = [
  { q: "Is it really free?", a: "Yes, completely free with no limits." },
  { q: "Are my files safe?", a: "100% safe. Files never leave your browser." }
];

export const HomeFAQ: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Frequently Asked Questions</h2>
      <div className={styles.list}>
        {faqs.map((f, i) => (
          <div key={i} className={`${styles.item} ${openIdx === i ? styles.open : ''}`}>
            <button className={styles.q} onClick={() => setOpenIdx(openIdx === i ? null : i)}>
              {f.q}
              <span className={styles.icon}>+</span>
            </button>
            <div className={styles.a}><div className={styles.aInner}>{f.a}</div></div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HomeFAQ;
