import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';

const Polaroid = React.memo(({ src, alt, credit, containerStyle = {}, wrapperClass = "", polaroidClass = "", children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [rotation] = useState(() => (Math.random() * 8) - 4); // Random between -4 and 4 degrees
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const rotateX = useTransform(y, [-100, 100], [15, -15]);
  const rotateY = useTransform(x, [-100, 100], [-15, 15]);
  
  const layoutIdId = `polaroid-${src}`;
  
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

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  return (
    <>
      <div 
        className={wrapperClass}
        onClick={() => setIsOpen(true)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ cursor: 'pointer', perspective: '1000px', ...containerStyle }}
      >
        <motion.div 
          layoutId={layoutIdId}
          className={`polaroid-container ${polaroidClass}`}
          style={{ 
            rotate: rotation,
            rotateX: rotateX,
            rotateY: rotateY,
            transformStyle: 'preserve-3d',
            transition: 'transform 0.1s ease-out',
            opacity: imgLoaded ? 1 : 0
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: imgLoaded ? 1 : 0 }}
          transition={{ duration: 0.6 }}
          whileHover={{ scale: 1.05, zIndex: 50 }}
        >
          <img 
            src={src} 
            alt={alt} 
            className="polaroid-img" 
            style={{ transform: 'translateZ(10px)' }} 
            loading="lazy" 
            decoding="async" 
            onLoad={() => setImgLoaded(true)}
          />
          {credit && (
            <div style={{
              position: 'absolute',
              bottom: '5%',
              right: '5%',
              fontFamily: '"Permanent Marker", cursive',
              fontSize: '1rem',
              color: '#ff1493',
              transform: 'rotate(-3deg) translateZ(15px)',
              opacity: 0.9,
              zIndex: 10
            }}>
              {credit}
            </div>
          )}
          {children}
          <div className="staple" style={{ transform: 'translateZ(15px)' }}></div>
        </motion.div>
      </div>

      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {isOpen && (
            <PolaroidModal src={src} alt={alt} credit={credit} layoutIdId={layoutIdId} onClose={() => setIsOpen(false)} />
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
});

const PolaroidModal = ({ src, alt, credit, layoutIdId, onClose }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const rotateX = useTransform(y, [-100, 100], [15, -15]);
  const rotateY = useTransform(x, [-100, 100], [-15, 15]);
  
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
        background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(15px)',
        WebkitBackdropFilter: 'blur(15px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        cursor: 'pointer',
        perspective: '1200px'
      }}
    >
      <motion.div
        className="polaroid-container"
        style={{
          rotateX: rotateX,
          rotateY: rotateY,
          transformStyle: 'preserve-3d',
          pointerEvents: 'auto',
          background: '#fff',
          padding: '1rem 1rem 3rem 1rem',
          boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
          maxWidth: '90vw',
          maxHeight: '90vh'
        }}
      >
        <motion.div 
          layoutId={layoutIdId}
          transition={{ type: "spring", stiffness: 500, damping: 25, mass: 0.8 }}
          style={{ width: '100%', height: '100%', position: 'relative' }}
        >
          <img 
            src={src}
            alt={alt}
            style={{
              width: '100%',
              height: 'auto',
              maxHeight: 'calc(90vh - 4rem)',
              objectFit: 'contain'
            }}
          />
          {credit && (
            <div style={{
              position: 'absolute',
              bottom: '1rem',
              left: 0,
              right: 0,
              textAlign: 'center',
              fontFamily: '"Permanent Marker", cursive',
              fontSize: '1.2rem',
              color: '#ff1493',
              transform: 'translateZ(10px)'
            }}>
              {credit}
            </div>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Polaroid;
