import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const TypewriterLoader = ({ text = "Opening journal..." }) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setDisplayedText((prev) => prev + text.charAt(index));
      index++;
      if (index >= text.length) {
        clearInterval(interval);
      }
    }, 80);
    return () => clearInterval(interval);
  }, [text]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', background: 'var(--bg-color)', color: 'var(--text-color)' }}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p style={{
          fontFamily: "'Courier New', Courier, monospace",
          fontSize: '1.2rem',
          letterSpacing: '2px',
          margin: 0,
          opacity: 0.8
        }}>
          {displayedText}
          <motion.span
            animate={{ opacity: [0, 1, 0] }}
            transition={{ repeat: Infinity, duration: 0.8 }}
            style={{ 
              display: 'inline-block', 
              width: '10px', 
              height: '1.2rem', 
              background: 'var(--text-color)', 
              marginLeft: '4px', 
              verticalAlign: 'bottom',
              opacity: 0.6
            }}
          />
        </p>
      </motion.div>
    </div>
  );
};

export default TypewriterLoader;
