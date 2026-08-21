import { ProcessorFn, ProcessorResult } from '../../types/file';

export const convertHeic: ProcessorFn = async (file, options, onProgress) => {
  // Update progress to show started
  if (onProgress) onProgress(10);

  // Dynamically import heic-to to prevent it from bloating the main bundle
  const { heicTo } = await import('heic-to');
  
  if (onProgress) onProgress(30);

  const format = (options.format as string) === 'png' ? 'image/png' : 'image/jpeg';
  // Options quality comes in as 1-100, heic-to expects 0-1
  const qualityVal = typeof options.quality === 'number' ? options.quality / 100 : 0.9;

  try {
    // Decode and convert
    const blob = await heicTo({
      blob: file,
      type: format as any,
      quality: qualityVal,
    });
    
    if (onProgress) onProgress(80);

    const extension = format === 'image/png' ? 'png' : 'jpg';
    const originalName = file.name.replace(/\.[^/.]+$/, '');
    const fileName = `${originalName}.${extension}`;

    const newFile = new File([blob], fileName, { type: format });
    const previewUrl = URL.createObjectURL(newFile);

    if (onProgress) onProgress(100);

    return {
      file: newFile,
      previewUrl,
      originalSize: file.size,
      processedSize: newFile.size,
      fileName,
    };
  } catch (error) {
    console.error('HEIC conversion failed:', error);
    throw new Error('This HEIC/HEIF file could not be decoded. It may be corrupted or use an unsupported HEIC variant.');
  }
};
