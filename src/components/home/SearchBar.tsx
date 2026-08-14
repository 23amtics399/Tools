import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './SearchBar.module.css';
import { ToolDefinition } from '../../types/tool';

interface SearchBarProps { onSearch?: (q: string) => void; results?: ToolDefinition[]; }

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, results = [] }) => {
  const [query, setQuery] = useState('');
  useEffect(() => {
    const t = setTimeout(() => { if (onSearch) onSearch(query); }, 300);
    return () => clearTimeout(t);
  }, [query, onSearch]);

  return (
    <div className={styles.container}>
      <div className={styles.inputWrapper}>
        <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text" className={styles.input} placeholder="Search for tools..."
          value={query} onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      {query && results.length > 0 && (
        <div className={styles.dropdown}>
          {results.map(r => (
            <Link to={r.path} key={r.id} className={styles.resultItem}>
              <span className={styles.resultIcon}>{r.icon}</span>
              <div>
                <div className={styles.resultName}>{r.name}</div>
                <div className={styles.resultDesc}>{r.shortDescription}</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
