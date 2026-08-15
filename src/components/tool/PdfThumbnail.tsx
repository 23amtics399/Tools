import React, { useEffect, useRef, useState } from 'react';
import type { PDFDocumentProxy } from 'pdfjs-dist';

interface PdfThumbnailProps {
  pdf: PDFDocumentProxy;
  pageIndex: number; // 1-indexed
  mode?: 'rotate' | 'select';
  
  // Rotate mode props
  additionalRotation?: number;
  onRotateCw?: () => void;
  onRotateCcw?: () => void;

  // Select mode props
  isSelected?: boolean;
  onToggleSelect?: () => void;
}

export function PdfThumbnail({
  pdf,
  pageIndex,
  mode = 'rotate',
  additionalRotation = 0,
  onRotateCw,
  onRotateCcw,
  isSelected = false,
  onToggleSelect
}: PdfThumbnailProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isVisible, setIsVisible] = useState(true); // Temporarily true
  const [isRendered, setIsRendered] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState({ w: 150, h: 212 });

  useEffect(() => {
    if (!isVisible || isRendered || error) return;
    if (!canvasRef.current) {
      console.log(`Canvas ref is null for page ${pageIndex}`);
      return;
    }

    let isCancelled = false;
    
    const renderPage = async () => {
      try {
        console.log(`Rendering page ${pageIndex}...`);
        const page = await pdf.getPage(pageIndex);
        if (isCancelled) return;
        
        // Render at a fixed width of 150px for consistency and low memory usage
        const unscaledViewport = page.getViewport({ scale: 1 });
        const scale = 150 / unscaledViewport.width;
        const viewport = page.getViewport({ scale });
        
        const canvas = canvasRef.current;
        if (!canvas) {
           throw new Error('Canvas disappeared');
        }
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
           throw new Error('Could not get 2d context');
        }
        
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        setDimensions({ w: viewport.width, h: viewport.height });
        
        await page.render({ canvasContext: ctx, viewport, canvas }).promise;
        
        if (!isCancelled) {
          console.log(`Rendered page ${pageIndex} successfully`);
          setIsRendered(true);
        }
      } catch (err) {
        console.error(`Error rendering page ${pageIndex}:`, err);
        if (!isCancelled) {
          setError(`Unable to preview page ${pageIndex}`);
        }
      }
    };
    
    renderPage();
    
    return () => {
      isCancelled = true;
    };
  }, [isVisible, isRendered, pdf, pageIndex]);

  const isRotated = Math.abs(additionalRotation) % 180 === 90;
  const wrapperWidth = isRotated ? dimensions.h : dimensions.w;
  const wrapperHeight = isRotated ? dimensions.w : dimensions.h;

  const handleContainerClick = () => {
    if (mode === 'select' && onToggleSelect) {
      onToggleSelect();
    }
  };

  const isSelectMode = mode === 'select';

  return (
    <div 
      ref={containerRef} 
      onClick={handleContainerClick}
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        gap: '0.75rem', 
        width: '100%', 
        padding: '1rem', 
        backgroundColor: 'var(--color-surface)', 
        borderRadius: '8px', 
        border: isSelectMode && isSelected ? '2px solid var(--color-error)' : '2px solid var(--color-border)',
        cursor: isSelectMode ? 'pointer' : 'default',
        position: 'relative',
        transition: 'all 0.2s ease',
        opacity: isSelectMode && isSelected ? 0.8 : 1,
      }}
    >
      <div style={{
        width: `${wrapperWidth}px`,
        height: `${wrapperHeight}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        transition: 'width 0.3s ease, height 0.3s ease',
      }}>
        {!isRendered && !error && (
          <div style={{ position: 'absolute', color: 'var(--color-muted)', fontSize: '0.875rem' }}>
            Loading page {pageIndex}...
          </div>
        )}
        
        {error && (
          <div style={{ position: 'absolute', color: 'var(--color-error)', fontSize: '0.875rem', textAlign: 'center', padding: '1rem' }}>
            {error}
          </div>
        )}

        <canvas 
          ref={canvasRef}
          style={{
            width: `${dimensions.w}px`,
            height: `${dimensions.h}px`,
            opacity: isRendered ? 1 : 0,
            transition: 'transform 0.3s ease-in-out',
            transform: `rotate(${additionalRotation}deg)`,
            transformOrigin: 'center center',
            backgroundColor: '#ffffff', // PDFs look best with white background
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}
        />

        {/* Overlay for selected state in select mode */}
        {isSelectMode && isSelected && (
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(239, 68, 68, 0.2)', // var(--color-error) with opacity
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
          }}>
            <div style={{
              backgroundColor: 'var(--color-error)',
              color: 'white',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6h18"></path>
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                <line x1="10" y1="11" x2="10" y2="17"></line>
                <line x1="14" y1="11" x2="14" y2="17"></line>
              </svg>
            </div>
          </div>
        )}
      </div>
      
      <div style={{ fontSize: '0.875rem', fontWeight: '500', color: isSelectMode && isSelected ? 'var(--color-error)' : 'var(--color-text)' }}>
        Page {pageIndex} {isSelectMode && isSelected && '(Remove)'}
      </div>
      
      {mode === 'rotate' && (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            onClick={(e) => { e.stopPropagation(); onRotateCcw?.(); }}
            aria-label={`Rotate page ${pageIndex} counterclockwise`}
            style={{ padding: '0.5rem', background: 'var(--color-elevated)', border: '1px solid var(--color-border)', borderRadius: '4px', cursor: 'pointer', color: 'var(--color-text)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
              <path d="M3 3v5h5"/>
            </svg>
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onRotateCw?.(); }}
            aria-label={`Rotate page ${pageIndex} clockwise`}
            style={{ padding: '0.5rem', background: 'var(--color-elevated)', border: '1px solid var(--color-border)', borderRadius: '4px', cursor: 'pointer', color: 'var(--color-text)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12a9 9 0 1 1-9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
              <path d="M21 3v5h-5"/>
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
