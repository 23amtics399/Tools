import React from 'react';
import styles from './FileList.module.css';
import { AppFile } from '../../types/file';
import { formatFileSize } from '../../lib/fileValidation';

import { DeleteIcon, ProcessingIcon, SuccessIcon, ErrorIcon } from '../icons/IconRegistry';

export const FileList: React.FC<{ files: AppFile[]; onRemove: (id: string) => void }> = ({ files, onRemove }) => (
  <ul className={styles.list}>
    {files.map(f => (
      <li key={f.id} className={styles.item}>
        <div className={styles.info}>
          <span className={styles.name}>{f.name}</span>
          <span className={styles.size}>{formatFileSize(f.size)}</span>
        </div>
        <div className={styles.status}>
          {f.status === 'pending' && 'READY'}
          {f.status === 'processing' && <span style={{display: 'flex', alignItems: 'center', gap: '4px'}}><ProcessingIcon size={14} /> PROCESSING</span>}
          {f.status === 'completed' && <span style={{display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-success)'}}><SuccessIcon size={14} /> COMPLETED</span>}
          {f.status === 'error' && <span style={{display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-error)'}}><ErrorIcon size={14} /> ERROR</span>}
        </div>
        <button onClick={() => onRemove(f.id)} className={styles.remove} aria-label="Remove file"><DeleteIcon size={16} /></button>
      </li>
    ))}
  </ul>
);

export default FileList;
