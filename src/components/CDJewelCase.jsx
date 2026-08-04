import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CDJewelCase = React.memo(({ coverUrl, artist, albumName, initialAnimation, style }) => {
  const [isOpen, setIsOpen] = useState(false);
  const layoutIdId = `cd-${albumName}-${artist}`.replace(/\s+/g, '-'); 

  return (
    <>
      <motion.div 
        layoutId={layoutIdId}
        initial={initialAnimation.initial}
        animate={initialAnimation.animate}
        transition={{ ...initialAnimation.transition, layout: { type: "spring", stiffness: 1000, damping: 35 } }}
        className="cd-jewel-case"
        style={{ 
          ...style, 
          cursor: 'pointer',
          width: '120px',
          height: '120px',
          position: 'absolute',
          boxShadow: '2px 5px 15px rgba(0,0,0,0.3)',
          borderRadius: '2px',
          backgroundColor: '#111'
        }}
        onClick={() => setIsOpen(true)}
      >
        <img 
          src={coverUrl} 
          alt={`${albumName} by ${artist}`} 
          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '2px' }} 
        />
        {/* Plastic jewel case reflection overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 50%, rgba(255,255,255,0.1) 100%)',
          pointerEvents: 'none',
          borderLeft: '4px solid rgba(255,255,255,0.4)',
          borderRadius: '2px'
        }} />
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
              background: 'rgba(0,0,0,0.85)',
              zIndex: 99999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              cursor: 'pointer'
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
                backgroundColor: '#111'
              }}
            >
              <img 
                src={coverUrl.replace('100x100bb', '600x600bb')} // Request high res from iTunes API
                alt={`${albumName} by ${artist}`} 
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }} 
              />
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0) 50%, rgba(255,255,255,0.1) 100%)',
                pointerEvents: 'none',
                borderLeft: '14px solid rgba(255,255,255,0.2)', // Side spine
                borderRadius: '4px'
              }} />
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={{ textAlign: 'center', color: '#fff', marginTop: '2rem', fontFamily: 'var(--font-sans)', letterSpacing: '1px', zIndex: 100000 }}
            >
              <strong style={{ fontSize: '1.2rem' }}>{albumName}</strong><br/>
              <span style={{ opacity: 0.7 }}>{artist}</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
});

export default CDJewelCase;
