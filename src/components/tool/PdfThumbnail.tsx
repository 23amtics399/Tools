import React, { useEffect, useRef, useState } from 'react';
import type { PDFDocumentProxy } from 'pdfjs-dist';

interface PdfThumbnailProps {
  pdf: PDFDocumentProxy;
  pageIndex: number; // 1-indexed
  additionalRotation: number;
  onRotateCw: () => void;
  onRotateCcw: () => void;
}

export function PdfThumbnail({
  pdf,
  pageIndex,
  additionalRotation,
  onRotateCw,
  onRotateCcw
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

  return (
    <div ref={containerRef} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', width: '100%', padding: '1rem', backgroundColor: 'var(--color-surface)', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
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
      </div>
      
      <div style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--color-text)' }}>
        Page {pageIndex}
      </div>
      
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button 
          onClick={onRotateCcw}
          aria-label={`Rotate page ${pageIndex} counterclockwise`}
          style={{ padding: '0.5rem', background: 'var(--color-elevated)', border: '1px solid var(--color-border)', borderRadius: '4px', cursor: 'pointer', color: 'var(--color-text)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
            <path d="M3 3v5h5"/>
          </svg>
        </button>
        <button 
          onClick={onRotateCw}
          aria-label={`Rotate page ${pageIndex} clockwise`}
          style={{ padding: '0.5rem', background: 'var(--color-elevated)', border: '1px solid var(--color-border)', borderRadius: '4px', cursor: 'pointer', color: 'var(--color-text)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12a9 9 0 1 1-9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
            <path d="M21 3v5h-5"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
