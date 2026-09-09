import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { FaPlay, FaPause, FaStepBackward, FaStepForward } from 'react-icons/fa';

const CassetteModal = ({ layoutIdId, track, onClose }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
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

  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.log('Autoplay prevented:', e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
    }
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percent = clickX / rect.width;
    if (audioRef.current) {
      audioRef.current.currentTime = percent * audioRef.current.duration;
      setProgress(percent * 100);
    }
  };

  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  const EMOJI_MAP = {
    '#b566ff': '👾',
    '#10ff70': '👽',
    '#ff4040': '👹',
    '#ffe600': '⚡',
    '#1ab3ff': '🌊',
    '#ff8800': '🔥'
  };
  const activeEmoji = animColor ? EMOJI_MAP[animColor] || '🎵' : '🎵';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.3 } }}
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
        onClick={handleModalClick}
        style={{
          position: 'relative',
          width: '500px',
          maxWidth: '90vw',
          pointerEvents: 'auto',
          zIndex: 100000,
          rotateX: rotateX,
          rotateY: rotateY,
          transformStyle: 'preserve-3d',
          filter: 'drop-shadow(0 25px 50px rgba(0,0,0,0.7))'
        }}
      >
        {/* 3D Extrusion Layers for depth */}
        {[...Array(6)].map((_, i) => (
          <img 
            key={i}
            src="/media/cassette.png" 
            alt="" 
            style={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              width: '100%', 
              transform: `translateZ(-${(i + 1) * 2}px)`, 
              filter: 'brightness(0.2) contrast(1.2)' 
            }} 
            draggable="false"
          />
        ))}
        
        <img 
          src="/media/cassette.png" 
          alt="Cassette Tape" 
          style={{ width: '100%', display: 'block', position: 'relative', zIndex: 1, transform: 'translateZ(0px)' }} 
        />
        <div style={{
          position: 'absolute',
          top: '16.5%',
          left: '17%',
          width: '66%',
          height: '24%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          fontFamily: '"Permanent Marker", cursive',
          color: '#111',
          textAlign: 'center',
          padding: '0.5rem',
          boxSizing: 'border-box',
          transform: 'translateZ(15px)',
          zIndex: 2,
          whiteSpace: 'nowrap'
        }}>
          <span style={{ display: 'block', width: '100%', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '1.4rem' }}>{track.title} - {track.artist}</span>
        </div>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        onClick={handleModalClick}
        style={{ 
          marginTop: '2rem',
          background: 'rgba(255, 255, 255, 0.12)',
          backdropFilter: 'blur(30px)',
          WebkitBackdropFilter: 'blur(30px)',
          border: '1px solid rgba(255, 255, 255, 0.25)',
          borderRadius: '24px',
          padding: '1.5rem 2rem',
          width: '90%',
          maxWidth: '420px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
          zIndex: 100000,
          color: '#fff',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <h3 style={{ margin: 0, fontSize: '1.2rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{track.title}</h3>
            <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.7 }}>{track.artist}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <div style={{ display: 'flex', gap: '3px', height: '16px', alignItems: 'flex-end' }}>
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={`L-${i}`}
                  animate={isPlaying ? { height: ['3px', '16px', '6px', '12px', '3px'] } : { height: '3px' }}
                  transition={isPlaying ? { repeat: Infinity, duration: 0.5 + i * 0.1, ease: 'linear' } : {}}
                  style={{ width: '3px', background: animColor || '#fff', borderRadius: '2px' }}
                />
              ))}
            </div>
            <motion.div
              animate={isPlaying ? { scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] } : { scale: 1, rotate: 0 }}
              transition={isPlaying ? { repeat: Infinity, duration: 0.6 } : {}}
              style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center' }}
            >
              {activeEmoji}
            </motion.div>
            <div style={{ display: 'flex', gap: '3px', height: '16px', alignItems: 'flex-end' }}>
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={`R-${i}`}
                  animate={isPlaying ? { height: ['3px', '12px', '6px', '16px', '3px'] } : { height: '3px' }}
                  transition={isPlaying ? { repeat: Infinity, duration: 0.5 + (3-i) * 0.1, ease: 'linear' } : {}}
                  style={{ width: '3px', background: animColor || '#fff', borderRadius: '2px' }}
                />
              ))}
            </div>
          </div>
        </div>

        <div 
          onClick={handleSeek}
          style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.2)', borderRadius: '3px', cursor: 'pointer', position: 'relative', overflow: 'hidden', margin: '0.5rem 0' }}
        >
          <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: `${progress}%`, background: animColor || '#fff', borderRadius: '3px', transition: 'width 0.1s linear' }} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <button style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', opacity: 0.7, padding: '10px' }}><FaStepBackward size={20} /></button>
          
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            style={{ 
              background: animColor ? `${animColor}40` : 'rgba(255,255,255,0.2)', 
              border: `1px solid ${animColor || 'rgba(255,255,255,0.3)'}`, 
              color: '#fff', 
              width: '64px', 
              height: '64px', 
              borderRadius: '32px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: `0 4px 15px ${animColor ? `${animColor}40` : 'rgba(0,0,0,0.2)'}`
            }}
          >
            {isPlaying ? <FaPause size={22} /> : <FaPlay size={22} style={{ marginLeft: '4px' }} />}
          </button>
          
          <button style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', opacity: 0.7, padding: '10px' }}><FaStepForward size={20} /></button>
        </div>
      </motion.div>
      
      {track.audioUrl && (
        <audio 
          ref={audioRef}
          src={track.audioUrl} 
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => setIsPlaying(false)}
        />
      )}
    </motion.div>
  );
};

export default CassetteModal;
