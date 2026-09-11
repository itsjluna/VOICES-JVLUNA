import React, { useRef, useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { FiHeart, FiMessageCircle, FiPlay } from 'react-icons/fi';

function VideoCard({ video, isTop, onSwipe, index }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const controls = useAnimation();

  useEffect(() => {
    if (isTop && videoRef.current) {
      // Auto-play top video (browsers may require mute for autoplay, let's just try play)
      videoRef.current.play().catch(e => console.log('Autoplay blocked', e));
      setIsPlaying(true);
    } else if (!isTop && videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, [isTop]);

  const handleDragEnd = (event, info) => {
    const swipeThreshold = 100;
    if (info.offset.x > swipeThreshold) {
      // Swiped right
      controls.start({ x: 500, opacity: 0, transition: { duration: 0.3 } }).then(() => onSwipe('right'));
    } else if (info.offset.x < -swipeThreshold) {
      // Swiped left
      controls.start({ x: -500, opacity: 0, transition: { duration: 0.3 } }).then(() => onSwipe('left'));
    } else {
      // Return to center
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
        border: '1px solid var(--text-color)',
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
        display: 'flex',
        flexDirection: 'column',
        cursor: isTop ? 'grab' : 'default',
        zIndex: 100 - index
      }}
      whileDrag={{ cursor: 'grabbing' }}
    >
      <div 
        style={{ flex: 1, position: 'relative', backgroundColor: '#000' }}
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
        
        {/* Mock social media UI overlay */}
        <div style={{
          position: 'absolute',
          bottom: '10%',
          left: '10px',
          color: '#fff',
          textShadow: '1px 1px 3px rgba(0,0,0,0.8)'
        }}>
          <h3 style={{ margin: '0 0 5px 0', fontFamily: 'var(--font-serif)' }}>@{video.author}</h3>
          <p style={{ margin: 0, fontSize: '0.9rem', fontFamily: 'monospace' }}>{video.description}</p>
        </div>

        <div style={{
          position: 'absolute',
          bottom: '15%',
          right: '10px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px',
          color: '#fff',
          textShadow: '1px 1px 3px rgba(0,0,0,0.8)'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}>
            <FiHeart size={28} />
            <span style={{ fontSize: '0.8rem', fontFamily: 'monospace', marginTop: '4px' }}>{video.likes}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}>
            <FiMessageCircle size={28} />
            <span style={{ fontSize: '0.8rem', fontFamily: 'monospace', marginTop: '4px' }}>{video.comments}</span>
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
