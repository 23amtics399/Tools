import { ProcessorFn, CropData } from '../../types/file';
import { loadImage } from './resize';

export const cropImage: ProcessorFn = async (file, options, onProgress) => {
  try {
    const cropData = options.cropData as CropData;
    if (!cropData || typeof cropData.x !== 'number' || typeof cropData.y !== 'number' || typeof cropData.width !== 'number' || typeof cropData.height !== 'number') {
      throw new Error('Invalid crop data provided');
    }

    const img = await loadImage(file);
    const canvas = document.createElement('canvas');
    canvas.width = cropData.width;
    canvas.height = cropData.height;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');

    if (onProgress) onProgress(50);

    ctx.drawImage(
      img,
      cropData.x,
      cropData.y,
      cropData.width,
      cropData.height,
      0,
      0,
      cropData.width,
      cropData.height
    );

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, file.type, 1);
    });

    if (!blob) throw new Error('Canvas to Blob conversion failed');
    if (onProgress) onProgress(100);

    const originalName = file.name;
    const nameParts = originalName.split('.');
    const ext = nameParts.pop();
    const baseName = nameParts.join('.');
    const fileName = `${baseName}-cropped.${ext}`;
    
    const croppedFile = new File([blob], fileName, { type: file.type });
    const previewUrl = URL.createObjectURL(croppedFile);

    return {
      file: croppedFile,
      previewUrl,
      originalSize: file.size,
      processedSize: croppedFile.size,
      fileName,
    };
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Image cropping failed');
  }
};
