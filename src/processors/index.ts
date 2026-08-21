import { ProcessorFn } from '../types/file';
import { compressImage } from './image/compress';
import { resizeImage } from './image/resize';
import { cropImage } from './image/crop';
import { convertJpgToPng } from './image/jpgToPng';
import { convertPngToJpg } from './image/pngToJpg';
import { convertToWebp } from './image/webpConverter';
import { convertImageToPdf } from './image/imageToPdf';
import { convertPdfToImages } from './pdf/pdfToImages';
import { mergePdfs } from './pdf/merge';
import { convertHeic } from './image/heicConverter';

export { compressImage } from './image/compress';
export { resizeImage } from './image/resize';
export { cropImage } from './image/crop';
export { convertJpgToPng } from './image/jpgToPng';
export { convertPngToJpg } from './image/pngToJpg';
export { convertToWebp } from './image/webpConverter';
export { convertImageToPdf } from './image/imageToPdf';
export { convertPdfToImages } from './pdf/pdfToImages';
export { mergePdfs } from './pdf/merge';
export { convertHeic } from './image/heicConverter';

export const processorMap: Record<string, ProcessorFn> = {
  'image-compress': compressImage,
  'image-resize': resizeImage,
  'image-crop': cropImage,
  'jpg-to-png': convertJpgToPng,
  'png-to-jpg': convertPngToJpg,
  'webp-converter': convertToWebp,
  'image-to-pdf': convertImageToPdf,
  'pdf-to-images': convertPdfToImages,
  'pdf-merge': mergePdfs,
  'heic-converter': convertHeic,
};
