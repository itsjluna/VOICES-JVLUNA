import React, { useState } from 'react';
import { motion } from 'framer-motion';
import '../App.css';

export default function Sticker({ src, style }) {
  const [isShiny, setIsShiny] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const handleClick = () => {
    setIsShiny(false);
    // trigger reflow to restart animation
    setTimeout(() => setIsShiny(true), 10);
  };

  return (
    <motion.div
      style={{
        position: 'absolute',
        display: 'inline-block',
        cursor: 'pointer',
        ...style
      }}
      onClick={handleClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: imgLoaded ? 1 : 0, scale: imgLoaded ? 1 : 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20, delay: Math.random() * 0.5, opacity: { duration: 0.4 } }}
    >
      <img src={src} onLoad={() => setImgLoaded(true)} style={{ width: '100%', height: '100%', display: 'block', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.4))' }} draggable={false} alt="sticker" />
      
      {/* Plastic Texture Overlay */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        pointerEvents: 'none',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0) 40%, rgba(255,255,255,0) 60%, rgba(255,255,255,0.1) 100%)',
        maskImage: `url(${src})`,
        WebkitMaskImage: `url(${src})`,
        maskSize: '100% 100%',
        WebkitMaskSize: '100% 100%',
      }} />

      {/* Shine Animation Layer */}
      {isShiny && (
        <div 
          className="sticker-shine-effect"
          style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            pointerEvents: 'none',
            maskImage: `url(${src})`,
            WebkitMaskImage: `url(${src})`,
            maskSize: '100% 100%',
            WebkitMaskSize: '100% 100%',
          }}
        />
      )}
    </motion.div>
  );
}
