import React, { useRef, useState, useEffect } from 'react';
import { motion, useAnimation, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { FiHeart, FiMessageCircle, FiPlay, FiBookmark, FiShare2, FiMaximize, FiMinimize, FiVolume2, FiVolumeX } from 'react-icons/fi';

const GEN_Z_SLANG = ["body so tea", "spill the tea", "im so delulu fr", "im just like him fr", "bro thinks hes him", "shes just like me", "girl like", "its giving video", "lowkey cringe", "hear me out", "btw means by the way btw", "fuck it we ball", "its so over", "in my flop era", "what is bro yapping about", "mejor mierda"];
const USERNAMES = ["user204", "alex_199", "sadgirl", "jvluna_fan", "the_real_one", "anon992", "vibes_only"];

function VideoCard({ video, isTop, onSwipe, index, dragX }) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const controls = useAnimation();

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-10, 10]);

  useEffect(() => {
    if (isTop && dragX) {
      const unsubscribe = x.on('change', (v) => dragX.set(v));
      return () => unsubscribe();
    }
  }, [isTop, dragX, x]);

  const [isMuted, setIsMuted] = useState(true);
  
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(video.likes);
  const [likeParticles, setLikeParticles] = useState([]);
  const [liveComments, setLiveComments] = useState([]);

  const handleLike = (e) => {
    e.stopPropagation();
    if (isLiked) {
      setIsLiked(false);
      setLikesCount(prev => prev - 1);
    } else {
      setIsLiked(true);
      setLikesCount(prev => prev + 1);
      const newParticles = Array.from({ length: 6 }).map((_, i) => ({
        id: Date.now() + i,
        emoji: Math.random() > 0.5 ? '🥀' : '❤️',
        x: (Math.random() - 0.5) * 60,
        y: -(Math.random() * 60 + 40),
        rotation: (Math.random() - 0.5) * 60
      }));
      setLikeParticles(prev => [...prev, ...newParticles]);
      setTimeout(() => {
        setLikeParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)));
      }, 1000);
    }
  };

  useEffect(() => {
    if (!isTop || !isPlaying) return;
    const interval = setInterval(() => {
      if (Math.random() > 0.5) {
        const newComment = {
          id: Date.now(),
          user: USERNAMES[Math.floor(Math.random() * USERNAMES.length)],
          text: GEN_Z_SLANG[Math.floor(Math.random() * GEN_Z_SLANG.length)]
        };
        setLiveComments(prev => [...prev.slice(-2), newComment]);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [isTop, isPlaying]);

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num;
  };

  const handleShare = (e) => {
    e.stopPropagation();
    const url = `${window.location.origin}/video`;
    navigator.clipboard.writeText(url).then(() => {
      alert("Link copied!");
    });
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  useEffect(() => {
    if (isTop && videoRef.current) {
      videoRef.current.play().catch(e => console.log('Autoplay blocked', e));
      setIsPlaying(true);
    } else if (!isTop && videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else if (isTop) {
      setIsPlaying(true); // Assume iframe autoplays
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
    const springTransition = { type: 'spring', stiffness: 300, damping: 25 };
    controls.start(isTop 
      ? { scale: 1, y: 0, opacity: 1, x: 0, transition: springTransition } 
      : { scale: 1 - index * 0.05, y: index * 20, opacity: 1 - index * 0.2, x: 0, transition: springTransition }
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
        {video.url.includes('youtube.com/embed') ? (
          <iframe
            src={video.url}
            style={{ width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none', border: 'none' }}
            allow="autoplay; encrypted-media; fullscreen"
            allowFullScreen
            title="tutorial"
          />
        ) : (
          <video
            ref={videoRef}
            src={video.url}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            loop
            playsInline
            muted={isMuted} // Muted to allow autoplay policies, toggleable
          />
        )}
        
        {/* Top Right Controls */}
        <div style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          zIndex: 10
        }}>
          <div 
            onClick={toggleMute}
            onPointerDown={(e) => e.stopPropagation()}
            style={{
              color: '#fff',
              cursor: 'pointer',
              width: '44px',
              height: '44px',
              backgroundColor: 'rgba(0,0,0,0.3)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {isMuted ? <FiVolumeX size={24} /> : <FiVolume2 size={24} />}
          </div>
          <div 
            onClick={toggleFullscreen}
            onPointerDown={(e) => e.stopPropagation()}
            style={{
              color: '#fff',
              cursor: 'pointer',
              width: '44px',
              height: '44px',
              backgroundColor: 'rgba(0,0,0,0.3)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {isFullscreen ? <FiMinimize size={24} /> : <FiMaximize size={24} />}
          </div>
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

        {video.isTutorial && (
          <div style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.4)',
            zIndex: 100,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
            color: '#fff',
            fontFamily: 'monospace'
          }}>
            <motion.div
              animate={{ x: [-20, 20, -20] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              style={{ fontSize: '3rem', marginBottom: '1rem' }}
            >
              👆
            </motion.div>
            <h2 style={{ margin: 0, textShadow: '1px 1px 3px #000' }}>
              Swipe to explore
            </h2>
          </div>
        )}

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
          {/* Live comments */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '4px', height: '40px', justifyContent: 'flex-end', overflow: 'hidden' }}>
            <AnimatePresence>
              {liveComments.map(c => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 0.8, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  style={{ fontSize: '0.75rem', fontFamily: 'monospace' }}
                >
                  <span style={{ opacity: 0.6 }}>@{c.user}:</span> {c.text}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

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
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '14px', flexShrink: 0 }}>
              <motion.div animate={{ height: isPlaying && !isMuted ? [4, 12, 4] : 4 }} transition={{ repeat: Infinity, duration: 0.5 }} style={{ width: '3px', backgroundColor: '#fff', borderRadius: '2px' }} />
              <motion.div animate={{ height: isPlaying && !isMuted ? [8, 4, 8] : 8 }} transition={{ repeat: Infinity, duration: 0.6 }} style={{ width: '3px', backgroundColor: '#fff', borderRadius: '2px' }} />
              <motion.div animate={{ height: isPlaying && !isMuted ? [3, 14, 3] : 3 }} transition={{ repeat: Infinity, duration: 0.4 }} style={{ width: '3px', backgroundColor: '#fff', borderRadius: '2px' }} />
            </div>
            <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}>
              Original Sound - {video.author} ✨
            </div>
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
          <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }} onClick={handleLike} onPointerDown={(e) => e.stopPropagation()}>
            <div style={{ backgroundColor: 'rgba(0,0,0,0.3)', width: '44px', height: '44px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FiHeart size={24} fill={isLiked ? '#ef4444' : 'transparent'} color={isLiked ? '#ef4444' : '#fff'} />
            </div>
            <span style={{ fontSize: '0.8rem', fontFamily: 'monospace', marginTop: '4px' }}>{formatNumber(likesCount)}</span>
            
            {/* Particles */}
            <AnimatePresence>
              {likeParticles.map(p => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 1, x: 0, y: 0, scale: 0.5, rotate: 0 }}
                  animate={{ opacity: 0, x: p.x, y: p.y, scale: 1.5, rotate: p.rotation }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  style={{ position: 'absolute', top: '10px', pointerEvents: 'none', fontSize: '1.2rem' }}
                >
                  {p.emoji}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }} onPointerDown={(e) => e.stopPropagation()}>
            <div style={{ backgroundColor: 'rgba(0,0,0,0.3)', width: '44px', height: '44px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FiMessageCircle size={24} />
            </div>
            <span style={{ fontSize: '0.8rem', fontFamily: 'monospace', marginTop: '4px' }}>{formatNumber(video.comments)}</span>
          </div>
          <div onClick={handleShare} onPointerDown={(e) => e.stopPropagation()} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}>
            <div style={{ backgroundColor: 'rgba(0,0,0,0.3)', width: '44px', height: '44px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
