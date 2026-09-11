import React, { useRef, useState, useEffect } from 'react';
import { motion, useAnimation, useMotionValue, useTransform } from 'framer-motion';
import { FiHeart, FiMessageCircle, FiPlay, FiMusic, FiBookmark, FiShare2, FiMaximize, FiMinimize } from 'react-icons/fi';

function VideoCard({ video, isTop, onSwipe, index }) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const controls = useAnimation();

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-10, 10]);

  useEffect(() => {
    if (isTop && videoRef.current) {
      videoRef.current.play().catch(e => console.log('Autoplay blocked', e));
      setIsPlaying(true);
    } else if (!isTop && videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, [isTop]);

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  const toggleFullscreen = (e) => {
    e.stopPropagation();
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => {
        console.log(`Error attempting to enable fullscreen mode: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const handleDragEnd = (event, info) => {
    const swipeThreshold = 100;
    if (info.offset.x > swipeThreshold) {
      controls.start({ x: 500, opacity: 0, transition: { duration: 0.3 } }).then(() => onSwipe('right'));
    } else if (info.offset.x < -swipeThreshold) {
      controls.start({ x: -500, opacity: 0, transition: { duration: 0.3 } }).then(() => onSwipe('left'));
    } else {
      controls.start({ x: 0, y: 0, transition: { type: 'spring', stiffness: 300, damping: 20 } });
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    controls.start(isTop 
      ? { scale: 1, y: 0, opacity: 1, x: 0 } 
      : { scale: 1 - index * 0.05, y: index * 20, opacity: 1 - index * 0.2, x: 0 }
    );
  }, [isTop, index, controls]);

  return (
    <motion.div
      drag={isTop ? 'x' : false}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      onDragEnd={handleDragEnd}
      animate={controls}
      initial={{ scale: 0.95, y: 20, opacity: 0 }}
      exit={{ x: -500, opacity: 0 }}
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: 'var(--bg-color)',
        border: isFullscreen ? 'none' : '1px solid var(--text-color)',
        borderRadius: isFullscreen ? '0px' : '20px',
        overflow: 'hidden',
        boxShadow: isFullscreen ? 'none' : '0 4px 15px rgba(0,0,0,0.2)',
        display: 'flex',
        flexDirection: 'column',
        cursor: isTop ? 'grab' : 'default',
        zIndex: 100 - index,
        x,
        rotate
      }}
      whileDrag={{ cursor: 'grabbing' }}
    >
      <div 
        ref={containerRef}
        style={{ flex: 1, position: 'relative', backgroundColor: '#000', width: '100%', height: '100%' }}
        onClick={togglePlay}
      >
        <video
          ref={videoRef}
          src={video.url}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          loop
          playsInline
          muted // Muted to allow autoplay policies
        />
        
        {/* Fullscreen Toggle */}
        <div 
          onClick={toggleFullscreen}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            color: '#fff',
            cursor: 'pointer',
            padding: '10px',
            backgroundColor: 'rgba(0,0,0,0.3)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10
          }}
        >
          {isFullscreen ? <FiMinimize size={24} /> : <FiMaximize size={24} />}
        </div>
        
        {/* Bottom Gradient for readability */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: '40%',
          background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)',
          pointerEvents: 'none'
        }} />

        {/* Mock social media UI overlay (Left: Info) */}
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '15px',
          right: '80px', // leave space for right column
          color: '#fff',
          textShadow: '1px 1px 3px rgba(0,0,0,0.8)',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '35px',
              height: '35px',
              borderRadius: '50%',
              backgroundColor: 'var(--text-color)',
              color: 'var(--bg-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              fontFamily: 'var(--font-serif)',
              fontSize: '1.2rem'
            }}>
              {video.author.charAt(0).toUpperCase()}
            </div>
            <h3 style={{ margin: 0, fontFamily: 'var(--font-serif)', fontSize: '1.1rem' }}>@{video.author}</h3>
          </div>
          <p style={{ margin: 0, fontSize: '0.9rem', fontFamily: 'monospace', lineHeight: '1.3' }}>{video.description}</p>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', fontFamily: 'monospace', marginTop: '5px' }}>
            <FiMusic size={14} />
            <motion.div
              animate={{ x: [0, -100] }}
              transition={{ repeat: Infinity, duration: 5, ease: "linear" }}
              style={{ whiteSpace: 'nowrap', overflow: 'hidden', width: '150px' }}
            >
              Original Sound - {video.author} ✨
            </motion.div>
          </div>
        </div>

        {/* Mock social media UI overlay (Right: Actions) */}
        <div style={{
          position: 'absolute',
          bottom: '20px',
          right: '15px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px',
          color: '#fff',
          textShadow: '1px 1px 3px rgba(0,0,0,0.8)'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}>
            <div style={{ backgroundColor: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '50%' }}>
              <FiHeart size={24} />
            </div>
            <span style={{ fontSize: '0.8rem', fontFamily: 'monospace', marginTop: '4px' }}>{video.likes}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}>
            <div style={{ backgroundColor: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '50%' }}>
              <FiMessageCircle size={24} />
            </div>
            <span style={{ fontSize: '0.8rem', fontFamily: 'monospace', marginTop: '4px' }}>{video.comments}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}>
            <div style={{ backgroundColor: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '50%' }}>
              <FiBookmark size={24} />
            </div>
            <span style={{ fontSize: '0.8rem', fontFamily: 'monospace', marginTop: '4px' }}>Save</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}>
            <div style={{ backgroundColor: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '50%' }}>
              <FiShare2 size={24} />
            </div>
            <span style={{ fontSize: '0.8rem', fontFamily: 'monospace', marginTop: '4px' }}>Share</span>
          </div>
        </div>

        {!isPlaying && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: 'rgba(255,255,255,0.7)',
            pointerEvents: 'none'
          }}>
            <FiPlay size={64} />
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default VideoCard;
