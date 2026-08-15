import React, { useEffect, useState } from 'react';
import styles from './FilePreview.module.css';
import { AppFile } from '../../types/file';
import { FileIcon } from '../icons/IconRegistry';

export const FilePreview: React.FC<{ file: AppFile; maxHeight?: number }> = ({ file, maxHeight = 300 }) => {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (file.file.type.startsWith('image/')) {
      const objectUrl = URL.createObjectURL(file.file);
      setUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [file]);

  return (
    <div className={styles.container} style={{ maxHeight }}>
      {url ? (
        <img src={url} alt={file.name} className={styles.image} />
      ) : (
        <div className={styles.placeholder}>
          <span className={styles.icon}><FileIcon size={48} /></span>
          <span className={styles.name}>{file.name}</span>
        </div>
      )}
    </div>
  );
};

export default FilePreview;
