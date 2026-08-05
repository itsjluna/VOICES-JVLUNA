import React, { useEffect, useRef } from 'react';

const FlashlightOverlay = () => {
  const overlayRef = useRef(null);

  useEffect(() => {
    let animationFrameId;
    const handleMouseMove = (e) => {
      if (document.documentElement.classList.contains('dark')) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = requestAnimationFrame(() => {
          if (overlayRef.current) {
            overlayRef.current.style.setProperty('--x', `${e.clientX}px`);
            overlayRef.current.style.setProperty('--y', `${e.clientY}px`);
          }
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      ref={overlayRef}
      className="flashlight-overlay"
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        pointerEvents: 'none',
        zIndex: 50, // Above desk content, below modals (which are 99999)
        background: 'radial-gradient(circle 600px at var(--x, 50%) var(--y, 50%), transparent 0%, rgba(0,0,0,0.9) 100%)',
        opacity: 0,
        transition: 'opacity 1s ease',
      }}
    />
  );
};

export default FlashlightOverlay;
