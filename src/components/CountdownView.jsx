import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const launchDate = new Date('2026-09-25T00:00:00-06:00').getTime();

export default function CountdownView() {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const difference = launchDate - Date.now();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 1.5, ease: "easeOut" }
    }
  };

  const hasTimeLeft = Object.keys(timeLeft).length > 0;

  return (
    <motion.div 
      className="countdown-container"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100vw',
        position: 'fixed',
        top: 0,
        left: 0,
        backgroundColor: '#000',
        color: '#fff',
        zIndex: 9999,
        fontFamily: 'monospace',
        padding: '2rem',
        boxSizing: 'border-box'
      }}
    >
      <div style={{ textAlign: 'center', width: '100%', maxWidth: '600px' }}>
        <motion.h1 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 2 }}
          style={{ 
            fontFamily: "'Playfair Display', serif", 
            fontStyle: 'italic',
            fontSize: 'clamp(1.5rem, 5vw, 2.5rem)',
            fontWeight: 400,
            letterSpacing: '0.15em',
            marginBottom: '3rem',
            color: 'rgba(255, 255, 255, 0.8)',
            textTransform: 'lowercase'
          }}
        >
          a way out
        </motion.h1>

        {hasTimeLeft ? (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center',
            gap: 'clamp(0.8rem, 4vw, 2.5rem)', 
            fontSize: 'clamp(1.5rem, 6vw, 2.5rem)' 
          }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span>{String(timeLeft.days).padStart(2, '0')}</span>
              <span style={{ fontSize: 'clamp(0.6rem, 2.5vw, 0.85rem)', color: '#888', marginTop: '0.8rem', letterSpacing: '0.1em' }}>DAYS</span>
            </div>
            <span style={{ opacity: 0.5 }}>:</span>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span>{String(timeLeft.hours).padStart(2, '0')}</span>
              <span style={{ fontSize: 'clamp(0.6rem, 2.5vw, 0.85rem)', color: '#888', marginTop: '0.8rem', letterSpacing: '0.1em' }}>HOURS</span>
            </div>
            <span style={{ opacity: 0.5 }}>:</span>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span>{String(timeLeft.minutes).padStart(2, '0')}</span>
              <span style={{ fontSize: 'clamp(0.6rem, 2.5vw, 0.85rem)', color: '#888', marginTop: '0.8rem', letterSpacing: '0.1em' }}>MINUTES</span>
            </div>
            <span style={{ opacity: 0.5 }}>:</span>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span>{String(timeLeft.seconds).padStart(2, '0')}</span>
              <span style={{ fontSize: 'clamp(0.6rem, 2.5vw, 0.85rem)', color: '#888', marginTop: '0.8rem', letterSpacing: '0.1em' }}>SECONDS</span>
            </div>
          </div>
        ) : null}
      </div>
    </motion.div>
  );
}
