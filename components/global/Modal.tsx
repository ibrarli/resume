import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxSizeClassName?: string; // e.g., 'max-w-md', 'max-w-xl', 'max-w-2xl'
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxSizeClassName = "max-w-md"
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);

  // Bind Escape key event listener to kill modal context safely
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden'; // Stop background scrolling layout anomalies
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (overlayRef.current === e.target) {
      onClose();
    }
  };

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 bg-background/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div 
        className={`w-full ${maxSizeClassName} bg-background border-2 border-foreground/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-[90vh] font-body text-xs transform scale-100 transition-transform`}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-foreground/5 sticky top-0 bg-background z-10">
          {title ? (
            <h3 className="text-xs font-bold tracking-wide text-foreground font-heading uppercase">
              {title}
            </h3>
          ) : (
            <div />
          )}
          <button
            type="button"
            onClick={onClose}
            className="text-foreground/40 hover:text-foreground p-1 rounded-lg transition-colors cursor-pointer"
            aria-label="Close modal window"
          >
            <X size={15} />
          </button>
        </div>

        {/* Modal Content Scroll Frame Container */}
        <div className="p-5 overflow-y-auto flex-1 custom-scrollbar leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
};