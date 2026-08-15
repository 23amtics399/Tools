import { PDFDocument } from 'pdf-lib';
import { ProcessorFn } from '../../types/file';

export const removePdfPages: ProcessorFn = async (file, options, onProgress) => {
  const pagesToRemove = options.pagesToRemove as number[]; // 1-indexed page numbers

  if (!pagesToRemove || pagesToRemove.length === 0) {
    throw new Error('No pages selected for removal.');
  }

  onProgress?.(10);

  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);

  onProgress?.(30);

  const totalPages = pdfDoc.getPageCount();

  if (pagesToRemove.length >= totalPages) {
    throw new Error('You must keep at least one page in the document.');
  }

  // Convert to 0-indexed for pdf-lib, filter out invalid indices
  const indicesToRemove = pagesToRemove
    .map(p => p - 1)
    .filter(i => i >= 0 && i < totalPages);

  // Sort in descending order to avoid shifting indices when removing
  indicesToRemove.sort((a, b) => b - a);

  // Remove pages
  for (const index of indicesToRemove) {
    pdfDoc.removePage(index);
  }

  onProgress?.(70);

  const pdfBytes = await pdfDoc.save();

  onProgress?.(90);

  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const resultFile = new File([blob], file.name.replace(/\.[^/.]+$/, '_removed.pdf'), {
    type: 'application/pdf'
  });

  const previewUrl = URL.createObjectURL(blob);

  onProgress?.(100);

  return {
    file: resultFile,
    previewUrl,
    originalSize: file.size,
    processedSize: resultFile.size,
    fileName: resultFile.name
  };
};
