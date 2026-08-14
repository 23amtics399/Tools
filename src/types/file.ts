export type FileStatus = 'pending' | 'processing' | 'completed' | 'error';

export interface AppFile {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  previewUrl: string | null;
  status: FileStatus;
  progress: number;
  result: ProcessorResult | null;
  error: string | null;
}

export interface ProcessorResult {
  file: File;
  previewUrl: string;
  originalSize: number;
  processedSize: number;
  fileName: string;
  metadata?: Record<string, unknown>;
}

export type ProcessorFn = (
  file: File,
  options: Record<string, unknown>,
  onProgress?: (progress: number) => void
) => Promise<ProcessorResult>;

export interface ProcessingState {
  isProcessing: boolean;
  processedCount: number;
  totalCount: number;
  currentFile: string | null;
}

export interface CropData {
  x: number;
  y: number;
  width: number;
  height: number;
  rotate?: number;
  scaleX?: number;
  scaleY?: number;
}
