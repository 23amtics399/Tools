import React from 'react';
import { InfoIcon } from '../icons/IconRegistry';

export const PrivacyNotice: React.FC<{ show: boolean }> = ({ show }) => {
  if (!show) return null;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'rgba(52,211,153,0.1)', border: '1px solid var(--color-success)', borderRadius: 'var(--radius-md)', color: 'var(--color-success)', marginTop: '2rem' }}>
      <span><InfoIcon size={20} /></span>
      <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Your files are processed locally in your browser and are not uploaded to our servers.</span>
    </div>
  );
};

export default PrivacyNotice;
