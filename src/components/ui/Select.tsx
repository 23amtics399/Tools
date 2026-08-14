import React from 'react';
import styles from './Select.module.css';

interface SelectProps {
  options: { label: string; value: string | number }[];
  value: string | number;
  onChange: (val: string | number) => void;
  label: string;
}
export const Select: React.FC<SelectProps> = ({ options, value, onChange, label }) => (
  <div className={styles.container}>
    <label className={styles.label}>{label}</label>
    <select className={styles.select} value={value} onChange={(e) => onChange(e.target.value)}>
      {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
    </select>
  </div>
);

export default Select;
