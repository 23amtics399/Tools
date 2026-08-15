import { PDFDocument, rgb, StandardFonts, degrees } from 'pdf-lib';
import { ProcessorFn } from '../../types/file';
import { parseRanges, getFontSizeForOption, getMarginForOption, calculateVisualPosition } from './utils';

export const numberPdfPages: ProcessorFn = async (file, options, onProgress) => {
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

  const pagesInput = (options.pages as string) || '';
  let selectedPages: number[] = [];
  try {
    selectedPages = parseRanges(pagesInput, totalPages);
  } catch (err: any) {
    throw new Error(err.message);
  }

  if (selectedPages.length === 0) {
    throw new Error('No valid pages selected for numbering.');
  }

  const selectedPagesSet = new Set(selectedPages.map(p => p - 1));

  const position = (options.position as string) || 'bottom-center';
  const customPosition = options.customPosition as { x: number; y: number } | undefined;
  const format = (options.format as string) || '1';
  const startingNumberStr = (options.startingNumber as string) || '1';
  let startingNumber = parseInt(startingNumberStr, 10);
  if (isNaN(startingNumber) || startingNumber < 0) {
    throw new Error('Starting number must be a valid positive number or zero.');
  }

  const fontSizeOption = (options.fontSize as string) || 'medium';
  const fontSize = getFontSizeForOption(fontSizeOption);

  const marginOption = (options.margin as string) || 'medium';
  const margin = getMarginForOption(marginOption);

  if (onProgress) onProgress(10);

  const font = await sourcePdf.embedFont(StandardFonts.Helvetica);
  
  if (onProgress) onProgress(20);

  let currentNumber = startingNumber;
  const totalSelected = selectedPages.length;

  for (let i = 0; i < totalPages; i++) {
    if (selectedPagesSet.has(i)) {
      const page = sourcePdf.getPage(i);
      
      let text = String(currentNumber);
      if (format === 'Page 1') {
        text = `Page ${currentNumber}`;
      } else if (format === 'Page 1 of X') {
        text = `Page ${currentNumber} of ${totalSelected}`;
      }

      const textWidth = font.widthOfTextAtSize(text, fontSize);
      const textHeight = font.heightAtSize(fontSize);
      
      const angle = page.getRotation().angle;
      // Get raw unrotated media box dimensions
      const originalW = page.getWidth();
      const originalH = page.getHeight();
      
      // Determine visual dimensions
      const isSideways = angle === 90 || angle === 270;
      const visualW = isSideways ? originalH : originalW;
      const visualH = isSideways ? originalW : originalH;
      
      // Calculate visual coordinates (0,0 is visual bottom-left)
      const { vx, vy } = calculateVisualPosition(position, visualW, visualH, textWidth, textHeight, margin, customPosition);
      
      // Map visual coordinates to original media box coordinates
      let x = vx;
      let y = vy;
      
      if (angle === 90) {
        x = originalW - vy;
        y = vx;
      } else if (angle === 180) {
        x = originalW - vx;
        y = originalH - vy;
      } else if (angle === 270) {
        x = vy;
        y = originalH - vx;
      }
      
      const textRotation = degrees(angle);

      page.drawText(text, {
        x,
        y,
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
        rotate: textRotation,
      });

      currentNumber++;
    }

    if (onProgress && i % 10 === 0) {
      onProgress(20 + ((i / totalPages) * 70));
    }
  }

  if (onProgress) onProgress(90);

  const pdfBytes = await sourcePdf.save();
  
  if (onProgress) onProgress(100);

  const baseName = file.name.replace(/\.[^/.]+$/, "");
  const resultFile = new File([pdfBytes as any], `${baseName}_numbered.pdf`, { type: 'application/pdf' });
  const previewUrl = URL.createObjectURL(resultFile);

  return {
    file: resultFile,
    previewUrl,
    originalSize: file.size,
    processedSize: resultFile.size,
    fileName: resultFile.name,
  };
};
