import React from 'react';
import { Button } from '../ui/Button';
export const ProcessButton: React.FC<{ label: string; onClick: () => void; disabled?: boolean; loading?: boolean }> = ({ label, onClick, disabled, loading }) => (
  <Button size="lg" onClick={onClick} disabled={disabled} loading={loading} style={{ width: '100%' }}>{label}</Button>
);

export default ProcessButton;
