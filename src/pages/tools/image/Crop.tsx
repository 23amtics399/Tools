import React, { useRef } from 'react';
import Cropper, { ReactCropperElement } from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { getToolById } from '../../../config/tools';
import { cropImage } from '../../../processors/image/crop';
import ToolPageLayout from '../../../components/tool/ToolPageLayout';
import { AppFile, ProcessorResult } from '../../../types/file';
import FileUploadZone from '../../../components/tool/FileUploadZone';
import styles from './Crop.module.css';

const tool = getToolById('image-crop')!;

export default function CropPage() {
  const cropperRef = useRef<ReactCropperElement>(null);

  const customUpload = (files: AppFile[], addFiles: (files: File[]) => void) => {
    if (files.length === 0) {
      return (
        <FileUploadZone 
          onFiles={addFiles} 
          acceptedTypes={tool.acceptedTypes} 
          maxFiles={tool.maxFiles} 
          maxSizeMB={tool.maxFileSizeMB} 
        />
      );
    }
    const file = files[0];
    const imageUrl = file.previewUrl || '';
    
    return (
      <div className={styles.uploadContainer}>
        <div className={styles.cropperWrapper}>
          <Cropper
            src={imageUrl}
            style={{ height: 400, width: '100%' }}
            initialAspectRatio={1}
            guides={true}
            ref={cropperRef}
          />
        </div>
        <p className={styles.hintText}>Crop data will be extracted automatically on process.</p>
      </div>
    );
  };

  const customResult = (results: ProcessorResult[], files: AppFile[]) => {
    if (results.length === 0) return null;
    const result = results[0];
    
    return (
      <div className={styles.resultContainer}>
        <div className={styles.resultImageWrapper}>
          <img src={result.previewUrl} alt="Cropped result" className={styles.resultImage} />
        </div>
        <div className={styles.resultInfo}>
          <h4 className={styles.fileName}>{result.fileName}</h4>
          <p className={styles.fileSize}>
            {(result.originalSize / 1024).toFixed(1)} KB → {(result.processedSize / 1024).toFixed(1)} KB
          </p>
          <a
            href={result.previewUrl}
            download={result.fileName}
            className={styles.downloadButton}
          >
            Download Cropped Image
          </a>
        </div>
      </div>
    );
  };

  const processWithCropData = async (file: File, options: Record<string, unknown>, onProgress?: (p: number) => void) => {
    if (cropperRef.current?.cropper) {
      const cropData = cropperRef.current.cropper.getData();
      return cropImage(file, { ...options, cropData }, onProgress);
    }
    throw new Error('Cropper not initialized');
  };

  return <ToolPageLayout tool={tool} processorFn={processWithCropData} renderCustomUpload={customUpload} renderCustomResult={customResult} />;
}
