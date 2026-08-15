import { PDFDocument } from 'pdf-lib';
import JSZip from 'jszip';
import { ProcessorFn, ProcessorResult } from '../../types/file';

import { parseRanges } from './utils';

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
