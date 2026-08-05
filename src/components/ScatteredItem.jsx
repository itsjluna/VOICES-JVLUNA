import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';

const ScatteredItem = React.memo(({ src, alt, title, description, initialAnimation, style, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  
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
      <motion.img 
        src={src}
        alt={alt}
        className={className}
        initial={initialAnimation.initial}
        animate={initialAnimation.animate}
        transition={initialAnimation.transition}
        style={{ ...style, cursor: 'grab' }}
        drag
        dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }}
        dragElastic={0.2}
        whileDrag={{ scale: 1.1, cursor: 'grabbing', filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.5))' }}
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.05, filter: 'brightness(1.1)' }}
        loading="lazy"
        decoding="async"
      />

      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {isOpen && (
            <ScatteredModal 
              src={src} 
              alt={alt} 
              title={title}
              description={description}
              className={className} 
              onClose={() => setIsOpen(false)} 
            />
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
});

const ScatteredModal = ({ src, alt, title, description, className, onClose }) => {
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
        style={{
          rotateX: rotateX,
          rotateY: rotateY,
          transformStyle: 'preserve-3d',
          pointerEvents: 'auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <img 
          src={src}
          alt={alt}
          className={className}
          style={{
            maxWidth: '90vw',
            maxHeight: '75vh',
            objectFit: 'contain',
            filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.6))',
            transform: 'translateZ(20px)'
          }}
          loading="lazy"
          decoding="async"
        />
        
        {(title || description) && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{
              marginTop: '2rem',
              color: '#fff',
              textAlign: 'center',
              maxWidth: '400px',
              fontFamily: 'var(--font-serif)',
              transform: 'translateZ(30px)',
              textShadow: '0 2px 10px rgba(0,0,0,0.5)'
            }}
          >
            {title && <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem', fontWeight: 'normal', letterSpacing: '2px', textTransform: 'uppercase' }}>{title}</h3>}
            {description && <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.8, fontStyle: 'italic', fontFamily: 'var(--font-sans)', lineHeight: '1.5' }}>{description}</p>}
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ScatteredItem;
