import { ProcessorFn } from '../../types/file';
// Vite specific import for worker URL
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

export const convertPdfToImages: ProcessorFn = async (file, options, onProgress) => {
  try {
    const pdfjsLib = await import('pdfjs-dist');
    pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

    const format = (options.format as 'png' | 'jpg') === 'jpg' ? 'image/jpeg' : 'image/png';
    const quality = typeof options.quality === 'number' ? options.quality / 100 : 0.92;
    const scale = typeof options.scale === 'number' ? options.scale : 2; // Default 2x for better quality

    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    const numPages = pdf.numPages;

    if (numPages === 0) {
      throw new Error('PDF has no pages');
    }

    const allPages: Array<{ file: File; previewUrl: string; fileName: string }> = [];

    for (let i = 1; i <= numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale });
      
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context');
      
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      await page.render({ canvasContext: ctx, viewport, canvas }).promise;

      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob(resolve, format, quality);
      });

      if (!blob) throw new Error(`Failed to convert page ${i} to image`);

      const ext = format === 'image/jpeg' ? 'jpg' : 'png';
      const baseName = file.name.replace(/\.pdf$/i, '');
      const fileName = `${baseName}-page-${i}.${ext}`;
      
      const pageFile = new File([blob], fileName, { type: format });
      const previewUrl = URL.createObjectURL(pageFile);

      allPages.push({ file: pageFile, previewUrl, fileName });

      if (onProgress) {
        onProgress(Math.round((i / numPages) * 100));
      }
    }

    const firstPage = allPages[0];

    return {
      file: firstPage.file,
      previewUrl: firstPage.previewUrl,
      originalSize: file.size,
      processedSize: firstPage.file.size,
      fileName: firstPage.fileName,
      metadata: {
        allPages,
        pageCount: numPages
      }
    };

  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'PDF to Images conversion failed');
  }
};
