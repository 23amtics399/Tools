import { useState, useCallback, useEffect } from 'react';
import { AppFile, ProcessingState, ProcessorFn, ProcessorResult } from '../types/file';
import { revokeUrl } from '../lib/urlCleanup';

export function useProcessing() {
  const [processingState, setProcessingState] = useState<ProcessingState>({
    isProcessing: false,
    processedCount: 0,
    totalCount: 0,
    currentFile: null,
  });
  const [results, setResults] = useState<Map<string, ProcessorResult>>(new Map());

  const processFiles = useCallback(async (
    files: AppFile[],
    processor: ProcessorFn,
    options: Record<string, unknown>,
    updateFileState: (id: string, updates: Partial<AppFile>) => void
  ) => {
    setProcessingState({
      isProcessing: true,
      processedCount: 0,
      totalCount: files.length,
      currentFile: null,
    });

    for (let i = 0; i < files.length; i++) {
      const appFile = files[i];
      if (appFile.status === 'completed') {
        setProcessingState(prev => ({ ...prev, processedCount: prev.processedCount + 1 }));
        continue;
      }

      setProcessingState(prev => ({ ...prev, currentFile: appFile.name }));
      updateFileState(appFile.id, { status: 'processing', progress: 0, error: null });

      try {
        const result = await processor(appFile.file, options, (progress) => {
          updateFileState(appFile.id, { progress });
        });
        
        setResults(prev => new Map(prev).set(appFile.id, result));
        updateFileState(appFile.id, { status: 'completed', progress: 100, result });
      } catch (err) {
        updateFileState(appFile.id, { 
          status: 'error', 
          error: err instanceof Error ? err.message : 'An error occurred during processing' 
        });
      }

      setProcessingState(prev => ({ ...prev, processedCount: prev.processedCount + 1 }));
    }

    setProcessingState(prev => ({ ...prev, isProcessing: false, currentFile: null }));
  }, []);

  const resetProcessing = useCallback(() => {
    setResults(prev => {
      prev.forEach(result => {
        if (result.previewUrl) revokeUrl(result.previewUrl);
      });
      return new Map();
    });
    setProcessingState({
      isProcessing: false,
      processedCount: 0,
      totalCount: 0,
      currentFile: null,
    });
  }, []);

  useEffect(() => {
    return () => {
      results.forEach(result => {
        if (result.previewUrl) revokeUrl(result.previewUrl);
      });
    };
  }, []);

  return { processingState, processFiles, results, resetProcessing };
}
