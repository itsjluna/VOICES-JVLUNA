import React, { useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';

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
          cursor: 'pointer',
          width: '120px',
          height: '120px',
          position: 'absolute',
          boxShadow: '2px 5px 15px rgba(0,0,0,0.3)',
          borderRadius: '2px',
          backgroundColor: '#111',
          ...style
        }}
        onClick={() => setIsOpen(true)}
      >
        <img 
          src={coverUrl} 
          alt={`${albumName} by ${artist}`} 
          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '2px' }} 
        />
        <JewelCaseOverlay />
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <CDModal 
            layoutIdId={layoutIdId} 
            coverUrl={coverUrl} 
            artist={artist} 
            albumName={albumName} 
            onClose={() => setIsOpen(false)} 
          />
        )}
      </AnimatePresence>
    </>
  );
});

// Extracted Modal component to manage 3D mouse state cleanly
const CDModal = ({ layoutIdId, coverUrl, artist, albumName, onClose }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Perspective transforms based on mouse position
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
        background: 'rgba(0,0,0,0.85)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        cursor: 'pointer',
        perspective: '1000px'
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
          backgroundColor: '#111',
          rotateX: rotateX,
          rotateY: rotateY,
          transformStyle: 'preserve-3d'
        }}
      >
        <img 
          src={coverUrl.replace('100x100bb', '600x600bb')} // Request high res from iTunes API
          alt={`${albumName} by ${artist}`} 
          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px', transform: 'translateZ(10px)' }} 
        />
        <JewelCaseOverlay translateZ="20px" />
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
  );
};

const JewelCaseOverlay = ({ translateZ = '0px' }) => (
  <div style={{
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    boxShadow: 'inset 0 0 10px rgba(255,255,255,0.5), inset 2px 2px 5px rgba(255,255,255,0.8), inset -2px -2px 5px rgba(0,0,0,0.5)',
    border: '1px solid rgba(255,255,255,0.4)',
    borderRadius: '3px',
    transform: translateZ !== '0px' ? `translateZ(${translateZ})` : 'none'
  }}>
    {/* Dark ribbed spine (hinge) on the left */}
    <div style={{
      position: 'absolute', left: 0, top: 0, bottom: 0, width: '12%',
      background: 'linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(20,20,20,0.9) 20%, rgba(50,50,50,0.6) 50%, rgba(10,10,10,0.8) 80%, rgba(0,0,0,0.9) 100%)',
      borderRight: '1px solid rgba(0,0,0,0.5)',
      boxShadow: '1px 0 2px rgba(255,255,255,0.2) inset'
    }} />
    {/* High contrast glassy diagonal glare */}
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
      background: 'linear-gradient(135deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.1) 35%, rgba(255,255,255,0) 40%, rgba(255,255,255,0) 60%, rgba(255,255,255,0.05) 65%, rgba(255,255,255,0.3) 100%)',
      mixBlendMode: 'screen'
    }} />
    {/* Right-edge plastic cover holding tabs */}
    <div style={{ position: 'absolute', right: '4px', top: '15%', width: '8%', height: '8%', background: 'rgba(255,255,255,0.15)', borderRadius: '10px 0 0 10px', border: '1px solid rgba(255,255,255,0.4)', borderRight: 'none', boxShadow: 'inset 1px 1px 2px rgba(255,255,255,0.6)' }} />
    <div style={{ position: 'absolute', right: '4px', bottom: '15%', width: '8%', height: '8%', background: 'rgba(255,255,255,0.15)', borderRadius: '10px 0 0 10px', border: '1px solid rgba(255,255,255,0.4)', borderRight: 'none', boxShadow: 'inset 1px 1px 2px rgba(255,255,255,0.6)' }} />
  </div>
);

export default CDJewelCase;
