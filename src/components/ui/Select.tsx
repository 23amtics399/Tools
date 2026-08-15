import React, { useState, useRef, useEffect } from 'react';
import styles from './Select.module.css';

interface SelectProps {
  options: { label: string; value: string | number }[];
  value: string | number;
  onChange: (val: string | number) => void;
  label?: string;
}

export const Select: React.FC<SelectProps> = ({ options, value, onChange, label }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const selectedOption = options.find(opt => opt.value === value) || options[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      return;
    }
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!isOpen) setIsOpen(true);
      setFocusedIndex(prev => (prev < options.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!isOpen) setIsOpen(true);
      setFocusedIndex(prev => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (isOpen && focusedIndex >= 0) {
        onChange(options[focusedIndex].value);
        setIsOpen(false);
      } else {
        setIsOpen(!isOpen);
        if (!isOpen) {
          setFocusedIndex(options.findIndex(opt => opt.value === value));
        }
      }
    }
  };

  const toggleOpen = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setFocusedIndex(options.findIndex(opt => opt.value === value));
    }
  };

  const handleOptionClick = (optValue: string | number) => {
    onChange(optValue);
    setIsOpen(false);
  };

  return (
    <div className={styles.container} ref={containerRef}>
      {label && <label className={styles.label}>{label}</label>}
      <div className={styles.selectWrapper}>
        <button
          type="button"
          className={`${styles.trigger} ${isOpen ? styles.open : ''}`}
          onClick={toggleOpen}
          onKeyDown={handleKeyDown}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <span className={styles.triggerText}>{selectedOption?.label}</span>
          <span className={styles.arrow}>▼</span>
        </button>
        
        {isOpen && (
          <ul className={styles.optionsList} role="listbox">
            {options.map((opt, idx) => (
              <li
                key={opt.value}
                role="option"
                aria-selected={opt.value === value}
                className={`${styles.option} ${opt.value === value ? styles.selected : ''} ${focusedIndex === idx ? styles.focused : ''}`}
                onClick={() => handleOptionClick(opt.value)}
                onMouseMove={() => {
                  if (focusedIndex !== idx) setFocusedIndex(idx);
                }}
              >
                {opt.label}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Select;
