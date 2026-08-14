import React, { useEffect, useState } from 'react';
import { getToolById } from '../../../config/tools';
import { resizeImage } from '../../../processors/image/resize';
import ToolPageLayout from '../../../components/tool/ToolPageLayout';
import { AppFile } from '../../../types/file';
import styles from './Resize.module.css';

const tool = getToolById('image-resize')!;

interface ResizeOptionsProps {
  options: Record<string, unknown>;
  setOptions: (opts: Record<string, unknown>) => void;
  files: AppFile[];
}

const ResizeOptions: React.FC<ResizeOptionsProps> = ({ options, setOptions, files }) => {
  const [originalDimensions, setOriginalDimensions] = useState<{ width: number; height: number } | null>(null);

  // Load first image dimensions if not loaded
  useEffect(() => {
    if (files.length > 0 && files[0].previewUrl && !originalDimensions) {
      const img = new Image();
      img.onload = () => {
        setOriginalDimensions({ width: img.width, height: img.height });
        // Initialize options if they aren't set yet
        if (!options.width && !options.height) {
          setOptions({ ...options, width: img.width, height: img.height, maintainAspectRatio: true });
        }
      };
      img.src = files[0].previewUrl;
    }
  }, [files, originalDimensions, options, setOptions]);

  const maintainAspectRatio = options.maintainAspectRatio !== false;
  const currentWidth = (options.width as number) || '';
  const currentHeight = (options.height as number) || '';

  const handleWidthChange = (val: string) => {
    const w = parseInt(val, 10);
    if (isNaN(w)) {
      setOptions({ ...options, width: '' });
      return;
    }
    const updates: Record<string, unknown> = { width: w };
    if (maintainAspectRatio && originalDimensions) {
      updates.height = Math.round((w / originalDimensions.width) * originalDimensions.height);
    }
    setOptions({ ...options, ...updates });
  };

  const handleHeightChange = (val: string) => {
    const h = parseInt(val, 10);
    if (isNaN(h)) {
      setOptions({ ...options, height: '' });
      return;
    }
    const updates: Record<string, unknown> = { height: h };
    if (maintainAspectRatio && originalDimensions) {
      updates.width = Math.round((h / originalDimensions.height) * originalDimensions.width);
    }
    setOptions({ ...options, ...updates });
  };

  return (
    <div className={styles.container}>
      {originalDimensions && (
        <div className={styles.originalSize}>
          Original size: <span>{originalDimensions.width} × {originalDimensions.height}</span>
        </div>
      )}

      <div className={styles.inputGroup}>
        <div className={styles.inputWrapper}>
          <label className={styles.label}>Width (px)</label>
          <input
            type="number"
            value={currentWidth}
            onChange={(e) => handleWidthChange(e.target.value)}
            className={styles.input}
            placeholder="Width"
          />
        </div>
        <div className={styles.multiplySign}>×</div>
        <div className={styles.inputWrapper}>
          <label className={styles.label}>Height (px)</label>
          <input
            type="number"
            value={currentHeight}
            onChange={(e) => handleHeightChange(e.target.value)}
            className={styles.input}
            placeholder="Height"
          />
        </div>
      </div>

      <label className={styles.checkboxWrapper}>
        <input
          type="checkbox"
          checked={maintainAspectRatio}
          onChange={(e) => setOptions({ ...options, maintainAspectRatio: e.target.checked })}
          className={styles.checkbox}
        />
        Maintain aspect ratio
      </label>
    </div>
  );
};

export default function ResizePage() {
  const renderOptions = (options: Record<string, unknown>, setOptions: (opts: Record<string, unknown>) => void, files: AppFile[]) => (
    <ResizeOptions options={options} setOptions={setOptions} files={files} />
  );

  return <ToolPageLayout tool={tool} processorFn={resizeImage} renderOptions={renderOptions} />;
}
