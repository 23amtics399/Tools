import { PDFDocument } from 'pdf-lib';
import JSZip from 'jszip';
import { ProcessorFn, ProcessorResult } from '../../types/file';

/**
 * Parses a page range string like "1-3, 5, 8-10" into an array of 1-based page numbers.
 */
function parseRanges(rangesStr: string, totalPages: number): number[] {
  const str = rangesStr.trim().toLowerCase();
  if (!str || str === 'all') {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: number[] = [];
  const parts = str.split(',').map(p => p.trim()).filter(Boolean);

  for (const part of parts) {
    if (part.includes('-')) {
      const [startStr, endStr] = part.split('-');
      const start = parseInt(startStr, 10);
      const end = parseInt(endStr, 10);
      
      if (!isNaN(start) && !isNaN(end)) {
        const min = Math.min(start, end);
        const max = Math.max(start, end);
        // Add all pages in range
        for (let i = min; i <= max; i++) {
          pages.push(i);
        }
      }
    } else {
      const page = parseInt(part, 10);
      if (!isNaN(page)) {
        pages.push(page);
      }
    }
  }

  // Filter out duplicates and out-of-bounds, but preserve requested order for valid pages
  // Note: users might want duplicates or specific orders? The requirements said "preserve exact order specified".
  // The unique filtering isn't strictly requested to remove duplicates, but usually users don't want duplicates.
  // Wait, the prompt says "preserve exact page order specified by the user".
  // Let's filter out only out of bounds pages.
  const validPages = pages.filter(p => p >= 1 && p <= totalPages);
  
  // Return unique pages preserving first seen order
  const uniquePages = Array.from(new Set(validPages));
  
  if (uniquePages.length === 0) {
    // Fallback if they entered garbage
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  
  return uniquePages;
}

export const splitPdf: ProcessorFn = async (file, options, onProgress) => {
  const ranges = (options.ranges as string) || 'all';
  const mode = (options.mode as string) || 'combine'; // 'combine' or 'separate'

  const arrayBuffer = await file.arrayBuffer();
  const sourcePdf = await PDFDocument.load(arrayBuffer);
  const totalPages = sourcePdf.getPageCount();

  const selectedPages = parseRanges(ranges, totalPages);
  // Convert 1-based to 0-based for pdf-lib
  const pageIndices = selectedPages.map(p => p - 1);

  if (mode === 'separate') {
    // Create a ZIP of individual PDFs
    const zip = new JSZip();
    const baseName = file.name.replace(/\.[^/.]+$/, "");

    for (let i = 0; i < pageIndices.length; i++) {
      const pageIndex = pageIndices[i];
      const newPdf = await PDFDocument.create();
      const [copiedPage] = await newPdf.copyPages(sourcePdf, [pageIndex]);
      newPdf.addPage(copiedPage);

      const pdfBytes = await newPdf.save();
      // Name files like filename_page_1.pdf
      zip.file(`${baseName}_page_${pageIndex + 1}.pdf`, pdfBytes);
      
      if (onProgress) {
        onProgress(((i + 1) / pageIndices.length) * 80); // 80% for PDF creation
      }
    }

    const zipBlob = await zip.generateAsync({ type: 'blob' }, (metadata) => {
      if (onProgress) {
        onProgress(80 + (metadata.percent * 0.2)); // last 20% for zipping
      }
    });

    const resultFile = new File([zipBlob], `${baseName}_split.zip`, { type: 'application/zip' });
    const previewUrl = URL.createObjectURL(zipBlob); // ZIPs don't preview well but we need a URL

    return {
      file: resultFile,
      previewUrl,
      originalSize: file.size,
      processedSize: resultFile.size,
      fileName: resultFile.name,
    };
  } else {
    // mode === 'combine'
    const newPdf = await PDFDocument.create();
    
    // Copy all selected pages at once
    const copiedPages = await newPdf.copyPages(sourcePdf, pageIndices);
    for (const page of copiedPages) {
      newPdf.addPage(page);
    }

    if (onProgress) onProgress(80);

    const pdfBytes = await newPdf.save();
    
    if (onProgress) onProgress(100);

    const baseName = file.name.replace(/\.[^/.]+$/, "");
    const resultFile = new File([pdfBytes], `${baseName}_split.pdf`, { type: 'application/pdf' });
    const previewUrl = URL.createObjectURL(resultFile);

    return {
      file: resultFile,
      previewUrl,
      originalSize: file.size,
      processedSize: resultFile.size,
      fileName: resultFile.name,
    };
  }
};
