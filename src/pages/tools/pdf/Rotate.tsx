import React, { useState, useEffect, useRef } from 'react';
import type { PDFDocumentProxy } from 'pdfjs-dist';
import ToolPageLayout from '../../../components/tool/ToolPageLayout';
import { FileUploadZone } from '../../../components/tool/FileUploadZone';
import { ProcessButton } from '../../../components/tool/ProcessButton';
import { ToolOptions } from '../../../components/tool/ToolOptions';
import { Button } from '../../../components/ui/Button';
import { useToolConfig } from '../../../hooks/useToolConfig';
import { useFileUpload } from '../../../hooks/useFileUpload';
import { rotatePdf } from '../../../processors/pdf/rotate';
import { ProcessorResult } from '../../../types/file';
import { PdfThumbnail } from '../../../components/tool/PdfThumbnail';

export default function RotatePdf() {
  const tool = useToolConfig('rotate');
  const { files, addFiles, removeFile, clearFiles, error: uploadError } = useFileUpload(tool!);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [processProgress, setProcessProgress] = useState(0);
  const [result, setResult] = useState<ProcessorResult | null>(null);
  const [processError, setProcessError] = useState<string | null>(null);
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [pdfProxy, setPdfProxy] = useState<any>(null);
  const loadingTaskRef = useRef<any>(null);
  
  // Modes
  const [mode, setMode] = useState<'quick' | 'visual'>('quick');
  const [pageRotations, setPageRotations] = useState<Record<number, number>>({});
  
  // Options state
  const [options, setOptions] = useState<Record<string, any>>(() => {
    const defaultVals: Record<string, any> = {};
    tool?.options?.forEach(o => {
      defaultVals[o.id] = o.defaultValue;
    });
    return defaultVals;
  });

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
              
              // Initialize page rotations
              const initialRotations: Record<number, number> = {};
              for (let i = 0; i < pdf.numPages; i++) {
                 initialRotations[i] = 0;
              }
              setPageRotations(initialRotations);
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
      setPageRotations({});
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

  if (!tool) return null;

  const handleRotate = async () => {
    if (files.length === 0) return;
    
    setIsProcessing(true);
    setProcessError(null);
    setProcessProgress(0);
    
    try {
      const currentOptions = { ...options };
      if (mode === 'visual') {
        currentOptions.pageRotations = pageRotations;
      }

      const res = await rotatePdf(files[0].file, currentOptions, (progress) => {
        setProcessProgress(Math.round(progress));
      });
      setResult(res);
    } catch (err) {
      setProcessError(err instanceof Error ? err.message : 'An error occurred during rotation');
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

  const isSpecificPages = options.applyTo === 'specific';
  
  // Filter options based on applyTo state
  const visibleOptions = tool.options?.filter(o => {
    if (o.id === 'ranges') return isSpecificPages;
    return true;
  }).map(o => {
    if (o.id === 'ranges' && pageCount !== null) {
      return { ...o, placeholder: `e.g., 1-${Math.min(3, pageCount)}, ${pageCount}` };
    }
    return o;
  }) || [];

  const handleRotateCw = (pageIndex: number) => { // 0-indexed internal state
    setPageRotations(prev => ({
      ...prev,
      [pageIndex]: (prev[pageIndex] + 90) % 360
    }));
  };

  const handleRotateCcw = (pageIndex: number) => {
    setPageRotations(prev => {
      let next = (prev[pageIndex] - 90) % 360;
      if (next < 0) next += 360;
      return { ...prev, [pageIndex]: next };
    });
  };

  const handleRotateAllCw = () => {
    if (!pageCount) return;
    const next: Record<number, number> = {};
    for (let i = 0; i < pageCount; i++) {
      next[i] = ((pageRotations[i] || 0) + 90) % 360;
    }
    setPageRotations(next);
  };

  const handleResetAll = () => {
    if (!pageCount) return;
    const next: Record<number, number> = {};
    for (let i = 0; i < pageCount; i++) {
      next[i] = 0;
    }
    setPageRotations(next);
  };

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

          {/* Mode Switcher */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem' }}>
            <button 
              onClick={() => setMode('quick')}
              style={{ padding: '0.5rem 1rem', background: mode === 'quick' ? 'var(--color-primary)' : 'transparent', color: mode === 'quick' ? '#fff' : 'var(--color-text)', border: '1px solid', borderColor: mode === 'quick' ? 'var(--color-primary)' : 'var(--color-border)', borderRadius: '4px', cursor: 'pointer', fontWeight: '500' }}
            >
              Quick Rotate
            </button>
            <button 
              onClick={() => setMode('visual')}
              style={{ padding: '0.5rem 1rem', background: mode === 'visual' ? 'var(--color-primary)' : 'transparent', color: mode === 'visual' ? '#fff' : 'var(--color-text)', border: '1px solid', borderColor: mode === 'visual' ? 'var(--color-primary)' : 'var(--color-border)', borderRadius: '4px', cursor: 'pointer', fontWeight: '500' }}
            >
              Visual Rotate
            </button>
          </div>

          {mode === 'quick' && (
            <>
              <ToolOptions 
                options={visibleOptions} 
                values={options} 
                onChange={setOptions} 
              />

              <div style={{ 
                marginTop: '1.5rem', 
                padding: '1rem', 
                backgroundColor: 'rgba(99, 102, 241, 0.1)', 
                border: '1px solid var(--color-border)', 
                borderRadius: '8px',
                color: 'var(--color-text)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem'
              }}>
                <div style={{ fontWeight: '600' }}>Operation Summary</div>
                <div style={{ fontSize: '0.875rem' }}>
                  <strong>Rotation:</strong> {options.rotation === '90' ? '90° Clockwise' : options.rotation === '180' ? '180°' : '270° Clockwise'}
                </div>
                <div style={{ fontSize: '0.875rem' }}>
                  <strong>Pages:</strong> {options.applyTo === 'all' ? `All ${pageCount || ''} pages` : (options.ranges ? options.ranges : 'All pages (blank input)')}
                </div>
              </div>
            </>
          )}

          {mode === 'visual' && pdfProxy && pageCount && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', backgroundColor: 'var(--color-elevated)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                <Button variant="secondary" onClick={handleRotateAllCw}>
                  Rotate All 90° Clockwise
                </Button>
                <Button variant="secondary" onClick={handleResetAll}>
                  Reset All to Original
                </Button>
              </div>
              
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
                gap: '1.5rem',
                maxHeight: '600px',
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
                    additionalRotation={pageRotations[i] || 0}
                    onRotateCw={() => handleRotateCw(i)}
                    onRotateCcw={() => handleRotateCcw(i)}
                  />
                ))}
              </div>
            </div>
          )}

          <div style={{ marginTop: '2rem' }}>
            <ProcessButton
              onClick={handleRotate}
              loading={isProcessing}
              disabled={files.length === 0 || isProcessing || (mode === 'visual' && !pdfProxy)}
              label={isProcessing ? `Rotating PDF... ${processProgress}%` : `Rotate PDF`}
            />
          </div>
          
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
          <h3 style={{ marginBottom: '1rem', color: 'var(--color-text)' }}>Rotation Complete!</h3>
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
            <Button variant="secondary" onClick={handleReset}>Rotate Another PDF</Button>
          </div>
        </div>
      )}
    </ToolPageLayout>
  );
}
