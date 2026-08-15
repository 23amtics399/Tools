import { PDFDocument } from 'pdf-lib';
import { ProcessorResult } from '../../types/file';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

async function structuralOptimizePdf(file: File): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  const originalPdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: false });
  const optimizedPdf = await PDFDocument.create();
  const pageIndices = originalPdf.getPageIndices();
  const copiedPages = await optimizedPdf.copyPages(originalPdf, pageIndices);
  copiedPages.forEach((page) => optimizedPdf.addPage(page));
  return await optimizedPdf.save({ useObjectStreams: true, addDefaultPage: false });
}

async function rasterizePdf(file: File, scale: number, quality: number, onProgress?: (p: number) => void): Promise<Uint8Array> {
  const pdfjsLib = await import('pdfjs-dist');
  pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;
  const numPages = pdf.numPages;

  const newPdf = await PDFDocument.create();

  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i);
    
    // Use original dimensions for the PDF page
    const originalViewport = page.getViewport({ scale: 1.0 });
    const renderViewport = page.getViewport({ scale });

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');
    
    canvas.width = renderViewport.width;
    canvas.height = renderViewport.height;

    await page.render({ canvasContext: ctx, viewport: renderViewport, canvas }).promise;

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, 'image/jpeg', quality);
    });

    if (!blob) throw new Error(`Failed to rasterize page ${i}`);
    
    const jpgBytes = new Uint8Array(await blob.arrayBuffer());
    const jpgImage = await newPdf.embedJpg(jpgBytes);
    
    const newPage = newPdf.addPage([originalViewport.width, originalViewport.height]);
    
    newPage.drawImage(jpgImage, {
      x: 0,
      y: 0,
      width: originalViewport.width,
      height: originalViewport.height,
    });
    
    // Cleanup
    page.cleanup();
    canvas.width = 0;
    canvas.height = 0;
    
    if (onProgress) {
      onProgress(Math.round((i / numPages) * 90));
    }
  }

  const saved = await newPdf.save({ useObjectStreams: true, addDefaultPage: false });
  loadingTask.destroy();
  return saved;
}

export async function compressPdf(
  file: File,
  options: Record<string, unknown>,
  onProgress?: (progress: number) => void
): Promise<ProcessorResult> {
  const levelStr = (options.compressionLevel as string) || '50';
  const level = parseInt(levelStr, 10);
  
  onProgress?.(5);

  let arrayBuffer: ArrayBuffer;
  try {
    arrayBuffer = await file.arrayBuffer();
  } catch (error) {
    throw new Error('Failed to read the PDF file. It might be corrupted or inaccessible.');
  }

  try {
    const originalPdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: false });
    if (originalPdf.isEncrypted) throw new Error('This PDF is encrypted and cannot be compressed.');
  } catch (error: any) {
    if (error?.message?.includes('encrypted') || error?.message?.includes('password') || error?.message?.includes('Encrypted')) {
      throw new Error('This PDF is password-protected or encrypted and cannot be compressed.');
    }
    throw new Error('Failed to parse the PDF. The file may be corrupted.');
  }

  onProgress?.(10);
  
  let bestBytes: Uint8Array | null = null;
  
  try {
    if (level === 10) {
      bestBytes = await structuralOptimizePdf(file);
    } else if (level === 30) {
      bestBytes = await structuralOptimizePdf(file);
      if (bestBytes.byteLength >= file.size * 0.95) {
        const rastBytes = await rasterizePdf(file, 2.0, 0.9, onProgress);
        if (rastBytes.byteLength < bestBytes.byteLength) {
          bestBytes = rastBytes;
        }
      }
    } else if (level === 50) {
      bestBytes = await rasterizePdf(file, 1.5, 0.75, onProgress);
      if (bestBytes.byteLength >= file.size) {
        const fallback = await rasterizePdf(file, 1.2, 0.6, onProgress);
        if (fallback.byteLength < bestBytes.byteLength) bestBytes = fallback;
      }
    } else if (level === 70) {
      bestBytes = await rasterizePdf(file, 1.2, 0.6, onProgress);
      if (bestBytes.byteLength >= file.size) {
        const fallback = await rasterizePdf(file, 1.0, 0.4, onProgress);
        if (fallback.byteLength < bestBytes.byteLength) bestBytes = fallback;
      }
    } else if (level === 90) {
      bestBytes = await rasterizePdf(file, 1.0, 0.4, onProgress);
      if (bestBytes.byteLength >= file.size) {
        const fallback = await rasterizePdf(file, 0.8, 0.3, onProgress);
        if (fallback.byteLength < bestBytes.byteLength) bestBytes = fallback;
      }
    }
  } catch (error: any) {
    throw new Error('An error occurred during compression: ' + (error?.message || 'Unknown error'));
  }

  onProgress?.(95);

  const compressedSize = bestBytes ? bestBytes.byteLength : file.size;
  const originalSize = file.size;

  if (!bestBytes || compressedSize >= originalSize) {
    const originalPreviewUrl = URL.createObjectURL(file);
    onProgress?.(100);
    return {
      file,
      previewUrl: originalPreviewUrl,
      originalSize,
      processedSize: originalSize,
      fileName: file.name,
      metadata: {
        optimized: false,
        reason: 'This PDF is already highly optimized. We kept the original file to avoid increasing its size.'
      }
    };
  }

  const blob = new Blob([bestBytes], { type: 'application/pdf' });
  const baseName = file.name.replace(/\.[^/.]+$/, "");
  const newFileName = `${baseName}-compressed.pdf`;
  const newFile = new File([blob], newFileName, { type: 'application/pdf' });
  const previewUrl = URL.createObjectURL(newFile);
  
  onProgress?.(100);

  return {
    file: newFile,
    previewUrl,
    originalSize,
    processedSize: compressedSize,
    fileName: newFileName,
    metadata: {
      optimized: true
    }
  };
}
