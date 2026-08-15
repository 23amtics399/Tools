import React, { useState, useEffect } from 'react';
import ToolPageLayout from '../../../components/tool/ToolPageLayout';
import { FileUploadZone } from '../../../components/tool/FileUploadZone';
import { ProcessButton } from '../../../components/tool/ProcessButton';
import { ToolOptions } from '../../../components/tool/ToolOptions';
import { Button } from '../../../components/ui/Button';
import { useToolConfig } from '../../../hooks/useToolConfig';
import { useFileUpload } from '../../../hooks/useFileUpload';
import { compressPdf } from '../../../processors/pdf/compress';
import { ProcessorResult } from '../../../types/file';
import { FileIcon, CloseIcon } from '../../../components/icons/IconRegistry';
function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export default function CompressPdf() {
  const tool = useToolConfig();
  const { files, addFiles, removeFile, clearFiles, error: uploadError } = useFileUpload(tool!);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [processProgress, setProcessProgress] = useState(0);
  const [result, setResult] = useState<ProcessorResult | null>(null);
  const [processError, setProcessError] = useState<string | null>(null);
  const [pageCount, setPageCount] = useState<number | null>(null);
  
  // Options state
  const [options, setOptions] = useState<Record<string, any>>(() => {
    const defaultVals: Record<string, any> = {};
    tool?.options?.forEach(o => {
      defaultVals[o.id] = o.defaultValue;
    });
    return defaultVals;
  });

  useEffect(() => {
    if (files.length > 0) {
      import('pdf-lib').then(({ PDFDocument }) => {
        files[0].file.arrayBuffer().then(buffer => {
          PDFDocument.load(buffer, { ignoreEncryption: true }).then(pdf => {
            setPageCount(pdf.getPageCount());
          }).catch(console.error);
        }).catch(console.error);
      }).catch(console.error);
    } else {
      setPageCount(null);
    }
  }, [files]);

  if (!tool) return null;

  const handleCompress = async () => {
    if (files.length === 0) return;
    
    setIsProcessing(true);
    setProcessError(null);
    setProcessProgress(0);
    
    try {
      const res = await compressPdf(files[0].file, options, (progress) => {
        setProcessProgress(Math.round(progress));
      });
      setResult(res);
    } catch (err) {
      setProcessError(err instanceof Error ? err.message : 'An error occurred during compression');
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

  const renderResult = () => {
    if (!result) return null;
    
    const wasOptimized = result.metadata?.optimized === true;
    const reductionBytes = result.originalSize - result.processedSize;
    const reductionPercent = result.originalSize > 0 
      ? ((reductionBytes / result.originalSize) * 100).toFixed(1)
      : '0.0';

    return (
      <div style={{
        backgroundColor: 'var(--color-elevated)',
        padding: '2rem',
        borderRadius: '12px',
        border: '1px solid var(--color-border)',
        textAlign: 'center',
        marginTop: '2rem'
      }}>
        <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '32px',
            backgroundColor: wasOptimized ? 'var(--color-primary-alpha)' : 'var(--color-surface)',
            color: wasOptimized ? 'var(--color-primary)' : 'var(--color-text-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <FileIcon size={32} />
          </div>
        </div>

        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--color-text)' }}>
          {wasOptimized ? 'Compression Complete' : 'PDF Already Optimized'}
        </h2>

        {wasOptimized ? (
          <div style={{ margin: '2rem 0', display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '250px', color: 'var(--color-text-secondary)' }}>
              <span>Original:</span>
              <span style={{ color: 'var(--color-text)', fontWeight: 500 }}>{formatBytes(result.originalSize)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '250px', color: 'var(--color-text-secondary)' }}>
              <span>Compressed:</span>
              <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>{formatBytes(result.processedSize)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '250px', color: 'var(--color-text-secondary)' }}>
              <span>Saved:</span>
              <span style={{ color: '#10b981', fontWeight: 600 }}>{formatBytes(reductionBytes)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '250px', color: 'var(--color-text-secondary)' }}>
              <span>Reduction:</span>
              <span style={{ color: '#10b981', fontWeight: 600 }}>{reductionPercent}%</span>
            </div>
          </div>
        ) : (
          <div style={{ margin: '2rem 0', display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'center' }}>
             <p style={{ color: 'var(--color-text-secondary)', maxWidth: '400px', lineHeight: '1.5' }}>
               We couldn't reduce this PDF further without changing its contents or quality, so the original file was preserved.
             </p>
             <div style={{ marginTop: '1rem', display: 'flex', gap: '2rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: '0.25rem' }}>Original size</span>
                  <span style={{ fontWeight: 500, color: 'var(--color-text)' }}>{formatBytes(result.originalSize)}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: '0.25rem' }}>Result size</span>
                  <span style={{ fontWeight: 500, color: 'var(--color-text)' }}>{formatBytes(result.processedSize)}</span>
                </div>
             </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <a
            href={result.previewUrl}
            download={result.fileName}
            style={{ textDecoration: 'none' }}
          >
            <Button variant="primary" size="lg">
              {wasOptimized ? 'Download Compressed PDF' : 'Download PDF'}
            </Button>
          </a>
          <Button variant="secondary" size="lg" onClick={handleReset}>
            Compress Another PDF
          </Button>
        </div>
      </div>
    );
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
              <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: 'var(--color-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
                <FileIcon size={24} />
              </div>
              <div>
                <p style={{ fontWeight: 500, color: 'var(--color-text)', margin: 0 }}>
                  {files[0].name}
                </p>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', margin: 0, marginTop: '0.25rem' }}>
                  {formatBytes(files[0].size)} {pageCount !== null ? `• ${pageCount} pages` : ''}
                </p>
              </div>
            </div>
            {!isProcessing && (
              <button 
                onClick={() => removeFile(files[0].id)}
                style={{ background: 'none', border: 'none', color: 'var(--color-text-secondary)', cursor: 'pointer', padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                aria-label="Remove file"
              >
                <CloseIcon size={20} />
              </button>
            )}
          </div>

          <div style={{ backgroundColor: 'var(--color-surface)', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--color-border)', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Compression Level</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <select 
                value={options.compressionLevel || '50'} 
                onChange={(e) => setOptions({ ...options, compressionLevel: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '6px',
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-elevated)',
                  color: 'var(--color-text)',
                  fontSize: '1rem',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                {tool.options?.find(o => o.id === 'compressionLevel')?.options?.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>

              <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: '1.5' }}>
                {options.compressionLevel === '10' && "Minimal compression with maximum quality preservation."}
                {options.compressionLevel === '30' && "Light compression while preserving high visual quality."}
                {(!options.compressionLevel || options.compressionLevel === '50') && "Recommended balance between file size and quality."}
                {options.compressionLevel === '70' && "Strong compression with some quality loss."}
                {options.compressionLevel === '90' && "Maximum practical compression. Quality and text selectability may be reduced."}
              </div>

              {(options.compressionLevel === '70' || options.compressionLevel === '80' || options.compressionLevel === '90') && (
                <div style={{ 
                  marginTop: '0.5rem', 
                  padding: '0.75rem', 
                  backgroundColor: 'var(--color-elevated)', 
                  borderLeft: '4px solid var(--color-primary)', 
                  color: 'var(--color-text)', 
                  fontSize: '0.875rem',
                  borderRadius: '0 4px 4px 0'
                }}>
                  {options.compressionLevel === '90' 
                    ? "Maximum compression may noticeably reduce quality and convert pages to images." 
                    : "High compression may reduce image quality and can make text non-selectable."}
                </div>
              )}
            </div>
          </div>

          {processError && (
            <div style={{ color: '#ef4444', marginTop: '1rem', padding: '1rem', backgroundColor: '#fee2e2', borderRadius: '8px' }}>
              {processError}
            </div>
          )}

          <div style={{ marginTop: '2rem' }}>
            <ProcessButton 
              onClick={handleCompress}
              loading={isProcessing}
              disabled={isProcessing}
              label={isProcessing ? "Compressing PDF..." : "Compress PDF"}
            />
          </div>
        </div>
      )}

      {renderResult()}
    </ToolPageLayout>
  );
}
