import React from 'react';
import styles from './FileList.module.css';
import { AppFile } from '../../types/file';

export const FileList: React.FC<{ files: AppFile[]; onRemove: (id: string) => void }> = ({ files, onRemove }) => (
  <ul className={styles.list}>
    {files.map(f => (
      <li key={f.id} className={styles.item}>
        <div className={styles.info}>
          <span className={styles.name}>{f.name}</span>
          <span className={styles.size}>{(f.size / 1024 / 1024).toFixed(2)} MB</span>
        </div>
        <div className={styles.status}>{f.status}</div>
        <button onClick={() => onRemove(f.id)} className={styles.remove}>×</button>
      </li>
    ))}
  </ul>
);

export default FileList;
