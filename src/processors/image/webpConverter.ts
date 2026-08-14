import { ProcessorFn } from '../../types/file';
import { loadImage } from './resize';

export const convertToWebp: ProcessorFn = async (file, options, onProgress) => {
  try {
    const img = await loadImage(file);
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');

    if (onProgress) onProgress(50);
    ctx.drawImage(img, 0, 0);

    const quality = typeof options.quality === 'number' ? options.quality / 100 : 0.8;

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, 'image/webp', quality);
    });

    if (!blob) throw new Error('Canvas to Blob conversion failed');
    if (onProgress) onProgress(100);

    const originalName = file.name;
    const nameParts = originalName.split('.');
    nameParts.pop(); // remove old extension
    const fileName = `${nameParts.join('.')}.webp`;
    
    const convertedFile = new File([blob], fileName, { type: 'image/webp' });
    const previewUrl = URL.createObjectURL(convertedFile);

    return {
      file: convertedFile,
      previewUrl,
      originalSize: file.size,
      processedSize: convertedFile.size,
      fileName,
    };
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'WebP conversion failed');
  }
};
