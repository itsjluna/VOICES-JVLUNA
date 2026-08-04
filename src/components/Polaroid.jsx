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
          layoutId={`polaroid-${src}`} 
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
              width: '100vw',
              height: '100vh',
              background: 'rgba(0,0,0,0.8)',
              zIndex: 99999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <motion.div 
              layoutId={`polaroid-${src}`}
              className="polaroid-container"
              style={{
                margin: 0,
                rotate: 0,
                maxWidth: '90vw',
                maxHeight: '90vh',
                pointerEvents: 'auto'
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
