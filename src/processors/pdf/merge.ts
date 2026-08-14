import { ProcessorResult, AppFile } from '../../types/file';

export const mergePdfs = async (
  files: AppFile[],
  options: Record<string, unknown>,
  onProgress?: (progress: number) => void
): Promise<ProcessorResult> => {
  if (!files || files.length === 0) {
    throw new Error('No PDF files provided for merging.');
  }

  try {
    onProgress?.(10);
    // Lazy-load pdf-lib to save bundle size
    const { PDFDocument } = await import('pdf-lib');
    onProgress?.(20);

    const mergedPdf = await PDFDocument.create();
    
    let totalPages = 0;
    
    const increment = 70 / files.length;
    let currentProgress = 20;

    for (const appFile of files) {
      try {
        const arrayBuffer = await appFile.file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
        
        const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
        copiedPages.forEach((page) => {
          mergedPdf.addPage(page);
        });
        
        totalPages += copiedPages.length;
        currentProgress += increment;
        onProgress?.(currentProgress);
      } catch (err) {
        console.error(`Error loading PDF ${appFile.name}:`, err);
        throw new Error(`Failed to process "${appFile.name}". The file may be corrupted or password-protected.`);
      }
    }

    onProgress?.(95);

    const mergedPdfBytes = await mergedPdf.save();
    
    const resultBlob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
    const resultFile = new File([resultBlob], 'merged.pdf', { type: 'application/pdf' });
    
    const previewUrl = URL.createObjectURL(resultBlob);
    
    onProgress?.(100);

    return {
      file: resultFile,
      previewUrl,
      originalSize: files.reduce((acc, f) => acc + f.size, 0),
      processedSize: resultFile.size,
      fileName: resultFile.name,
      metadata: {
        totalPages,
        inputFiles: files.length
      }
    };
  } catch (error: any) {
    console.error('PDF Merge Error:', error);
    if (error.message && error.message.includes('Failed to process')) {
      throw error;
    }
    throw new Error('Failed to merge PDFs. The files may be too large or corrupted.');
  }
};
