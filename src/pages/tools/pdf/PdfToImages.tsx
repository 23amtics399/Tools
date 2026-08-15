import React, { useState, useEffect } from 'react';
import { getToolById } from '../../../config/tools';
import { convertPdfToImages } from '../../../processors/pdf/pdfToImages';
import ToolPageLayout from '../../../components/tool/ToolPageLayout';
import { ProcessorResult, AppFile } from '../../../types/file';
import { downloadFile } from '../../../lib/downloadHelper';
import { SuccessIcon, ProcessingIcon, DownloadAllIcon, ViewIcon, DownloadIcon, CloseIcon } from '../../../components/icons/IconRegistry';
import styles from './PdfToImages.module.css';

const tool = getToolById('pdf-to-images')!;

export default function PdfToImagesPage() {
  const [viewingImage, setViewingImage] = useState<string | null>(null);
  const [isZipping, setIsZipping] = useState(false);

  // Close modal on escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setViewingImage(null);
    };
    if (viewingImage) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [viewingImage]);

  const handleDownloadAll = async (pages: Array<{ file: File; previewUrl: string; fileName: string }>) => {
    try {
      setIsZipping(true);
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();

      pages.forEach(page => {
        zip.file(page.fileName, page.file);
      });

      const content = await zip.generateAsync({ type: 'blob' });
      downloadFile(content, 'pdf-pages.zip');
    } catch (err) {
      console.error('Failed to zip files:', err);
      alert('Failed to generate ZIP file.');
    } finally {
      setIsZipping(false);
    }
  };

  const customResult = (results: ProcessorResult[], files: AppFile[]) => {
    if (results.length === 0) return null;
    const allPages = results[0].metadata?.allPages as Array<{ file: File; previewUrl: string; fileName: string }> || [];
    
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <p className={styles.successMessage}>
            <SuccessIcon size={20} style={{ display: 'inline-block', verticalAlign: 'text-bottom', marginRight: '6px' }} />
            PDF converted successfully
          </p>
          <button
            className={styles.downloadAllBtn}
            onClick={() => handleDownloadAll(allPages)}
            disabled={isZipping}
          >
            {isZipping ? (
              <><ProcessingIcon size={16} style={{ display: 'inline-block', verticalAlign: 'text-bottom', marginRight: '6px' }} /> Zipping...</>
            ) : (
              <><DownloadAllIcon size={16} style={{ display: 'inline-block', verticalAlign: 'text-bottom', marginRight: '6px' }} /> Download All ({allPages.length} images)</>
            )}
          </button>
        </div>

        <div className={styles.grid}>
          {allPages.map((page, i) => (
            <div key={i} className={styles.pageCard}>
              <div className={styles.imageContainer}>
                <img src={page.previewUrl} alt={`Page ${i + 1}`} className={styles.pageImage} />
              </div>
              <p className={styles.pageLabel}>Page {i + 1}</p>
              <div className={styles.actions}>
                <button
                  className={styles.actionBtn}
                  onClick={() => setViewingImage(page.previewUrl)}
                >
                  <ViewIcon size={16} style={{ display: 'inline-block', verticalAlign: 'text-bottom', marginRight: '4px' }} /> View
                </button>
                <a
                  href={page.previewUrl}
                  download={page.fileName}
                  className={styles.actionLink}
                >
                  <DownloadIcon size={16} style={{ display: 'inline-block', verticalAlign: 'text-bottom', marginRight: '4px' }} /> DL
                </a>
              </div>
            </div>
          ))}
        </div>

        {viewingImage && (
          <div className={styles.modalBackdrop} onClick={() => setViewingImage(null)}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
              <button className={styles.modalClose} onClick={() => setViewingImage(null)}>
                <CloseIcon size={24} />
              </button>
              <img src={viewingImage} alt="Full resolution" className={styles.modalImage} />
            </div>
          </div>
        )}
      </div>
    );
  };

  return <ToolPageLayout tool={tool} processorFn={convertPdfToImages} renderCustomResult={customResult} />;
}
