import { ProcessorFn } from '../../types/file';

export const loadImage = (file: File): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };
    
    img.src = url;
  });
};

export const resizeImage: ProcessorFn = async (file, options, onProgress) => {
  try {
    const img = await loadImage(file);
    
    let targetWidth = options.width as number | undefined;
    let targetHeight = options.height as number | undefined;
    const maintainAspectRatio = options.maintainAspectRatio !== false; // Default to true

    if (!targetWidth && !targetHeight) {
      throw new Error('Must specify at least width or height');
    }

    if (maintainAspectRatio) {
      const ratio = img.width / img.height;
      if (targetWidth && !targetHeight) {
        targetHeight = targetWidth / ratio;
      } else if (!targetWidth && targetHeight) {
        targetWidth = targetHeight * ratio;
      } else if (targetWidth && targetHeight) {
        const targetRatio = targetWidth / targetHeight;
        if (ratio > targetRatio) {
          targetHeight = targetWidth / ratio;
        } else {
          targetWidth = targetHeight * ratio;
        }
      }
    } else {
      targetWidth = targetWidth || img.width;
      targetHeight = targetHeight || img.height;
    }

    const canvas = document.createElement('canvas');
    canvas.width = Math.round(targetWidth!);
    canvas.height = Math.round(targetHeight!);
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');

    if (onProgress) onProgress(50);

    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, file.type, 1);
    });

    if (!blob) throw new Error('Canvas to Blob conversion failed');
    if (onProgress) onProgress(100);

    const originalName = file.name;
    const nameParts = originalName.split('.');
    const ext = nameParts.pop();
    const baseName = nameParts.join('.');
    const fileName = `${baseName}-${canvas.width}x${canvas.height}.${ext}`;
    
    const resizedFile = new File([blob], fileName, { type: file.type });
    const previewUrl = URL.createObjectURL(resizedFile);

    return {
      file: resizedFile,
      previewUrl,
      originalSize: file.size,
      processedSize: resizedFile.size,
      fileName,
    };
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Image resizing failed');
  }
};
