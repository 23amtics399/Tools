import React from 'react';
import { getToolById } from '../../../config/tools';
import { convertHeic } from '../../../processors/image/heicConverter';
import ToolPageLayout from '../../../components/tool/ToolPageLayout';
import { Select } from '../../../components/ui/Select';
import styles from './HeicConverter.module.css';

const tool = getToolById('heic-converter')!;

export default function HeicConverterPage() {
  const renderOptions = (options: Record<string, unknown>, setOptions: (opts: Record<string, unknown>) => void) => {
    const format = (options.format as string) || 'jpg';
    const quality = (options.quality as number) || 90;

    return (
      <div className={styles.container}>
        <div className={styles.optionGroup}>
          <Select
            label="Output Format"
            options={[
              { value: 'jpg', label: 'JPG' },
              { value: 'png', label: 'PNG' }
            ]}
            value={format}
            onChange={(val) => setOptions({ ...options, format: val })}
          />
        </div>

        {format === 'jpg' && (
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
          </div>
        )}
        {format === 'png' && (
          <p className={styles.infoText}>
            PNG is a lossless format and preserves transparency. The file size may be significantly larger than JPG.
          </p>
        )}
      </div>
    );
  };

  return <ToolPageLayout tool={tool} processorFn={convertHeic} renderOptions={renderOptions} />;
}
