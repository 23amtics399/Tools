import React from 'react';
import styles from './ResultCard.module.css';
import { ProcessorResult, AppFile } from '../../types/file';
import { Button } from '../ui/Button';

export const ResultCard: React.FC<{ result: ProcessorResult; originalFile: AppFile }> = ({ result, originalFile }) => (
  <div className={styles.card}>
    <div className={styles.info}>
      <h4 className={styles.name}>{result.fileName}</h4>
      <p className={styles.sizes}>
        {(result.originalSize / 1024).toFixed(1)} KB → {(result.processedSize / 1024).toFixed(1)} KB
        {result.originalSize > result.processedSize && (
          <span className="ml-2 text-green-500 font-medium">
            (-{Math.round(((result.originalSize - result.processedSize) / result.originalSize) * 100)}%)
          </span>
        )}
      </p>
    </div>
    <a href={URL.createObjectURL(result.file)} download={result.fileName} className={styles.download}>
      <Button size="sm">Download</Button>
    </a>
  </div>
);

export default ResultCard;
