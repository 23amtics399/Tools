import React, { useRef, useState } from 'react';
import styles from './FileUploadZone.module.css';

export const FileUploadZone: React.FC<{ onFiles: (f: File[]) => void; acceptedTypes: string[]; maxFiles: number; maxSizeMB: number; disabled?: boolean }> = ({ onFiles, acceptedTypes, maxFiles, maxSizeMB, disabled }) => {
  const [drag, setDrag] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDrag(false);
    if (!disabled && e.dataTransfer.files) onFiles(Array.from(e.dataTransfer.files));
  };

  return (
    <div
      className={`${styles.zone} ${drag ? styles.drag : ''} ${disabled ? styles.disabled : ''}`}
      onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={handleDrop}
      onClick={() => !disabled && inputRef.current?.click()}
    >
      <input ref={inputRef} type="file" multiple={maxFiles > 1} accept={acceptedTypes.join(',')} className={styles.input} onChange={e => { if (e.target.files) onFiles(Array.from(e.target.files)); }} />
      <div className={styles.icon}>☁️</div>
      <h3 className={styles.text}>Drop files here or click to upload</h3>
      <p className={styles.subtext}>Accepted: {acceptedTypes.join(', ')} (Max {maxSizeMB}MB)</p>
    </div>
  );
};

export default FileUploadZone;
