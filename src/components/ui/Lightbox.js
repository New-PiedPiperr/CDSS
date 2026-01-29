'use client';

import React, { useEffect, useState } from 'react';
import { X, ZoomIn, ZoomOut, Download, RotateCw } from 'lucide-react';
import { Button } from './Button';
import { cn } from '@/lib/cn';

/**
 * A premium Lightbox component for expanding and viewing images in high detail.
 */
export function Lightbox({ src, alt, onClose }) {
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    // Prevent scrolling when lightbox is open
    document.body.style.overflow = 'hidden';

    // Closer on escape key
    const handleEsc = (e) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleEsc);

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEsc);
    };
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 300);
  };

  const zoomIn = () => setScale((prev) => Math.min(prev + 0.25, 3));
  const zoomOut = () => setScale((prev) => Math.max(prev - 0.25, 0.5));
  const rotate = () => setRotation((prev) => (prev + 90) % 360);

  return (
    <div
      className={cn(
        'fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/95 backdrop-blur-xl transition-all duration-300',
        isClosing ? 'opacity-0' : 'opacity-100'
      )}
      onClick={handleClose}
    >
      {/* Top Controls */}
      <div className="absolute top-0 right-0 left-0 z-10 flex items-center justify-between bg-gradient-to-b from-black/50 to-transparent p-6">
        <div className="flex flex-col">
          <h3 className="max-w-xs truncate text-sm font-black tracking-widest text-white uppercase md:max-w-md">
            {alt || 'Clinical Document'}
          </h3>
          <span className="mt-0.5 text-[10px] font-bold tracking-tighter text-white/40 uppercase">
            Secure Medical Viewer • {scale * 100}% Zoom
          </span>
        </div>

        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="ghost"
            size="icon"
            onClick={zoomOut}
            className="h-12 w-12 rounded-full text-white/60 hover:bg-white/10 hover:text-white"
          >
            <ZoomOut className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={zoomIn}
            className="h-12 w-12 rounded-full text-white/60 hover:bg-white/10 hover:text-white"
          >
            <ZoomIn className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={rotate}
            className="h-12 w-12 rounded-full text-white/60 hover:bg-white/10 hover:text-white"
          >
            <RotateCw className="h-5 w-5" />
          </Button>
          <div className="mx-2 h-6 w-[1px] bg-white/10" />
          <a href={src} download target="_blank" rel="noopener noreferrer">
            <Button
              variant="ghost"
              size="icon"
              className="h-12 w-12 rounded-full text-white/60 hover:bg-white/10 hover:text-white"
            >
              <Download className="h-5 w-5" />
            </Button>
          </a>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="h-12 w-12 rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            <X className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Image Container */}
      <div
        className={cn(
          'relative flex max-h-[85vh] max-w-[90vw] items-center justify-center transition-all duration-500 ease-out',
          isClosing ? 'scale-90' : 'scale-100'
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={src}
          alt={alt}
          className="max-h-[80vh] max-w-full rounded-sm object-contain shadow-2xl transition-transform duration-300"
          style={{
            transform: `scale(${scale}) rotate(${rotation}deg)`,
            filter: 'drop-shadow(0 0 50px rgba(0,0,0,0.5))',
          }}
        />
      </div>

      {/* Footer Info */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full border border-white/10 bg-white/5 px-6 py-3 opacity-60 backdrop-blur-md transition-opacity hover:opacity-100">
        <p className="text-[10px] font-black tracking-[0.3em] whitespace-nowrap text-white/40 uppercase">
          Proprietary Diagnostic Asset • Encryption Active
        </p>
      </div>
    </div>
  );
}
