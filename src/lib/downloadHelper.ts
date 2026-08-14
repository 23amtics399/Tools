import { ProcessorResult } from '../types/file';

export function downloadFile(file: File | Blob, filename: string): void {
  const url = URL.createObjectURL(file);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function downloadAllAsZip(results: ProcessorResult[], zipName: string): Promise<void> {
  const JSZip = (await import('jszip')).default;
  const JSZipInstance = new JSZip();

  results.forEach(result => {
    if (result.file) {
      JSZipInstance.file(result.fileName, result.file);
    }
  });

  const content = await JSZipInstance.generateAsync({ type: 'blob' });
  downloadFile(content, zipName);
}

export function generateFileName(originalName: string, suffix: string, newExtension?: string): string {
  const parts = originalName.split('.');
  const ext = newExtension ? newExtension : parts.pop() || '';
  const base = newExtension ? parts.join('.') : parts.join('.');
  return `${base}-${suffix}${ext ? `.${ext}` : ''}`;
}
