import React from 'react';
import { getToolById } from '../../../config/tools';
import { compressImage } from '../../../processors/image/compress';
import ToolPageLayout from '../../../components/tool/ToolPageLayout';
import styles from './Compress.module.css';

const tool = getToolById('image-compress')!;

export default function CompressPage() {
  const renderOptions = (options: Record<string, unknown>, setOptions: (opts: Record<string, unknown>) => void) => {
    const format = (options.outputFormat as string) || 'keep';
    const quality = (options.quality as number) || 80;

    return (
      <div className={styles.container}>
        <div className={styles.optionGroup}>
          <label className={styles.label}>
            Output Format
          </label>
          <div className={styles.formatButtons}>
            {['keep', 'image/jpeg', 'image/webp', 'image/png'].map((f) => (
              <button
                key={f}
                onClick={() => setOptions({ ...options, outputFormat: f })}
                className={`${styles.formatButton} ${format === f ? styles.formatButtonActive : ''}`}
              >
                {f === 'keep' ? 'Keep Original' : f.split('/')[1].toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.optionGroup}>
          <div className={styles.qualityHeader}>
            <label className={styles.label}>
              Quality: {quality}
            </label>
            <span className={styles.qualityHint}>
              {quality > 80 ? 'High' : quality > 50 ? 'Medium' : 'Low'}
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="100"
            step="1"
            value={quality}
            onChange={(e) => setOptions({ ...options, quality: parseInt(e.target.value, 10) })}
            className={styles.slider}
          />
          {(format === 'image/png' || format === 'keep') && (
            <p className={styles.warningText}>
              Note: Lowering quality on PNG files may not significantly reduce file size since PNG is lossless. Choose WebP or JPG for maximum compression.
            </p>
          )}
        </div>
      </div>
    );
  };

  return <ToolPageLayout tool={tool} processorFn={compressImage} renderOptions={renderOptions} />;
}

