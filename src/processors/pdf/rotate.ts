import { PDFDocument, degrees } from 'pdf-lib';
import { ProcessorFn } from '../../types/file';
import { parseRanges } from './utils';

export const rotatePdf: ProcessorFn = async (file, options, onProgress) => {
  const rotationStr = (options.rotation as string) || '90';
  const applyTo = (options.applyTo as string) || 'all';
  const ranges = (options.ranges as string) || '';

  const rotationAngle = parseInt(rotationStr, 10);
  if (isNaN(rotationAngle) || ![90, 180, 270].includes(rotationAngle)) {
    throw new Error('Invalid rotation angle.');
  }

  const arrayBuffer = await file.arrayBuffer();
  
  let sourcePdf: PDFDocument;
  try {
    sourcePdf = await PDFDocument.load(arrayBuffer);
  } catch (err: any) {
    if (err.message?.includes('encrypted') || err.message?.includes('password')) {
      throw new Error('This PDF is encrypted or password-protected and cannot be processed.');
    }
    throw new Error('Failed to load PDF document. It may be invalid or corrupted.');
  }

  const totalPages = sourcePdf.getPageCount();
  if (totalPages === 0) {
    throw new Error('This PDF has no pages.');
  }

  let selectedPages: number[] = [];
  if (applyTo === 'all') {
    selectedPages = Array.from({ length: totalPages }, (_, i) => i + 1);
  } else {
    try {
      selectedPages = parseRanges(ranges, totalPages);
    } catch (err: any) {
      // Re-throw with clean error message
      throw new Error(err.message);
    }
  }

  if (selectedPages.length === 0) {
    throw new Error('No valid pages selected to rotate.');
  }

  const pageIndices = selectedPages.map(p => p - 1);

  if (onProgress) onProgress(20);

  // Apply rotation
  for (let i = 0; i < pageIndices.length; i++) {
    const pageIndex = pageIndices[i];
    const page = sourcePdf.getPage(pageIndex);
    
    // getRotation returns an object { angle: number, type: RotationTypes }
    // We add the new angle to the existing one and normalize it.
    const currentAngle = page.getRotation().angle;
    const newAngle = (currentAngle + rotationAngle) % 360;
    
    page.setRotation(degrees(newAngle));

    if (onProgress && i % 10 === 0) {
      onProgress(20 + ((i / pageIndices.length) * 40));
    }
  }

  if (onProgress) onProgress(70);

  const pdfBytes = await sourcePdf.save();
  
  if (onProgress) onProgress(100);

  const baseName = file.name.replace(/\.[^/.]+$/, "");
  const resultFile = new File([pdfBytes], `${baseName}_rotated.pdf`, { type: 'application/pdf' });
  const previewUrl = URL.createObjectURL(resultFile);

  return {
    file: resultFile,
    previewUrl,
    originalSize: file.size,
    processedSize: resultFile.size,
    fileName: resultFile.name,
  };
};
