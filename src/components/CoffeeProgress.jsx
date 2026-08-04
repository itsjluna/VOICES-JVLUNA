import React from 'react';
import { motion } from 'framer-motion';

export const CoffeeProgress = ({ current, total }) => {
  const percentage = total > 0 ? Math.min(100, Math.max(0, (current / total) * 100)) : 0;
  
  // The liquid fills from y=85 (empty) to y=20 (full)
  // Height of fill area is 65
  const fillY = 85 - (percentage / 100) * 65;

  return (
    <div 
      title={`${current} OF ${total} ENTRIES READ`}
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        width: '45px', 
        height: '45px',
        flexShrink: 0,
        cursor: 'help'
      }}
    >
      <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
        {/* Cup Handle */}
        <path 
          d="M 75 35 Q 95 35 95 55 Q 95 70 73 70" 
          fill="none" 
          stroke="var(--text-color)" 
          strokeWidth="6" 
          strokeLinecap="round" 
        />
        
        {/* Liquid Fill (Masked to cup interior) */}
        <defs>
          <mask id="cupInnerMask">
            <rect x="0" y="0" width="100" height="100" fill="black" />
            <path d="M 23 20 L 30 75 Q 32 85 50 85 L 50 85 Q 68 85 70 75 L 77 20 Z" fill="white" />
          </mask>
        </defs>
        
        {/* The Coffee */}
        <motion.rect 
          x="0" 
          initial={{ y: 85 }}
          animate={{ y: fillY }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          width="100" 
          height="100" 
          fill="var(--text-color)" 
          mask="url(#cupInnerMask)" 
          opacity="0.85"
        />

        {/* Cup Outline */}
        <path 
          d="M 20 20 L 30 75 Q 32 88 50 88 L 50 88 Q 68 88 70 75 L 80 20 Z" 
          fill="none" 
          stroke="var(--text-color)" 
          strokeWidth="6" 
          strokeLinejoin="round" 
        />
        
        {/* Steam (shows up only if you have read something) */}
        {percentage > 0 && (
          <motion.g 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 0.5 }} 
            transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
            stroke="var(--text-color)" 
            strokeWidth="3" 
            strokeLinecap="round" 
            fill="none"
          >
            <path d="M 40 10 Q 35 0 45 -10" />
            <path d="M 55 5 Q 50 -5 60 -15" />
          </motion.g>
        )}
      </svg>
    </div>
  );
};
