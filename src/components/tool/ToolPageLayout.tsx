import React, { useState, useCallback, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import styles from './ToolPageLayout.module.css';
import { ToolDefinition } from '../../types/tool';
import { AppFile, ProcessorFn, ProcessorResult } from '../../types/file';
import { validateFiles, formatFileSize } from '../../lib/fileValidation';
import { downloadFile } from '../../lib/downloadHelper';
import { revokeUrl } from '../../lib/urlCleanup';
import { generateToolJsonLd, generateFaqJsonLd, generateBreadcrumbJsonLd } from '../../lib/seoHelpers';
import { getRelatedTools } from '../../config/tools';
import ToolHero from './ToolHero';
import FileUploadZone from './FileUploadZone';
import FileList from './FileList';
import ToolOptions from './ToolOptions';
import ProcessButton from './ProcessButton';
import ProgressBar from './ProgressBar';
import ResultCard from './ResultCard';
import BatchDownload from './BatchDownload';
import RelatedTools from './RelatedTools';
import HowToUse from './HowToUse';
import ToolFAQ from './ToolFAQ';
import PrivacyNotice from './PrivacyNotice';
import ComingSoon from './ComingSoon';
import ErrorMessage from '../ui/ErrorMessage';

export interface ToolPageLayoutProps {
  tool: ToolDefinition;
  processorFn?: ProcessorFn;
  renderOptions?: (options: Record<string, unknown>, setOptions: (opts: Record<string, unknown>) => void, files: AppFile[]) => React.ReactNode;
  renderCustomUpload?: (files: AppFile[], addFiles: (files: File[]) => void) => React.ReactNode;
  renderCustomResult?: (results: ProcessorResult[], files: AppFile[]) => React.ReactNode;
  children?: React.ReactNode;
}

function initOptions(tool: ToolDefinition): Record<string, unknown> {
  const defaults: Record<string, unknown> = {};
  if (tool.options) {
    for (const opt of tool.options) {
      defaults[opt.id] = opt.defaultValue;
    }
  }
  return defaults;
}

const ToolPageLayout: React.FC<ToolPageLayoutProps> = ({
  tool,
  processorFn,
  renderOptions,
  renderCustomUpload,
  renderCustomResult,
  children,
}) => {
  const [files, setFiles] = useState<AppFile[]>([]);
  const [options, setOptions] = useState<Record<string, unknown>>(() => initOptions(tool));
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedCount, setProcessedCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isDone, setIsDone] = useState(false);
  const resultsRef = React.useRef<HTMLDivElement>(null);

  // Clean up all object URLs on unmount
  useEffect(() => {
    return () => {
      files.forEach(f => {
        revokeUrl(f.previewUrl);
        if (f.result) revokeUrl(f.result.previewUrl);
      });
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddFiles = useCallback((newFiles: File[]) => {
    setError(null);
    const { valid, errors } = validateFiles(newFiles, tool);
    if (errors.length > 0) {
      setError(errors.join('. '));
    }
    if (valid.length === 0) return;

    // Enforce maxFiles
    const remaining = tool.maxFiles - files.length;
    const toAdd = valid.slice(0, Math.max(0, remaining));
    if (toAdd.length < valid.length) {
      setError(prev => (prev ? prev + '. ' : '') + `Only ${tool.maxFiles} file(s) allowed. Some files were not added.`);
    }

    const appFiles: AppFile[] = toAdd.map(f => ({
      id: crypto.randomUUID(),
      file: f,
      name: f.name,
      size: f.size,
      type: f.type,
      previewUrl: f.type.startsWith('image/') ? URL.createObjectURL(f) : null,
      status: 'pending' as const,
      progress: 0,
      result: null,
      error: null,
    }));

    setFiles(prev => [...prev, ...appFiles]);
    setIsDone(false);
  }, [files.length, tool]);

  const handleRemoveFile = useCallback((id: string) => {
    setFiles(prev => {
      const file = prev.find(f => f.id === id);
      if (file) {
        revokeUrl(file.previewUrl);
        if (file.result) revokeUrl(file.result.previewUrl);
      }
      return prev.filter(f => f.id !== id);
    });
  }, []);

  const handleProcess = useCallback(async () => {
    if (!processorFn || files.length === 0) return;
    setIsProcessing(true);
    setProcessedCount(0);
    setError(null);
    setIsDone(false);

    const updatedFiles = [...files];

    for (let i = 0; i < updatedFiles.length; i++) {
      if (updatedFiles[i].status === 'completed') {
        setProcessedCount(prev => prev + 1);
        continue;
      }

      updatedFiles[i] = { ...updatedFiles[i], status: 'processing', progress: 0 };
      setFiles([...updatedFiles]);

      try {
        const result = await processorFn(
          updatedFiles[i].file,
          options,
          (progress) => {
            updatedFiles[i] = { ...updatedFiles[i], progress: Math.round(progress * 100) };
            setFiles([...updatedFiles]);
          }
        );
        updatedFiles[i] = { ...updatedFiles[i], status: 'completed', progress: 100, result };
        setFiles([...updatedFiles]);
        setProcessedCount(prev => prev + 1);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Processing failed. Please try again.';
        updatedFiles[i] = { ...updatedFiles[i], status: 'error', error: message };
        setFiles([...updatedFiles]);
        setProcessedCount(prev => prev + 1);
      }
    }

    setIsProcessing(false);
    setIsDone(true);
    
    // Scroll to results after a short delay to let the DOM update
    setTimeout(() => {
      if (resultsRef.current) {
        resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }, [files, options, processorFn]);

  const handleReset = useCallback(() => {
    files.forEach(f => {
      revokeUrl(f.previewUrl);
      if (f.result) revokeUrl(f.result.previewUrl);
    });
    setFiles([]);
    setOptions(initOptions(tool));
    setIsProcessing(false);
    setProcessedCount(0);
    setError(null);
    setIsDone(false);
  }, [files, tool]);

  const handleDownload = useCallback((result: ProcessorResult) => {
    downloadFile(result.file, result.fileName);
  }, []);

  const completedFiles = files.filter(f => f.status === 'completed' && f.result);
  const completedResults = completedFiles.map(f => f.result!);
  const relatedTools = getRelatedTools(tool.id);
  const hasFiles = files.length > 0;
  const allDone = isDone && files.length > 0;

  // SEO
  const canonicalUrl = `https://tools.sji.one${tool.path}`;
  const toolJsonLd = generateToolJsonLd(tool);
  const faqJsonLd = tool.faq.length > 0 ? generateFaqJsonLd(tool.faq) : null;
  const breadcrumbJsonLd = generateBreadcrumbJsonLd(tool);

  return (
    <>
      <Helmet>
        <title>{tool.seo.title}</title>
        <meta name="description" content={tool.seo.description} />
        <meta name="keywords" content={tool.seo.keywords.join(', ')} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={tool.seo.title} />
        <meta property="og:description" content={tool.seo.description} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Tools by sji.one" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={tool.seo.title} />
        <meta name="twitter:description" content={tool.seo.description} />
        {toolJsonLd && (
          <script type="application/ld+json">{JSON.stringify(toolJsonLd)}</script>
        )}
        {faqJsonLd && (
          <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
        )}
        <script type="application/ld+json">{JSON.stringify(breadcrumbJsonLd)}</script>
      </Helmet>

      <div className={styles.layout}>
        <ToolHero tool={tool} />

        {tool.status === 'coming-soon' ? (
          <ComingSoon tool={tool} />
        ) : children ? (
          <div className={styles.workspace}>{children}</div>
        ) : (
          <div className={styles.workspace}>
            {/* Upload Area */}
            {!allDone && (
              renderCustomUpload ? (
                renderCustomUpload(files, handleAddFiles)
              ) : (
                <FileUploadZone
                  onFiles={handleAddFiles}
                  acceptedTypes={tool.acceptedTypes}
                  maxFiles={tool.maxFiles}
                  maxSizeMB={tool.maxFileSizeMB}
                  disabled={isProcessing}
                />
              )
            )}

            {/* Error */}
            {error && <ErrorMessage message={error} onRetry={() => setError(null)} />}

            {/* File List */}
            {hasFiles && !allDone && (
              <FileList files={files} onRemove={handleRemoveFile} />
            )}

            {/* Options */}
            {hasFiles && !allDone && (
              <div className={styles.optionsArea}>
                {tool.options && tool.options.length > 0 && !renderOptions && (
                  <ToolOptions options={tool.options} values={options} onChange={setOptions} />
                )}
                {renderOptions && renderOptions(options, setOptions, files)}
              </div>
            )}

            {/* Process Button */}
            {hasFiles && !allDone && (
              <div className={styles.processArea}>
                {isProcessing && (
                  <ProgressBar
                    progress={files.length > 0 ? (processedCount / files.length) * 100 : 0}
                    label={`Processing ${processedCount + 1} of ${files.length}...`}
                  />
                )}
                <ProcessButton
                  label={isProcessing
                    ? `Processing... (${processedCount}/${files.length})`
                    : `Process ${files.length} file${files.length > 1 ? 's' : ''}`
                  }
                  onClick={handleProcess}
                  disabled={isProcessing || files.length === 0}
                  loading={isProcessing}
                />
              </div>
            )}

            {/* Results */}
            {allDone && completedResults.length > 0 && (
              <div className={styles.results} ref={resultsRef}>
                <h2 className={styles.resultsTitle}>
                  ✅ {completedResults.length} file{completedResults.length > 1 ? 's' : ''} processed
                  {completedResults.length > 0 && (
                    <span className={styles.savedSize}>
                      {' '}— Saved {formatFileSize(
                        completedResults.reduce((acc, r) => acc + (r.originalSize - r.processedSize), 0)
                      )}
                    </span>
                  )}
                </h2>

                {renderCustomResult ? (
                  renderCustomResult(completedResults, completedFiles)
                ) : (
                  <div className={styles.resultGrid}>
                    {completedFiles.map(f => (
                      <ResultCard
                        key={f.id}
                        result={f.result!}
                        originalFile={f}
                      />
                    ))}
                  </div>
                )}

                {completedResults.length > 1 && (
                  <BatchDownload
                    results={completedResults}
                    zipName={`${tool.slug}-results.zip`}
                  />
                )}

                {/* Error files */}
                {files.filter(f => f.status === 'error').length > 0 && (
                  <div className={styles.errorFiles}>
                    <h3>Failed files:</h3>
                    {files.filter(f => f.status === 'error').map(f => (
                      <div key={f.id} className={styles.errorFile}>
                        <span>{f.name}</span>
                        <span className={styles.errorText}>{f.error}</span>
                      </div>
                    ))}
                  </div>
                )}

                <button className={styles.resetButton} onClick={handleReset}>
                  ↺ Process More Files
                </button>
              </div>
            )}
          </div>
        )}

        <PrivacyNotice show={tool.status === 'active'} />
        <HowToUse steps={tool.howToUse} toolName={tool.name} />
        <ToolFAQ faqs={tool.faq} toolName={tool.name} />
        {relatedTools.length > 0 && <RelatedTools tools={relatedTools} />}
      </div>
    </>
  );
};

export default ToolPageLayout;
