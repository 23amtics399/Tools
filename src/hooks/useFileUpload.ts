import { useState, useCallback, useEffect } from 'react';
import { AppFile } from '../types/file';
import { ToolDefinition } from '../types/tool';
import { validateFiles } from '../lib/fileValidation';
import { revokeUrl } from '../lib/urlCleanup';

export function useFileUpload(tool: ToolDefinition) {
  const [files, setFiles] = useState<AppFile[]>([]);
  const [error, setError] = useState<string | null>(null);

  const addFiles = useCallback((newFiles: FileList | File[]) => {
    const fileArray = Array.from(newFiles);
    
    const { valid, errors } = validateFiles(fileArray, tool);
    if (errors.length > 0) {
      setError(errors.join('. '));
    } else {
      setError(null);
    }

    if (valid.length === 0) return;

    setFiles(prev => {
      if (prev.length + valid.length > tool.maxFiles) {
        setError(`You can only upload up to ${tool.maxFiles} files.`);
        return prev;
      }
      
      const newAppFiles: AppFile[] = valid.map(f => {
        let previewUrl: string | null = null;
        if (f.type.startsWith('image/')) {
          previewUrl = URL.createObjectURL(f);
        }
        return {
          id: crypto.randomUUID(),
          file: f,
          name: f.name,
          size: f.size,
          type: f.type,
          previewUrl,
          status: 'pending',
          progress: 0,
          result: null,
          error: null
        };
      });
      return [...prev, ...newAppFiles];
    });
  }, [tool]);

  const removeFile = useCallback((id: string) => {
    setFiles(prev => {
      const fileToRemove = prev.find(f => f.id === id);
      if (fileToRemove?.previewUrl) {
        revokeUrl(fileToRemove.previewUrl);
      }
      return prev.filter(f => f.id !== id);
    });
  }, []);

  const clearFiles = useCallback(() => {
    setFiles(prev => {
      prev.forEach(f => {
        if (f.previewUrl) revokeUrl(f.previewUrl);
      });
      return [];
    });
    setError(null);
  }, []);

  useEffect(() => {
    return () => {
      files.forEach(f => {
        if (f.previewUrl) revokeUrl(f.previewUrl);
      });
    };
  }, []);

  return { files, addFiles, removeFile, clearFiles, error, setFiles };
}
