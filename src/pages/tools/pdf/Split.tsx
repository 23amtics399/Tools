import React, { useState, useEffect } from 'react';
import ToolPageLayout from '../../../components/tool/ToolPageLayout';
import { FileUploadZone } from '../../../components/tool/FileUploadZone';
import { ProcessButton } from '../../../components/tool/ProcessButton';
import { ToolOptions } from '../../../components/tool/ToolOptions';
import { Button } from '../../../components/ui/Button';
import { useToolConfig } from '../../../hooks/useToolConfig';
import { useFileUpload } from '../../../hooks/useFileUpload';
import { splitPdf } from '../../../processors/pdf/split';
import { ProcessorResult } from '../../../types/file';
import { FileIcon, CloseIcon } from '../../../components/icons/IconRegistry';
import { formatFileSize } from '../../../lib/fileValidation';

export default function SplitPdf() {
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
      // Dynamically load pdf-lib to get page count
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

  const handleSplit = async () => {
    if (files.length === 0) return;
    
    setIsProcessing(true);
    setProcessError(null);
    setProcessProgress(0);
    
    try {
      const res = await splitPdf(files[0].file, options, (progress) => {
        setProcessProgress(Math.round(progress));
      });
      setResult(res);
    } catch (err) {
      setProcessError(err instanceof Error ? err.message : 'An error occurred during split');
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
              <div style={{ color: 'var(--color-primary)' }}><FileIcon size={32} /></div>
              <div>
                <div style={{ fontWeight: '600', color: 'var(--color-text)' }}>{files[0].name}</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--color-muted)' }}>
                  {formatFileSize(files[0].size)}
                  {pageCount !== null && ` • ${pageCount} pages`}
                </div>
              </div>
            </div>
            <button 
              onClick={() => removeFile(files[0].id)}
              style={{ background: 'none', border: 'none', color: 'var(--color-error)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              title="Remove File"
            >
              <CloseIcon size={24} />
            </button>
          </div>

          <ToolOptions 
            options={(tool.options || []).map(o => 
              o.id === 'ranges' && pageCount !== null 
                ? { ...o, placeholder: `All pages (1-${pageCount})` } 
                : o
            )} 
            values={options} 
            onChange={setOptions} 
          />

          <div style={{ marginTop: '2rem' }}>
            <ProcessButton
              onClick={handleSplit}
              loading={isProcessing}
              disabled={files.length === 0 || isProcessing}
              label={isProcessing ? `Splitting PDF... ${processProgress}%` : `Split PDF`}
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
          <h3 style={{ marginBottom: '1rem', color: 'var(--color-text)' }}>Split Complete!</h3>
          <p style={{ marginBottom: '1.5rem', color: 'var(--color-muted)' }}>
            {result.fileName} ({formatFileSize(result.processedSize)})
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <a 
              href={result.previewUrl} 
              download={result.fileName}
            >
              <Button>Download {options.mode === 'separate' ? 'ZIP' : 'PDF'}</Button>
            </a>
            <Button variant="secondary" onClick={handleReset}>Split Another PDF</Button>
          </div>
        </div>
      )}
    </ToolPageLayout>
  );
}
