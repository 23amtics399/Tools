import { ToolDefinition } from '../types/tool';

export function validateFileType(file: File, acceptedTypes: string[]): boolean {
  if (!acceptedTypes || acceptedTypes.length === 0) return true;
  return acceptedTypes.some(type => {
    if (type.startsWith('.')) {
      const ext = getFileExtension(file.name);
      return ext === type.substring(1).toLowerCase();
    }
    if (type.endsWith('/*')) {
      return file.type.startsWith(type.replace('/*', '/'));
    }
    return file.type === type;
  });
}

export function validateFileSize(file: File, maxSizeMB: number): boolean {
  const sizeMB = file.size / (1024 * 1024);
  return sizeMB <= maxSizeMB;
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function getFileExtension(filename: string): string {
  const parts = filename.split('.');
  if (parts.length === 1 || (parts[0] === '' && parts.length === 2)) {
    return '';
  }
  return parts.pop()?.toLowerCase() || '';
}

export function validateFiles(files: File[], tool: ToolDefinition): { valid: File[]; errors: string[] } {
  const valid: File[] = [];
  const errors = new Set<string>();

  for (const file of files) {
    if (!validateFileType(file, tool.acceptedTypes)) {
      errors.add(`File type not supported for ${file.name}`);
    } else if (!validateFileSize(file, tool.maxFileSizeMB)) {
      errors.add(`${file.name} exceeds the maximum size of ${tool.maxFileSizeMB}MB`);
    } else {
      valid.push(file);
    }
  }

  return { valid, errors: Array.from(errors) };
}
