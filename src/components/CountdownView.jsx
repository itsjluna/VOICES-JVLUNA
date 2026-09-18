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
        fontFamily: 'monospace'
      }}
    >
      <div style={{ textAlign: 'center' }}>

        {hasTimeLeft ? (
          <div style={{ display: 'flex', gap: '2rem', fontSize: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span>{String(timeLeft.days).padStart(2, '0')}</span>
              <span style={{ fontSize: '0.8rem', color: '#888', marginTop: '0.5rem' }}>DAYS</span>
            </div>
            <span>:</span>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span>{String(timeLeft.hours).padStart(2, '0')}</span>
              <span style={{ fontSize: '0.8rem', color: '#888', marginTop: '0.5rem' }}>HOURS</span>
            </div>
            <span>:</span>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span>{String(timeLeft.minutes).padStart(2, '0')}</span>
              <span style={{ fontSize: '0.8rem', color: '#888', marginTop: '0.5rem' }}>MINUTES</span>
            </div>
            <span>:</span>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span>{String(timeLeft.seconds).padStart(2, '0')}</span>
              <span style={{ fontSize: '0.8rem', color: '#888', marginTop: '0.5rem' }}>SECONDS</span>
            </div>
          </div>
        ) : null}
      </div>
    </motion.div>
  );
}
