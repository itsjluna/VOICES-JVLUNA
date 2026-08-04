import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Polaroid = React.memo(({ src, alt, containerStyle = {}, wrapperClass = "", polaroidClass = "", children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [rotation] = useState(() => (Math.random() * 8) - 4); // Random between -4 and 4 degrees

  return (
    <>
      <div 
        className={wrapperClass}
        onClick={() => setIsOpen(true)}
        style={{ cursor: 'pointer', ...containerStyle }}
      >
        <motion.div 
          className={`polaroid-container ${polaroidClass}`}
          style={{ rotate: rotation }}
        >
          <img src={src} alt={alt} className="polaroid-img" loading="lazy" decoding="async" />
          {children}
          <div className="staple"></div>
        </motion.div>
      </div>

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
              background: 'rgba(0,0,0,0.8)',
              zIndex: 99999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <motion.div 
              initial={{ scale: 0.5, rotateZ: (Math.random() * 30) - 15, rotateX: 60, rotateY: 20, y: 300, opacity: 0 }}
              animate={{ scale: 1, rotateZ: 0, rotateX: 0, rotateY: 0, y: 0, opacity: 1 }}
              exit={{ scale: 0.7, rotateZ: -20, rotateX: 45, rotateY: -20, y: 300, opacity: 0 }}
              transition={{ type: "spring", stiffness: 250, damping: 20, mass: 1.2 }}
              className="polaroid-container"
              style={{
                margin: 0,
                maxWidth: '90vw',
                maxHeight: '90vh',
                pointerEvents: 'auto',
                boxShadow: '0 30px 60px rgba(0,0,0,0.6)',
                transformStyle: 'preserve-3d'
              }}
            >
              <img src={src} alt={alt} style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain' }} className="polaroid-img" loading="lazy" decoding="async" />
              <div className="staple"></div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
});

export default Polaroid;
