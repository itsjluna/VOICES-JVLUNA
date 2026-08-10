import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useMotionValue } from 'framer-motion';

const PostIt = React.memo(({ quote, author, color, initialAnimation, style }) => {
  const [isOpen, setIsOpen] = useState(false);
  const layoutIdId = `postit-${quote.substring(0, 20)}-${author}`; 
  
  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);
  
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
      <motion.div
        initial={initialAnimation.initial}
        animate={initialAnimation.animate}
        exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2, delay: 0 } }}
        transition={{ ...initialAnimation.transition }}
        className="post-it-wrapper"
        style={{ ...style, cursor: 'grab', x: dragX, y: dragY }}
        drag
        dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }}
        dragElastic={0.2}
        whileDrag={{ scale: 1.05, cursor: 'grabbing', filter: 'drop-shadow(5px 15px 20px rgba(0,0,0,0.3))' }}
        onClick={() => setIsOpen(true)}
      >
        <motion.div 
          layoutId={layoutIdId}
          transition={{ layout: { type: "spring", stiffness: 1000, damping: 35 } }}
          className="post-it"
          style={{ background: color, width: '100%', height: '100%', pointerEvents: 'none' }}
        >
          <p>"{quote}"</p>
          <small>— {author}</small>
        </motion.div>
      </motion.div>

      {typeof document !== 'undefined' && createPortal(
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
                layoutId={layoutIdId}
                transition={{ type: "spring", stiffness: 1000, damping: 35 }}
                className="post-it"
                style={{
                  margin: 0,
                  position: 'relative',
                  top: 'auto',
                  right: 'auto',
                  rotate: 0,
                  width: '300px',
                  padding: '2rem',
                  background: color,
                  pointerEvents: 'auto',
                  maxWidth: '90vw',
                  maxHeight: '90vh',
                  overflow: 'auto',
                  boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
                  zIndex: 100000,
                  aspectRatio: '1 / 1'
                }}
              >
                <p style={{ fontSize: '1.5rem', lineHeight: '1.6' }}>"{quote}"</p>
                <small style={{ fontSize: '1rem', marginTop: '1rem', display: 'block' }}>— {author}</small>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
});

export default PostIt;
