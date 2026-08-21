import React from 'react';
import styles from './FileList.module.css';
import { AppFile } from '../../types/file';
import { formatFileSize } from '../../lib/fileValidation';

export const FileList: React.FC<{ files: AppFile[]; onRemove: (id: string) => void }> = ({ files, onRemove }) => (
  <ul className={styles.list}>
    {files.map(f => (
      <li key={f.id} className={styles.item}>
        <div className={styles.info}>
          <span className={styles.name}>{f.name}</span>
          <span className={styles.size}>{formatFileSize(f.size)}</span>
        </div>
        <div className={styles.status}>
          {f.status === 'pending' ? 'READY' : f.status.toUpperCase()}
        </div>
        <button onClick={() => onRemove(f.id)} className={styles.remove}>×</button>
      </li>
    ))}
  </ul>
);

export default FileList;
