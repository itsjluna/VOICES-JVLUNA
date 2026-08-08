import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';

const Polaroid = React.memo(({ src, alt, credit, containerStyle = {}, wrapperClass = "", polaroidClass = "", children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [rotation] = useState(() => (Math.random() * 8) - 4); // Random between -4 and 4 degrees
  
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
          className={`polaroid-container ${polaroidClass}`}
          style={{ 
            rotate: rotation,
            rotateX: rotateX,
            rotateY: rotateY,
            transformStyle: 'preserve-3d',
            transition: 'transform 0.1s ease-out'
          }}
          whileHover={{ scale: 1.05, zIndex: 50 }}
        >
          <img src={src} alt={alt} className="polaroid-img" style={{ transform: 'translateZ(10px)' }} loading="lazy" decoding="async" />
          {children}
          <div className="staple" style={{ transform: 'translateZ(15px)' }}></div>
        </motion.div>
      </div>

      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {isOpen && (
            <PolaroidModal src={src} alt={alt} credit={credit} onClose={() => setIsOpen(false)} />
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
});

const PolaroidModal = ({ src, alt, credit, onClose }) => {
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
      exit={{ opacity: 0 }}
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
        initial={{ scale: 0.5, y: 300, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.7, y: 300, opacity: 0 }}
        transition={{ type: "spring", stiffness: 250, damping: 20, mass: 1.2 }}
        className="polaroid-container"
        style={{
          margin: 0,
          display: 'inline-block',
          width: 'auto',
          maxWidth: '90vw',
          maxHeight: '90vh',
          pointerEvents: 'auto',
          boxShadow: '0 30px 60px rgba(0,0,0,0.6)',
          transformStyle: 'preserve-3d',
          rotateX: rotateX,
          rotateY: rotateY,
          position: 'relative'
        }}
      >
        <img src={src} alt={alt} style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain', transform: 'translateZ(20px)' }} className="polaroid-img" loading="lazy" decoding="async" />
        <div className="staple" style={{ transform: 'rotate(-15deg) translateZ(25px)' }}></div>
        {credit && (
          <div style={{
            position: 'absolute',
            bottom: '5%',
            right: '5%',
            fontFamily: '"Permanent Marker", cursive',
            fontSize: '1.2rem',
            color: '#f0f0f0',
            textShadow: '1px 1px 0px rgba(0,0,0,0.5), 0px 0px 4px rgba(255,255,255,0.7)',
            transform: 'rotate(-3deg) translateZ(25px)',
            opacity: 0.95,
            zIndex: 10
          }}>
            {credit}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Polaroid;
