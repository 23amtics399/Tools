import React, { useState, useRef, useEffect } from 'react';
import type { PDFDocumentProxy } from 'pdfjs-dist';
import { PdfThumbnail } from './PdfThumbnail';
import { calculateVisualPosition } from '../../processors/pdf/utils';
import styles from './PdfCustomPositionEditor.module.css';

interface PdfCustomPositionEditorProps {
  pdfProxy: PDFDocumentProxy;
  pageIndex: number;
  previewText: string;
  fontSize: number; // in pt
  margin: number; // in pt
  initialPosition: string; // "top-left", "custom", etc.
  initialCustomCoordinates: { x: number, y: number } | null;
  onSave: (position: { x: number, y: number }) => void;
  onCancel: () => void;
}

export const PdfCustomPositionEditor: React.FC<PdfCustomPositionEditorProps> = ({
  pdfProxy,
  pageIndex,
  previewText,
  fontSize,
  margin,
  initialPosition,
  initialCustomCoordinates,
  onSave,
  onCancel
}) => {
  const [dims, setDims] = useState<{w: number, h: number} | null>(null);
  const [currentCoords, setCurrentCoords] = useState<{ x: number, y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [wrapperSize, setWrapperSize] = useState<{ w: number, h: number } | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const previewWrapperRef = useRef<HTMLDivElement>(null);

  // Approximate width of standard helvetica text: 0.55 * fontSize * numChars
  const pdfTextWidth = previewText.length * fontSize * 0.55; 
  const pdfTextHeight = fontSize; // standard leading/height is ~1x fontSize

  // Initialize position when dimensions are known
  useEffect(() => {
    if (!dims || currentCoords !== null) return;

    if (initialPosition === 'custom' && initialCustomCoordinates) {
      setCurrentCoords(initialCustomCoordinates);
    } else {
      // Calculate where the preset is on this specific page
      const { vx, vy } = calculateVisualPosition(
        initialPosition,
        dims.w,
        dims.h,
        pdfTextWidth,
        pdfTextHeight,
        margin
      );
      
      // vx, vy are bottom-left in PDF space. 
      // We want to find the center point (cx, cy) and convert to 0..1 DOM ratios
      const cx = vx + (pdfTextWidth / 2);
      const cy = vy + (pdfTextHeight / 2);

      const x = cx / dims.w;
      const y = 1 - (cy / dims.h);

      setCurrentCoords({ x, y });
    }
  }, [dims, initialPosition, initialCustomCoordinates, pdfTextWidth, pdfTextHeight, margin, currentCoords]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Track the size of the preview wrapper for responsive scaling
  useEffect(() => {
    if (!previewWrapperRef.current) return;
    const ro = new ResizeObserver(entries => {
      for (const entry of entries) {
        setWrapperSize({
          w: entry.contentRect.width,
          h: entry.contentRect.height
        });
      }
    });
    ro.observe(previewWrapperRef.current);
    return () => ro.disconnect();
  }, []);

  const updatePositionFromEvent = (e: React.PointerEvent<HTMLDivElement> | PointerEvent) => {
    if (!containerRef.current || pdfRenderWidth === 0 || pdfRenderHeight === 0) return;
    const rect = containerRef.current.getBoundingClientRect();
    
    const rawX = e.clientX - rect.left;
    const rawY = e.clientY - rect.top;

    const scaledTextW = pdfTextWidth * pdfScale;
    const scaledTextH = pdfTextHeight * pdfScale;

    // Clamp coordinates to keep entire text box inside the canvas
    const minX = scaledTextW / 2;
    const maxX = Math.max(minX, pdfRenderWidth - (scaledTextW / 2));
    
    const minY = scaledTextH / 2;
    const maxY = Math.max(minY, pdfRenderHeight - (scaledTextH / 2));

    const clampedX = Math.max(minX, Math.min(maxX, rawX));
    const clampedY = Math.max(minY, Math.min(maxY, rawY));

    setCurrentCoords({ 
      x: clampedX / pdfRenderWidth, 
      y: clampedY / pdfRenderHeight 
    });
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
    updatePositionFromEvent(e);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    updatePositionFromEvent(e);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  let pdfScale = 1;
  let pdfRenderWidth = 0;
  let pdfRenderHeight = 0;

  if (dims && wrapperSize) {
    const availW = Math.max(0, wrapperSize.w - 32);
    const availH = Math.max(0, wrapperSize.h - 32);
    
    pdfScale = Math.min(availW / dims.w, availH / dims.h, 1);
    
    if (dims.w * pdfScale < 280) {
      pdfScale = 280 / dims.w;
    }
    
    pdfRenderWidth = dims.w * pdfScale;
    pdfRenderHeight = dims.h * pdfScale;
  }

  const calculateStyle = () => {
    if (!dims || !currentCoords || pdfRenderWidth === 0) return { display: 'none' };
    
    const centerX = currentCoords.x * pdfRenderWidth;
    const centerY = currentCoords.y * pdfRenderHeight;

    return {
      position: 'absolute' as const,
      left: `${centerX}px`,
      top: `${centerY}px`,
      transform: 'translate(-50%, -50%)',
      fontSize: `${fontSize * pdfScale}px`,
      color: 'black',
      fontFamily: 'Helvetica, Arial, sans-serif',
      whiteSpace: 'nowrap' as const
    };
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h3>Custom Page Number Position</h3>
          <div className={styles.actions}>
            <button onClick={onCancel} className={styles.btnSecondary}>Cancel</button>
            <button 
              onClick={() => currentCoords && onSave(currentCoords)} 
              className={styles.btnPrimary}
              disabled={!currentCoords}
            >
              Use Position
            </button>
          </div>
        </div>
        
        <div className={styles.content}>
          <div className={styles.hint}>
            Drag the page number or click anywhere on the page to reposition it.
          </div>
          
          <div className={styles.previewWrapper} ref={previewWrapperRef}>
            {wrapperSize && (
              <div 
                className={styles.pdfContainer} 
                style={{ 
                  width: pdfRenderWidth > 0 ? pdfRenderWidth : '100%', 
                  height: pdfRenderHeight > 0 ? pdfRenderHeight : '100%' 
                }}
              >
                <PdfThumbnail 
                  pdf={pdfProxy} 
                  pageIndex={pageIndex}
                  mode="editor"
                  width={1000} // High resolution for sharpness
                  onRender={setDims}
                >
                  {dims && (
                    <div 
                      className={styles.interactiveLayer}
                      ref={containerRef}
                      onPointerDown={handlePointerDown}
                      onPointerMove={handlePointerMove}
                      onPointerUp={handlePointerUp}
                      onPointerCancel={handlePointerUp}
                    >
                      {currentCoords && (
                        <div 
                          className={`${styles.textOverlay} ${isDragging ? styles.dragging : ''}`}
                          style={calculateStyle()}
                        >
                          {previewText}
                        </div>
                      )}
                    </div>
                  )}
                </PdfThumbnail>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
