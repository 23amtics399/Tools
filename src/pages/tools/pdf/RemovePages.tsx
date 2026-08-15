import React, { useState, useEffect, useRef } from 'react';
import type { PDFDocumentProxy } from 'pdfjs-dist';
import ToolPageLayout from '../../../components/tool/ToolPageLayout';
import { FileUploadZone } from '../../../components/tool/FileUploadZone';
import { ProcessButton } from '../../../components/tool/ProcessButton';
import { Button } from '../../../components/ui/Button';
import { useToolConfig } from '../../../hooks/useToolConfig';
import { useFileUpload } from '../../../hooks/useFileUpload';
import { removePdfPages } from '../../../processors/pdf/removePages';
import { ProcessorResult } from '../../../types/file';
import { PdfThumbnail } from '../../../components/tool/PdfThumbnail';
import { parseRanges, stringifyRanges } from '../../../processors/pdf/utils';

export default function RemovePagesPdf() {
  const tool = useToolConfig('pdf-remove-pages');
  const { files, addFiles, removeFile, clearFiles, error: uploadError } = useFileUpload(tool!);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [processProgress, setProcessProgress] = useState(0);
  const [result, setResult] = useState<ProcessorResult | null>(null);
  const [processError, setProcessError] = useState<string | null>(null);
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [pdfProxy, setPdfProxy] = useState<any>(null);
  const loadingTaskRef = useRef<any>(null);
  
  // Selected pages for removal (0-indexed internally to match PdfThumbnail loop)
  const [selectedPages, setSelectedPages] = useState<Set<number>>(new Set());
  const [rangeInput, setRangeInput] = useState<string>('');
  const [rangeError, setRangeError] = useState<string | null>(null);
  
  useEffect(() => {
    let isCancelled = false;

    if (files.length > 0) {
      const file = files[0].file;
      
      file.arrayBuffer().then(buffer => {
        if (isCancelled) return;
        
        import('pdfjs-dist').then(async (pdfjs) => {
          if (isCancelled) return;
          const workerUrl = (await import('pdfjs-dist/build/pdf.worker.min.mjs?url')).default;
          pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;
          
          const loadingTask = pdfjs.getDocument({ data: buffer });
          loadingTaskRef.current = loadingTask;
          loadingTask.promise.then(pdf => {
            console.log('PDF Proxy loaded successfully, numPages:', pdf.numPages);
            if (!isCancelled) {
              setPdfProxy(pdf);
              setPageCount(pdf.numPages);
              setSelectedPages(new Set());
              setRangeInput('');
              setRangeError(null);
            }
          }).catch(err => {
            if (err?.name !== 'AbortException') {
              console.error('Error loading PDF proxy:', err);
            }
          });
        }).catch(err => console.error('Error loading pdfjs-dist worker:', err));
      }).catch(err => console.error('Error getting array buffer:', err));
    } else {
      setPdfProxy(null);
      setPageCount(null);
      setSelectedPages(new Set());
      setRangeInput('');
      setRangeError(null);
      if (loadingTaskRef.current) {
        try {
          loadingTaskRef.current.destroy();
        } catch (e) {
          // ignore
        }
        loadingTaskRef.current = null;
      }
    }

    return () => {
      isCancelled = true;
      if (loadingTaskRef.current) {
        try {
          loadingTaskRef.current.destroy();
        } catch (e) {
          // ignore
        }
        loadingTaskRef.current = null;
      }
    };
  }, [files]);

  useEffect(() => {
    // Standardize navigation to top when tool changes or resets
    window.scrollTo(0, 0);
  }, []);

  if (!tool) return null;

  const handleRemove = async () => {
    if (files.length === 0) return;
    
    if (selectedPages.size === 0) {
      setProcessError("No pages selected. Please select the pages you want to remove.");
      return;
    }

    if (pageCount !== null && selectedPages.size >= pageCount) {
      setProcessError("You must keep at least one page. You cannot remove all pages.");
      return;
    }
    
    setIsProcessing(true);
    setProcessError(null);
    setProcessProgress(0);
    
    try {
      // The processor expects 1-indexed pages
      const pagesToRemove = Array.from(selectedPages).map(i => i + 1);

      const res = await removePdfPages(files[0].file, { pagesToRemove }, (progress) => {
        setProcessProgress(Math.round(progress));
      });
      setResult(res);
      window.scrollTo(0, 0);
    } catch (err) {
      setProcessError(err instanceof Error ? err.message : 'An error occurred during removal');
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
    setRangeInput('');
    setRangeError(null);
    window.scrollTo(0, 0);
  };

  const handleRangeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setRangeInput(value);
    
    if (!value.trim()) {
      setSelectedPages(new Set());
      setRangeError(null);
      return;
    }
    
    try {
      // parseRanges correctly throws on invalid bounds, reversed ranges, invalid characters.
      const pages = parseRanges(value, pageCount || 0); 
      const newSelected = new Set(pages.map(p => p - 1));
      setSelectedPages(newSelected);
      setRangeError(null);
    } catch (err) {
      setRangeError(err instanceof Error ? err.message : 'Invalid range format');
    }
  };

  const updateSelectionFromThumbnails = (newSelection: Set<number>) => {
    setSelectedPages(newSelection);
    setRangeInput(stringifyRanges(newSelection));
    setRangeError(null);
  };

  const toggleSelection = (pageIndex: number) => {
    const newSet = new Set(selectedPages);
    if (newSet.has(pageIndex)) {
      newSet.delete(pageIndex);
    } else {
      newSet.add(pageIndex);
    }
    updateSelectionFromThumbnails(newSet);
    setProcessError(null);
  };

  const handleSelectAll = () => {
    if (!pageCount) return;
    const all = new Set<number>();
    for (let i = 0; i < pageCount; i++) {
      all.add(i);
    }
    updateSelectionFromThumbnails(all);
    setProcessError(null);
  };

  const handleDeselectAll = () => {
    updateSelectionFromThumbnails(new Set());
    setProcessError(null);
  };

  const handleInvertSelection = () => {
    if (!pageCount) return;
    const inverted = new Set<number>();
    for (let i = 0; i < pageCount; i++) {
      if (!selectedPages.has(i)) {
        inverted.add(i);
      }
    }
    updateSelectionFromThumbnails(inverted);
    setProcessError(null);
  };

  const canProcess = selectedPages.size > 0 && pageCount !== null && selectedPages.size < pageCount;

  return (
    <ToolPageLayout tool={tool} isResultView={!!result}>
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
          <div style={{ backgroundColor: 'var(--color-elevated)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--color-border)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ fontSize: '2rem' }}>📄</div>
              <div>
                <div style={{ fontWeight: '600', color: 'var(--color-text)' }}>{files[0].name}</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--color-muted)' }}>
                  {(files[0].size / 1024 / 1024).toFixed(2)} MB
                  {pageCount !== null && ` • ${pageCount} pages`}
                </div>
              </div>
            </div>
            <button 
              onClick={() => removeFile(files[0].id)}
              style={{ background: 'none', border: 'none', color: 'var(--color-error)', cursor: 'pointer', fontSize: '1.5rem' }}
              title="Remove File"
            >
              ×
            </button>
          </div>

          {pdfProxy && pageCount && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', backgroundColor: 'var(--color-elevated)', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontWeight: '600', color: 'var(--color-text)' }}>Pages to remove</label>
                  <input
                    type="text"
                    value={rangeInput}
                    onChange={handleRangeInputChange}
                    placeholder="e.g. 1, 3, 5-8"
                    style={{
                      padding: '0.75rem',
                      borderRadius: '8px',
                      border: `1px solid ${rangeError ? 'var(--color-error)' : 'var(--color-border)'}`,
                      backgroundColor: 'var(--color-surface)',
                      color: 'var(--color-text)',
                      width: '100%',
                      fontSize: '1rem',
                      outline: 'none',
                      transition: 'border-color 0.2s'
                    }}
                  />
                  <div style={{ fontSize: '0.875rem', color: 'var(--color-muted)' }}>
                    Enter page numbers or ranges, e.g. 1, 3, 5-8
                  </div>
                  {rangeError && (
                    <div style={{ color: 'var(--color-error)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                      {rangeError}
                    </div>
                  )}
                </div>

                <div style={{ height: '1px', backgroundColor: 'var(--color-border)', margin: '0.5rem 0' }}></div>

                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                  <Button variant="secondary" onClick={handleSelectAll}>
                    Select All
                  </Button>
                  <Button variant="secondary" onClick={handleDeselectAll}>
                    Deselect All
                  </Button>
                  <Button variant="secondary" onClick={handleInvertSelection}>
                    Invert Selection
                  </Button>
                </div>
                
                <div style={{ fontSize: '0.875rem', color: 'var(--color-muted)', marginTop: '0.5rem', fontWeight: '500' }}>
                  {pageCount} pages · {selectedPages.size} selected {selectedPages.size > 0 ? 'for removal' : ''}
                </div>
              </div>
              
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', 
                gap: '1.5rem',
                maxHeight: '650px',
                overflowY: 'auto',
                padding: '1rem',
                backgroundColor: 'var(--color-elevated)',
                borderRadius: '8px',
                border: '1px solid var(--color-border)'
              }}>
                {Array.from({ length: pageCount }).map((_, i) => (
                  <PdfThumbnail
                    key={i}
                    pdf={pdfProxy}
                    pageIndex={i + 1}
                    mode="select"
                    isSelected={selectedPages.has(i)}
                    onToggleSelect={() => toggleSelection(i)}
                  />
                ))}
              </div>
            </div>
          )}

          <div style={{ marginTop: '2rem' }}>
            <ProcessButton
              onClick={handleRemove}
              loading={isProcessing}
              disabled={files.length === 0 || isProcessing || !pdfProxy || !canProcess || !!rangeError}
              label={isProcessing ? `Removing Pages... ${processProgress}%` : `Remove ${selectedPages.size} Page${selectedPages.size === 1 ? '' : 's'}`}
            />
            
            {pageCount !== null && selectedPages.size >= pageCount && (
              <div style={{ color: 'var(--color-error)', fontSize: '0.875rem', marginTop: '0.5rem', textAlign: 'center' }}>
                You must keep at least one page. You cannot remove all pages.
              </div>
            )}
          </div>
          
          {processError && (
            <div style={{ color: 'var(--color-error)', marginTop: '1rem', padding: '1rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px' }}>
              {processError}
            </div>
          )}
        </div>
      )}

      {result && (
        <div style={{ padding: '2rem', textAlign: 'center', backgroundColor: 'var(--color-elevated)', borderRadius: '12px', marginTop: '2rem', border: '1px solid var(--color-border)' }}>
          <h3 style={{ marginBottom: '1rem', color: 'var(--color-text)' }}>Pages Removed Successfully!</h3>
          <p style={{ marginBottom: '1.5rem', color: 'var(--color-muted)' }}>
            {result.fileName} ({(result.processedSize / 1024 / 1024).toFixed(2)} MB)
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <a 
              href={result.previewUrl} 
              download={result.fileName}
            >
              <Button>Download PDF</Button>
            </a>
            <Button variant="secondary" onClick={handleReset}>Process Another PDF</Button>
          </div>
        </div>
      )}
    </ToolPageLayout>
  );
}
