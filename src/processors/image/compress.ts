import imageCompression from 'browser-image-compression';
import { ProcessorFn } from '../../types/file';

export const compressImage: ProcessorFn = async (file, options, onProgress) => {
  try {
    const quality = typeof options.quality === 'number' ? options.quality : 80;
    const initialQuality = quality / 100;
    
    const compressOptions = {
      initialQuality,
      useWebWorker: true,
      onProgress,
      ...(options.maxWidthOrHeight ? { maxWidthOrHeight: options.maxWidthOrHeight as number } : {}),
      ...(options.outputFormat && options.outputFormat !== 'keep' ? { fileType: options.outputFormat as string } : {})
    };

    const compressedBlob = await imageCompression(file, compressOptions);
    
    const originalName = file.name;
    const nameParts = originalName.split('.');
    nameParts.pop(); // remove original extension
    const baseName = nameParts.join('.');
    
    let ext = file.name.split('.').pop() || 'jpg';
    if (options.outputFormat === 'image/jpeg') ext = 'jpg';
    else if (options.outputFormat === 'image/webp') ext = 'webp';
    else if (options.outputFormat === 'image/png') ext = 'png';
    else if (compressedBlob.type === 'image/jpeg') ext = 'jpg';
    else if (compressedBlob.type === 'image/webp') ext = 'webp';
    else if (compressedBlob.type === 'image/png') ext = 'png';

    const fileName = `${baseName}-compressed.${ext}`;
    
    const compressedFile = new File([compressedBlob], fileName, { type: compressedBlob.type });
    const previewUrl = URL.createObjectURL(compressedFile);

    return {
      file: compressedFile,
      previewUrl,
      originalSize: file.size,
      processedSize: compressedFile.size,
      fileName,
    };
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Image compression failed');
  }
};
