import { ProcessorFn } from '../../types/file';
import { loadImage } from './resize';

export const convertImageToPdf: ProcessorFn = async (file, options, onProgress) => {
  try {
    const { jsPDF } = await import('jspdf');
    
    const img = await loadImage(file);
    if (onProgress) onProgress(30);

    const pageSize = (options.pageSize as string) || 'a4';
    let orientation = (options.orientation as 'portrait' | 'landscape' | 'auto') || 'auto';
    const marginStr = options.margin;
    const margin = typeof marginStr === 'number' ? marginStr : 0;

    if (orientation === 'auto') {
      orientation = img.width > img.height ? 'landscape' : 'portrait';
    }

    let pdf;
    let pdfWidth: number;
    let pdfHeight: number;

    if (pageSize === 'original') {
      pdfWidth = img.width * 0.264583; // roughly px to mm
      pdfHeight = img.height * 0.264583;
      pdf = new jsPDF({
        orientation: pdfWidth > pdfHeight ? 'landscape' : 'portrait',
        unit: 'mm',
        format: [pdfWidth + margin * 2, pdfHeight + margin * 2]
      });
    } else {
      pdf = new jsPDF({
        orientation: orientation === 'landscape' ? 'landscape' : 'portrait',
        unit: 'mm',
        format: pageSize
      });
      pdfWidth = pdf.internal.pageSize.getWidth() - (margin * 2);
      pdfHeight = pdf.internal.pageSize.getHeight() - (margin * 2);
    }

    if (onProgress) onProgress(60);

    const imgRatio = img.width / img.height;
    const pdfRatio = pdfWidth / pdfHeight;
    
    let finalWidth = pdfWidth;
    let finalHeight = pdfHeight;
    
    if (pageSize !== 'original') {
      if (imgRatio > pdfRatio) {
        finalHeight = finalWidth / imgRatio;
      } else {
        finalWidth = finalHeight * imgRatio;
      }
    }

    const x = margin + (pdfWidth - finalWidth) / 2;
    const y = margin + (pdfHeight - finalHeight) / 2;

    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    if (ctx) {
        ctx.drawImage(img, 0, 0);
    }

    const dataUrl = canvas.toDataURL('image/jpeg', 1.0);
    
    pdf.addImage(dataUrl, 'JPEG', x, y, finalWidth, finalHeight);
    
    if (onProgress) onProgress(90);

    const pdfBlob = pdf.output('blob');
    const fileName = `${file.name.split('.')[0]}.pdf`;
    
    const pdfFile = new File([pdfBlob], fileName, { type: 'application/pdf' });
    const previewUrl = URL.createObjectURL(pdfFile);

    if (onProgress) onProgress(100);

    return {
      file: pdfFile,
      previewUrl,
      originalSize: file.size,
      processedSize: pdfFile.size,
      fileName,
    };
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Image to PDF conversion failed');
  }
};
