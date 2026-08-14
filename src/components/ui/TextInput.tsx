import React from 'react';
import styles from './TextInput.module.css';

interface TextInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export const TextInput: React.FC<TextInputProps> = ({ label, value, onChange, ...props }) => (
  <div className={styles.container}>
    <label className={styles.label}>{label}</label>
    <input
      type="text"
      className={styles.input}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      {...props}
    />
  </div>
);

export default TextInput;
