import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';

const CDJewelCase = React.memo(({ coverUrl, artist, albumName, previewUrl, initialAnimation, style }) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasOpened = React.useRef(false);
  const layoutIdId = `cd-${albumName}-${artist}`.replace(/\s+/g, '-'); 
  
  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);
  
  if (isOpen) hasOpened.current = true;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const img1 = new Image();
      img1.src = coverUrl ? coverUrl.replace('100x100bb', '600x600bb') : '';
      const img2 = new Image();
      img2.src = "/jewelcase.png";
    }
  }, [coverUrl]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const handleOpen = async () => {
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
      try {
        const permissionState = await DeviceOrientationEvent.requestPermission();
        // If granted, the event listener in CDModal will just work
      } catch (e) {
        console.error(e);
      }
    }
    setIsOpen(true);
  };

  return (
    <>
      {!isOpen && (
        <motion.div 
          layoutId={layoutIdId}
          initial={hasOpened.current ? false : initialAnimation.initial}
          animate={initialAnimation.animate}
          transition={{ 
          ...initialAnimation.transition, 
          delay: hasOpened.current ? 0 : (initialAnimation.transition?.delay || 0),
          layout: { type: "spring", stiffness: 1000, damping: 35 } 
        }}
          className="cd-jewel-case"
          style={{ 
            cursor: 'grab',
            width: '120px',
            height: '120px',
            position: 'absolute',
            boxShadow: '2px 5px 15px rgba(0,0,0,0.3)',
            borderRadius: '2px',
            backgroundColor: '#111',
            ...style,
            x: dragX,
            y: dragY
          }}
        drag
        dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }}
        dragElastic={0.2}
        whileDrag={{ scale: 1.1, cursor: 'grabbing', filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.5))' }}
        onClick={handleOpen}
      >
        <img 
          src={coverUrl ? coverUrl.replace('100x100bb', '600x600bb') : ''} 
          alt={`${albumName} by ${artist}`} 
          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '2px' }} 
          draggable="false"
        />
        <JewelCaseOverlay />
      </motion.div>
      )}

      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {isOpen && (
            <CDModal 
              layoutIdId={layoutIdId} 
              coverUrl={coverUrl} 
              artist={artist} 
              albumName={albumName} 
              previewUrl={previewUrl}
              onClose={() => setIsOpen(false)} 
            />
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
});

// Extracted Modal component to manage 3D mouse state cleanly
const CDModal = ({ layoutIdId, coverUrl, artist, albumName, previewUrl, onClose }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Perspective transforms based on mouse position
  const rotateX = useTransform(y, [-100, 100], [15, -15]);
  const rotateY = useTransform(x, [-100, 100], [-15, 15]);
  
  useEffect(() => {
    const handleOrientation = (e) => {
      if (e.beta !== null && e.gamma !== null) {
        let g = Math.max(-45, Math.min(45, e.gamma));
        let b = Math.max(0, Math.min(90, e.beta)) - 45;
        x.set((g / 45) * 100);
        y.set((b / 45) * 100);
      }
    };
    
    if (typeof window !== 'undefined' && window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation);
      return () => window.removeEventListener('deviceorientation', handleOrientation);
    }
  }, [x, y]);

  const handleMouseMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    x.set((mouseX - centerX) / centerX * 100);
    y.set((mouseY - centerY) / centerY * 100);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.3 } }}
      onClick={onClose}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.85)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        cursor: 'pointer',
        perspective: '1000px'
      }}
    >
      <motion.div 
        layoutId={layoutIdId}
        transition={{ type: "spring", stiffness: 1000, damping: 35 }}
        className="cd-jewel-case"
        style={{
          position: 'relative',
          width: '400px',
          height: '400px',
          maxWidth: '90vw',
          maxHeight: '90vw',
          pointerEvents: 'auto',
          boxShadow: '0 25px 50px rgba(0,0,0,0.7)',
          zIndex: 100000,
          borderRadius: '4px',
          backgroundColor: '#111',
          rotateX: rotateX,
          rotateY: rotateY,
          transformStyle: 'preserve-3d'
        }}
      >
        <img 
          src={coverUrl ? coverUrl.replace('100x100bb', '600x600bb') : ''} // Request high res from iTunes API
          alt={`${albumName} by ${artist}`} 
          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px', transform: 'translateZ(10px)' }} 
        />
        <JewelCaseOverlay translateZ="20px" />
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{ textAlign: 'center', color: '#fff', marginTop: '2rem', fontFamily: 'var(--font-sans)', letterSpacing: '1px', zIndex: 100000 }}
      >
        <strong style={{ fontSize: '1.2rem' }}>{albumName}</strong><br/>
        <span style={{ opacity: 0.7 }}>{artist}</span>
        {previewUrl && <div style={{ fontSize: '0.8rem', marginTop: '0.5rem', opacity: 0.8 }}>Now Playing Preview... 🎵</div>}
      </motion.div>
      
      {previewUrl && <audio src={previewUrl} autoPlay />}
    </motion.div>
  );
};

const JewelCaseOverlay = ({ translateZ = '0px' }) => (
  <img 
    src="/jewelcase.png"
    alt=""
    style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      objectFit: 'fill',
      transform: translateZ !== '0px' ? `translateZ(${translateZ})` : 'none'
    }}
  />
);

export default CDJewelCase;
