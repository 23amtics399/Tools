import { ProcessorFn } from '../../types/file';
import { loadImage } from './resize';

export const convertPngToJpg: ProcessorFn = async (file, options, onProgress) => {
  try {
    const img = await loadImage(file);
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');

    if (onProgress) onProgress(50);

    // Draw background first for transparency
    const bgColor = (options.backgroundColor as string) || '#ffffff';
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.drawImage(img, 0, 0);

    const quality = typeof options.quality === 'number' ? options.quality / 100 : 0.92;
    
    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, 'image/jpeg', quality);
    });

    if (!blob) throw new Error('Canvas to Blob conversion failed');
    if (onProgress) onProgress(100);

    const originalName = file.name;
    const fileName = originalName.replace(/\.png$/i, '.jpg');
    
    const convertedFile = new File([blob], fileName, { type: 'image/jpeg' });
    const previewUrl = URL.createObjectURL(convertedFile);

    return {
      file: convertedFile,
      previewUrl,
      originalSize: file.size,
      processedSize: convertedFile.size,
      fileName,
    };
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'PNG to JPG conversion failed');
  }
};
