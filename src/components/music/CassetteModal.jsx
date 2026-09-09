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
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '20px',
          padding: '1.5rem',
          width: '90%',
          maxWidth: '400px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.5rem',
          zIndex: 100000,
          color: '#fff',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
        }}
      >
        <div 
          onClick={handleSeek}
          style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.2)', borderRadius: '4px', cursor: 'pointer', position: 'relative', overflow: 'hidden' }}
        >
          <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: `${progress}%`, background: '#fff', borderRadius: '4px', transition: 'width 0.1s linear' }} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <button style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', opacity: 0.7 }}><FaStepBackward size={20} /></button>
          
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            style={{ 
              background: 'rgba(255,255,255,0.2)', 
              border: '1px solid rgba(255,255,255,0.3)', 
              color: '#fff', 
              width: '60px', 
              height: '60px', 
              borderRadius: '30px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
            }}
          >
            {isPlaying ? <FaPause size={22} /> : <FaPlay size={22} style={{ marginLeft: '4px' }} />}
          </button>
          
          <button style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', opacity: 0.7 }}><FaStepForward size={20} /></button>
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
