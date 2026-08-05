import React from 'react';
import { motion } from 'framer-motion';

const PageTransition = ({ children }) => {
  return (
    <motion.div
      initial={{ rotateY: 90, opacity: 0, scale: 0.9, transformOrigin: 'left center' }}
      animate={{ rotateY: 0, opacity: 1, scale: 1 }}
      exit={{ rotateY: -90, opacity: 0, scale: 0.9, transformOrigin: 'right center' }}
      transition={{ duration: 0.7, ease: [0.645, 0.045, 0.355, 1] }}
      style={{ 
        width: '100%', 
        minHeight: '100vh',
        perspective: '2000px',
        transformStyle: 'preserve-3d'
      }}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
