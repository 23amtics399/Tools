import React, { useState, useEffect } from 'react';
import ToolPageLayout from '../../../components/tool/ToolPageLayout';
import { FileUploadZone } from '../../../components/tool/FileUploadZone';
import { ProcessButton } from '../../../components/tool/ProcessButton';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { useFileUpload } from '../../../hooks/useFileUpload';
import { useProcessing } from '../../../hooks/useProcessing';
import { useToolConfig } from '../../../hooks/useToolConfig';
import { numberPdfPages } from '../../../processors/pdf/pageNumbering';
import { downloadFile } from '../../../lib/downloadHelper';
import { FileIcon, CloseIcon } from '../../../components/icons/IconRegistry';
import type { PDFDocumentProxy } from 'pdfjs-dist';
import { PdfThumbnail } from '../../../components/tool/PdfThumbnail';
import { PdfCustomPositionEditor } from '../../../components/tool/PdfCustomPositionEditor';
import { parseRanges, getFontSizeForOption, getMarginForOption, calculateVisualPosition } from '../../../processors/pdf/utils';
import { formatFileSize } from '../../../lib/fileValidation';
import styles from './PageNumbering.module.css';

export const PageNumbering: React.FC = () => {
  const tool = useToolConfig();
  const { files, setFiles, error: uploadError, addFiles, removeFile, clearFiles } = useFileUpload(tool!);
  const { processingState, processFiles, results, resetProcessing } = useProcessing();

  const [pages, setPages] = useState('');
  const [position, setPosition] = useState('bottom-center');
  const [format, setFormat] = useState('1');
  const [startingNumber, setStartingNumber] = useState('1');
  const [fontSize, setFontSize] = useState('medium');
  const [margin, setMargin] = useState('medium');
  const [validationError, setValidationError] = useState<string | null>(null);

  const [pdfProxy, setPdfProxy] = useState<PDFDocumentProxy | null>(null);
  const [pageCount, setPageCount] = useState<number | null>(null);
  const loadingTaskRef = React.useRef<any>(null);

  const [lastValidPreviewPage, setLastValidPreviewPage] = useState(1);
  const [previewData, setPreviewData] = useState({ text: '1', total: 1, valid: true });
  const [previewDims, setPreviewDims] = useState<{w: number, h: number} | null>(null);

  const [customPosition, setCustomPosition] = useState<{ x: number; y: number } | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  // Validate starting number
  useEffect(() => {
    const val = parseInt(startingNumber, 10);
    if (isNaN(val) || val < 0 || startingNumber.trim() === '') {
      setValidationError('Starting number must be a valid positive integer or 0.');
    } else {
      setValidationError(null);
    }
  }, [startingNumber]);

  // Load PDF proxy
  useEffect(() => {
    if (files.length > 0 && files[0].file) {
      let isCancelled = false;
      files[0].file.arrayBuffer().then(buffer => {
        import('pdfjs-dist').then(async (pdfjs) => {
          if (isCancelled) return;
          const workerUrl = (await import('pdfjs-dist/build/pdf.worker.min.mjs?url')).default;
          pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;
          
          const loadingTask = pdfjs.getDocument({ data: buffer });
          loadingTaskRef.current = loadingTask;
          loadingTask.promise.then(pdf => {
            if (!isCancelled) {
              setPdfProxy(pdf);
              setPageCount(pdf.numPages);
            }
          }).catch(err => {
            if (err?.name !== 'AbortException') {
              console.error('Error loading PDF proxy:', err);
            }
          });
        }).catch(err => console.error('Error loading pdfjs-dist worker:', err));
      }).catch(err => console.error('Error getting array buffer:', err));
      
      return () => {
        isCancelled = true;
        if (loadingTaskRef.current) {
          try {
            loadingTaskRef.current.destroy();
          } catch (e) { }
          loadingTaskRef.current = null;
        }
      };
    } else {
      setPdfProxy(null);
      setPageCount(null);
      if (loadingTaskRef.current) {
        try { loadingTaskRef.current.destroy(); } catch (e) {}
        loadingTaskRef.current = null;
      }
    }
  }, [files]);

  // Compute preview data
  useEffect(() => {
    if (!pageCount) return;
    
    let selectedPages: number[] = [];
    try {
      selectedPages = parseRanges(pages, pageCount);
      
      let targetPage = selectedPages.length > 0 ? selectedPages[0] : 1;
      setLastValidPreviewPage(targetPage);
      
      const startNum = parseInt(startingNumber, 10);
      const num = isNaN(startNum) ? 1 : startNum;
      const totalSelected = selectedPages.length;
      
      let text = String(num);
      if (format === 'Page 1') {
        text = `Page ${num}`;
      } else if (format === 'Page 1 of X') {
        text = `Page ${num} of ${totalSelected}`;
      }

      setPreviewData({ text, total: totalSelected, valid: true });
    } catch (e) {
      setPreviewData(prev => ({ ...prev, valid: false }));
    }
  }, [pages, pageCount, startingNumber, format]);
  
  const handleProcess = async () => {
    if (files.length === 0) return;
    if (validationError) return;
    
    await processFiles(
      files,
      numberPdfPages,
      {
        pages,
        position,
        customPosition: position === 'custom' && customPosition ? customPosition : undefined,
        format,
        startingNumber,
        fontSize,
        margin
      },
      (id, updates) => {
        setFiles(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f));
      }
    );
  };

  const handleDownload = () => {
    if (files.length === 0) return;
    const result = results.get(files[0].id);
    if (result) {
      downloadFile(result.file, result.fileName);
    }
  };

  const handleReset = () => {
    clearFiles();
    resetProcessing();
    setPages('');
  };

  if (!tool) return null;

  const file = files[0];
  const result = file ? results.get(file.id) : null;
  const isProcessing = processingState.isProcessing;

  const renderPositionSelector = () => {
    return (
      <div className={styles.formGroup}>
        <label className={styles.label}>Position</label>
        <Select
          value={position}
          onChange={(val) => {
            setPosition(val as string);
            if (val === 'custom') {
              setIsEditorOpen(true);
            }
          }}
          options={[
            { label: 'Top Left', value: 'top-left' },
            { label: 'Top Center', value: 'top-center' },
            { label: 'Top Right', value: 'top-right' },
            { label: 'Middle Left', value: 'middle-left' },
            { label: 'Center', value: 'center' },
            { label: 'Middle Right', value: 'middle-right' },
            { label: 'Bottom Left', value: 'bottom-left' },
            { label: 'Bottom Center', value: 'bottom-center' },
            { label: 'Bottom Right', value: 'bottom-right' },
            { label: 'Custom', value: 'custom' },
          ]}
        />
        {position === 'custom' && customPosition && (
          <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--color-muted)' }}>
            Custom position (X: {Math.round(customPosition.x * 100)}%, Y: {Math.round(customPosition.y * 100)}%)
          </div>
        )}
      </div>
    );
  };

  const renderPdfPreview = () => {
    if (!pdfProxy) {
      return (
        <div className={styles.formGroup}>
          <label className={styles.label}>Preview</label>
          <div className={styles.previewContainer}>
             <div className={styles.previewPlaceholder} style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-muted)' }}>
               Loading PDF preview...
             </div>
          </div>
        </div>
      );
    }

    const text = previewData.text;
    const pdfFontSize = getFontSizeForOption(fontSize);
    const pdfMargin = getMarginForOption(margin);
    
    // Approximate width of standard helvetica text: 0.55 * fontSize * numChars
    const pdfTextWidth = text.length * pdfFontSize * 0.55; 
    const pdfTextHeight = pdfFontSize; // standard leading/height is ~1x fontSize

    return (
      <div className={styles.formGroup}>
        <label className={styles.label}>
          Preview
          <span style={{ fontSize: '0.75rem', fontWeight: 'normal', color: 'var(--color-muted)', marginLeft: '0.5rem' }}>
            (Click to {position === 'custom' ? 'edit' : 'set custom'} position)
          </span>
        </label>
        <div className={styles.previewContainer} onClick={() => setIsEditorOpen(true)} style={{ cursor: 'pointer', transition: 'opacity 0.2s' }} onMouseOver={e => e.currentTarget.style.opacity = '0.8'} onMouseOut={e => e.currentTarget.style.opacity = '1'}>
          <PdfThumbnail 
            pdf={pdfProxy} 
            pageIndex={lastValidPreviewPage}
            mode="preview"
            width={280}
            onRender={setPreviewDims}
          >
            {previewDims && (
              <div
                style={{
                  position: 'absolute',
                  bottom: `calc(var(--pdf-scale) * ${calculateVisualPosition(position, previewDims.w, previewDims.h, pdfTextWidth, pdfTextHeight, pdfMargin, position === 'custom' && customPosition ? customPosition : undefined).vy}px)`,
                  left: `calc(var(--pdf-scale) * ${calculateVisualPosition(position, previewDims.w, previewDims.h, pdfTextWidth, pdfTextHeight, pdfMargin, position === 'custom' && customPosition ? customPosition : undefined).vx}px)`,
                  fontSize: `calc(var(--pdf-scale) * ${pdfFontSize}px)`,
                  color: 'black',
                  fontFamily: 'Helvetica, Arial, sans-serif',
                  whiteSpace: 'nowrap'
                }}
              >
                {text}
              </div>
            )}
          </PdfThumbnail>
        </div>
      </div>
    );
  };

  return (
    <ToolPageLayout tool={tool} isResultView={!!result}>
      <div className={styles.container}>
        {!file && (
          <FileUploadZone
            onFiles={addFiles}
            acceptedTypes={tool.acceptedTypes}
            maxFiles={tool.maxFiles}
            maxSizeMB={tool.maxFileSizeMB}
            disabled={isProcessing}
          />
        )}
        
        {!file && uploadError && (
          <div className={styles.error}>{uploadError}</div>
        )}

        {file && !result && (
          <>
            <div className={styles.fileCard}>
              <div className={styles.fileInfo}>
                <div className={styles.fileIcon}>
                  <FileIcon />
                </div>
                <div>
                  <div className={styles.fileName}>{file.name}</div>
                  <div className={styles.fileMeta}>
                    {formatFileSize(file.size)}
                    {!!file.result?.metadata?.pageCount && ` • ${String(file.result.metadata.pageCount)} pages`}
                  </div>
                </div>
              </div>
              <button 
                onClick={() => removeFile(file.id)}
                className={styles.changeFileBtn}
                disabled={isProcessing}
              >
                Change File
              </button>
            </div>

            <div className={styles.workspace}>
              {/* Settings Column */}
              <div className={styles.card}>
                <h4 className={styles.cardTitle}>Numbering Settings</h4>
                
                <div className={styles.formGroup}>
                  <label className={styles.label}>Pages to number (optional)</label>
                  <input
                    type="text"
                    value={pages}
                    onChange={(e) => setPages(e.target.value)}
                    placeholder="e.g. 1, 3, 5-10. Leave empty for all."
                    className={styles.input}
                    disabled={isProcessing}
                  />
                </div>

                <div className={styles.row}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Format</label>
                    <Select
                      value={format}
                      onChange={(val) => setFormat(val as string)}
                      options={[
                        { label: '1', value: '1' },
                        { label: 'Page 1', value: 'Page 1' },
                        { label: 'Page 1 of X', value: 'Page 1 of X' }
                      ]}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Starting Number</label>
                    <input
                      type="number"
                      min="0"
                      value={startingNumber}
                      onChange={(e) => setStartingNumber(e.target.value)}
                      className={styles.input}
                      disabled={isProcessing}
                    />
                  </div>
                </div>

                <div className={styles.row}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Font Size</label>
                    <Select
                      value={fontSize}
                      onChange={(val) => setFontSize(val as string)}
                      options={[
                        { label: 'Small', value: 'small' },
                        { label: 'Medium', value: 'medium' },
                        { label: 'Large', value: 'large' }
                      ]}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Margin</label>
                    <Select
                      value={margin}
                      onChange={(val) => setMargin(val as string)}
                      options={[
                        { label: 'Small', value: 'small' },
                        { label: 'Medium', value: 'medium' },
                        { label: 'Large', value: 'large' }
                      ]}
                    />
                  </div>
                </div>
                
                {validationError && (
                  <div className={styles.error}>
                    {validationError}
                  </div>
                )}
                {file.error && (
                  <div className={styles.error}>
                    {file.error}
                  </div>
                )}
              </div>

              {/* Preview Column */}
              <div className={styles.card}>
                <h4 className={styles.cardTitle}>Live PDF Preview</h4>
                {renderPositionSelector()}
                {renderPdfPreview()}
              </div>
            </div>

            <div className={styles.processSection}>
              <ProcessButton 
                label="Add Page Numbers" 
                onClick={handleProcess} 
                disabled={isProcessing || !!validationError}
                loading={isProcessing}
              />
            </div>
            
            {isProcessing && file.progress > 0 && (
              <div style={{ textAlign: 'center', color: 'var(--color-muted)', fontSize: '0.875rem', marginTop: '1rem' }}>
                Processing: {Math.round(file.progress)}%
              </div>
            )}
          </>
        )}

        {result && (
          <div className={styles.resultCard}>
            <div className={styles.successIcon}>
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className={styles.resultTitle}>
              Page Numbers Added!
            </h3>
            <p className={styles.resultText}>
              Your document has been successfully numbered.
            </p>
            
            <div className={styles.resultActions}>
              <Button onClick={handleDownload} size="lg">
                Download PDF
              </Button>
              <Button onClick={handleReset} variant="secondary" size="lg">
                Number Another PDF
              </Button>
            </div>
          </div>
        )}
      </div>

      {isEditorOpen && pdfProxy && (
        <PdfCustomPositionEditor
          pdfProxy={pdfProxy}
          pageIndex={lastValidPreviewPage}
          previewText={previewData.text}
          fontSize={getFontSizeForOption(fontSize)}
          margin={getMarginForOption(margin)}
          initialPosition={position}
          initialCustomCoordinates={customPosition}
          onSave={(coords) => {
            setCustomPosition(coords);
            setPosition('custom');
            setIsEditorOpen(false);
          }}
          onCancel={() => setIsEditorOpen(false)}
        />
      )}
    </ToolPageLayout>
  );
};

export default PageNumbering;
