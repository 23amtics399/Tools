import React from 'react';
import styles from './Slider.module.css';

interface SliderProps {
  min: number; max: number; step?: number; value: number;
  onChange: (val: number) => void; label: string;
}
export const Slider: React.FC<SliderProps> = ({ min, max, step = 1, value, onChange, label }) => (
  <div className={styles.container}>
    <div className={styles.header}>
      <label className={styles.label}>{label}</label>
      <span className={styles.value}>{value}</span>
    </div>
    <input
      type="range"
      className={styles.slider}
      min={min} max={max} step={step} value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
    />
  </div>
);

export default Slider;
