import React, { useState, useCallback, useRef } from 'react';
import ToolPageLayout from '../../../components/tool/ToolPageLayout';
import { FileUploadZone } from '../../../components/tool/FileUploadZone';
import { ProcessButton } from '../../../components/tool/ProcessButton';
import { Button } from '../../../components/ui/Button';
import { useToolConfig } from '../../../hooks/useToolConfig';
import { useFileUpload } from '../../../hooks/useFileUpload';
import { mergePdfs } from '../../../processors';
import { AppFile } from '../../../types/file';
import styles from './Merge.module.css';

export default function MergePdf() {
  const tool = useToolConfig('merge');
  const { files, addFiles, removeFile, clearFiles, error: uploadError, setFiles } = useFileUpload(tool!);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processProgress, setProcessProgress] = useState(0);
  const [result, setResult] = useState<ProcessorResult | null>(null);
  const [processError, setProcessError] = useState<string | null>(null);

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  if (!tool) return null;

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    // Small delay to allow CSS class to apply before drag image is taken
    setTimeout(() => {
      if (e.target instanceof HTMLElement) {
        e.target.classList.add(styles.dragging);
      }
    }, 0);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (draggedIndex === null || draggedIndex === index) return;
    setDragOverIndex(index);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    setFiles((prev: AppFile[]) => {
      const newFiles = [...prev];
      const draggedItem = newFiles[draggedIndex];
      newFiles.splice(draggedIndex, 1);
      newFiles.splice(dropIndex, 0, draggedItem);
      return newFiles;
    });

    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    if (e.target instanceof HTMLElement) {
      e.target.classList.remove(styles.dragging);
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    setFiles((prev: AppFile[]) => {
      const newFiles = [...prev];
      const temp = newFiles[index];
      newFiles[index] = newFiles[index - 1];
      newFiles[index - 1] = temp;
      return newFiles;
    });
  };

  const moveDown = (index: number) => {
    if (index === files.length - 1) return;
    setFiles((prev: AppFile[]) => {
      const newFiles = [...prev];
      const temp = newFiles[index];
      newFiles[index] = newFiles[index + 1];
      newFiles[index + 1] = temp;
      return newFiles;
    });
  };

  const handleMerge = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    setProcessError(null);
    setProcessProgress(0);
    
    try {
      const res = await mergePdfs(files, {}, (progress) => {
        setProcessProgress(Math.round(progress));
      });
      setResult(res);
    } catch (err) {
      setProcessError(err instanceof Error ? err.message : 'An error occurred during merge');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    clearFiles();
    if (result && result.previewUrl) {
      URL.revokeObjectURL(result.previewUrl);
    }
    setResult(null);
    setProcessError(null);
    setProcessProgress(0);
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddMore = () => {
    fileInputRef.current?.click();
  };

  const handleMoreFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(e.target.files);
    }
    // Reset input so the same files can be selected again if needed
    e.target.value = '';
  };

  return (
    <ToolPageLayout tool={tool}>
      {files.length === 0 && !result && (
        <>
          <FileUploadZone 
            onFiles={addFiles}
            acceptedTypes={tool.acceptedTypes}
            maxFiles={tool.maxFiles}
            maxSizeMB={tool.maxFileSizeMB}
            disabled={isProcessing}
          />
          {uploadError && (
            <div style={{ color: '#ef4444', marginTop: '1rem', padding: '1rem', backgroundColor: '#fee2e2', borderRadius: '8px' }}>
              {uploadError}
            </div>
          )}
        </>
      )}

      {files.length > 0 && !result && (
        <div>
          <ul className={styles.list}>
            {files.map((f, index) => (
              <li 
                key={f.id} 
                className={`${styles.item} ${dragOverIndex === index ? styles.dragOver : ''}`}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={handleDragEnd}
              >
                <div className={styles.dragHandle} title="Drag to reorder">
                  ↕
                </div>
                <div className={styles.icon}>📄</div>
                <div className={styles.info}>
                  <div className={styles.name}>{f.name}</div>
                  <div className={styles.meta}>
                    <span>{(f.size / 1024 / 1024).toFixed(2)} MB</span>
                  </div>
                </div>
                <div className={styles.controls}>
                  <button 
                    type="button"
                    className={styles.moveBtn} 
                    onClick={() => moveUp(index)}
                    disabled={index === 0}
                    title="Move Up"
                  >
                    ↑
                  </button>
                  <button 
                    type="button"
                    className={styles.moveBtn} 
                    onClick={() => moveDown(index)}
                    disabled={index === files.length - 1}
                    title="Move Down"
                  >
                    ↓
                  </button>
                  <button 
                    type="button"
                    className={styles.removeBtn} 
                    onClick={() => removeFile(f.id)}
                    title="Remove"
                  >
                    ×
                  </button>
                </div>
              </li>
            ))}
          </ul>
          
          <div className={styles.addMore}>
            <input 
              type="file" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              multiple 
              accept={tool.acceptedTypes.join(',')}
              onChange={handleMoreFilesChange}
            />
            <Button variant="secondary" onClick={handleAddMore}>
              + Add More PDFs
            </Button>
          </div>

          <ProcessButton
            onClick={handleMerge}
            loading={isProcessing}
            disabled={files.length === 0 || isProcessing}
            label={isProcessing ? `Merging PDFs... ${processProgress}%` : `Merge PDF${files.length !== 1 ? 's' : ''}`}
          />
          
          {processError && (
            <div style={{ color: 'var(--color-error)', marginTop: '1rem', padding: '1rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px' }}>
              {processError}
            </div>
          )}
          {uploadError && (
            <div style={{ color: 'var(--color-error)', marginTop: '1rem', padding: '1rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px' }}>
              {uploadError}
            </div>
          )}
        </div>
      )}

      {result && (
        <div style={{ padding: '2rem', textAlign: 'center', backgroundColor: 'var(--color-elevated)', borderRadius: '12px', marginTop: '2rem', border: '1px solid var(--color-border)' }}>
          <h3 style={{ marginBottom: '1rem', color: 'var(--color-text)' }}>Merge Complete!</h3>
          <p style={{ marginBottom: '1.5rem', color: 'var(--color-muted)' }}>
            {result.fileName} ({(result.processedSize / 1024 / 1024).toFixed(2)} MB)
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <a 
              href={URL.createObjectURL(result.file)} 
              download={result.fileName}
            >
              <Button>Download Merged PDF</Button>
            </a>
            <Button variant="secondary" onClick={handleReset}>Merge Another Set</Button>
          </div>
        </div>
      )}
    </ToolPageLayout>
  );
}
