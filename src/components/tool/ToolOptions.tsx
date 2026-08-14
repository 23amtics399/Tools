import React from 'react';
import styles from './ToolOptions.module.css';
import { ToolOption } from '../../types/tool';
import { Slider } from '../ui/Slider';
import { Select } from '../ui/Select';
import { Toggle } from '../ui/Toggle';
import { TextInput } from '../ui/TextInput';

export const ToolOptions: React.FC<{ options: ToolOption[]; values: Record<string, any>; onChange: (v: Record<string, any>) => void }> = ({ options, values, onChange }) => (
  <div className={styles.container}>
    <h3 className={styles.title}>Options</h3>
    <div className={styles.grid}>
      {options.map(o => {
        const val = values[o.id] ?? o.defaultValue;
        const setVal = (newVal: any) => onChange({ ...values, [o.id]: newVal });
        return (
          <div key={o.id} className={styles.option}>
            {o.type === 'slider' && <Slider label={o.label} min={o.min!} max={o.max!} step={o.step!} value={val} onChange={setVal} />}
            {o.type === 'select' && <Select label={o.label} options={o.options!} value={val} onChange={setVal} />}
            {o.type === 'toggle' && <Toggle label={o.label} checked={val} onChange={setVal} />}
            {o.type === 'text' && <TextInput label={o.label} value={val} onChange={setVal} placeholder={o.placeholder} />}
            {o.description && <p className={styles.desc}>{o.description}</p>}
          </div>
        );
      })}
    </div>
  </div>
);

export default ToolOptions;
