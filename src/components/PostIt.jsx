import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PostIt = React.memo(({ quote, author, color, initialAnimation, style }) => {
  const [isOpen, setIsOpen] = useState(false);
  const layoutIdId = `postit-${quote.substring(0, 20)}-${author}`; 

  return (
    <>
      <motion.div 
        layoutId={layoutIdId}
        initial={initialAnimation.initial}
        animate={initialAnimation.animate}
        transition={{ ...initialAnimation.transition, layout: { type: "spring", stiffness: 1000, damping: 35 } }}
        className="post-it"
        style={{ ...style, background: color, cursor: 'pointer' }}
        onClick={() => setIsOpen(true)}
      >
        <p>"{quote}"</p>
        <small>— {author}</small>
      </motion.div>

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
                zIndex: 100000
              }}
            >
              <p style={{ fontSize: '1.5rem', lineHeight: '1.6' }}>"{quote}"</p>
              <small style={{ fontSize: '1rem', marginTop: '1rem', display: 'block' }}>— {author}</small>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
});

export default PostIt;
