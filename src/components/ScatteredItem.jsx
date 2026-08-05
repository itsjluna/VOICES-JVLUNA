import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ScatteredItem = React.memo(({ src, alt, initialAnimation, style, className }) => {
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
        dragConstraints={{ left: -500, right: 500, top: -500, bottom: 500 }}
        dragElastic={0.2}
        whileDrag={{ scale: 1.1, cursor: 'grabbing', filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.5))' }}
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.05, filter: 'brightness(1.1)' }}
        loading="lazy"
        decoding="async"
      />

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
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
              cursor: 'pointer'
            }}
          >
            <motion.img 
              src={src}
              alt={alt}
              className={className}
              initial={{ scale: 0.5, rotateZ: (Math.random() * 30) - 15, rotateX: 60, rotateY: 20, y: 300, opacity: 0 }}
              animate={{ scale: 1, rotateZ: 0, rotateX: 0, rotateY: 0, y: 0, opacity: 1 }}
              exit={{ scale: 0.7, rotateZ: -20, rotateX: 45, rotateY: -20, y: 300, opacity: 0 }}
              transition={{ type: "spring", stiffness: 250, damping: 20, mass: 1.2 }}
              style={{
                maxWidth: '90vw',
                maxHeight: '90vh',
                objectFit: 'contain',
                pointerEvents: 'auto',
                filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.6))',
                zIndex: 100000,
                transformStyle: 'preserve-3d'
              }}
              loading="lazy"
              decoding="async"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
});

export default ScatteredItem;
