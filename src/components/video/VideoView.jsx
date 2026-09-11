import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import PageWrapper from '../PageWrapper';
import BackButton from '../BackButton';
import VideoCard from './VideoCard';
import SocialBackground from './SocialBackground';
import { useLanguage } from '../../contexts/LanguageContext';
import api from '../../api';

function VideoView() {
  const { language } = useLanguage();
  const [cards, setCards] = useState([]);
  const [browserInfo, setBrowserInfo] = useState('');

  const { data: videos = [], isLoading, refetch } = useQuery({
    queryKey: ['videos'],
    queryFn: async () => {
      const res = await api.get('/videos');
      return res.data;
    }
  });

  const [showTutorial, setShowTutorial] = useState(false);

  const dragX = useMotionValue(0);
  const slayOpacity = useTransform(dragX, [50, 150], [0, 1]);
  const slayScale = useTransform(dragX, [50, 150], [0.5, 1.2]);
  const flopOpacity = useTransform(dragX, [-50, -150], [0, 1]);
  const flopScale = useTransform(dragX, [-50, -150], [0.5, 1.2]);

  // Glow effects based on drag
  const slayGlow = useTransform(dragX, [50, 150], ['rgba(74,222,128,0)', 'rgba(74,222,128,0.5)']);
  const flopGlow = useTransform(dragX, [-50, -150], ['rgba(248,113,113,0)', 'rgba(248,113,113,0.5)']);

  useEffect(() => {
    let initialCards = [...videos];
    if (!localStorage.getItem('videoSwipeTutorialSeen') && videos.length > 0) {
      initialCards.unshift({
        _id: 'tutorial-mockup-card',
        isTutorial: true,
        url: 'https://www.youtube.com/embed/VdArIrZYFGI?autoplay=1&mute=1&loop=1&controls=0&showinfo=0&rel=0&playsinline=1&playlist=VdArIrZYFGI',
        author: 'system',
        description: 'Tutorial',
        likes: 999,
        comments: 999
      });
      setShowTutorial(true);
    }
    setCards(initialCards);
  }, [videos]);

  useEffect(() => {
    // Gather browser info to personalize
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Unknown location';
    const lang = navigator.language || 'en-US';
    const platform = navigator.platform || 'Unknown OS';
    setBrowserInfo(`Browsing from ${tz} | System: ${platform} | Locale: ${lang}`);
  }, []);

  const handleSwipe = (id, direction) => {
    if (showTutorial) {
      setShowTutorial(false);
      localStorage.setItem('videoSwipeTutorialSeen', 'true');
    }
    setCards(prev => prev.filter(card => card._id !== id));
    dragX.set(0); // reset background stamps
  };

  const handleRefresh = async () => {
    const { data } = await refetch();
    if (data && data.length > 0) {
      setCards([...data].sort(() => Math.random() - 0.5));
    }
  };

  return (
    <PageWrapper isLoading={isLoading} loadingTextEn="Loading feed..." loadingTextEs="Cargando videos...">
      <SocialBackground />
      <BackButton />
      
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '80vh',
        padding: '2rem 1rem',
        position: 'relative',
        zIndex: 10
      }}>
        <div style={{ textAlign: 'center', marginBottom: '1rem', color: 'var(--text-color)' }}>
          <h1 style={{ fontFamily: 'var(--font-serif)', marginBottom: '0.5rem' }}>
            {language === 'EN' ? 'Video Feed' : 'Videos'}
          </h1>
          <p style={{ opacity: 0.6, fontSize: '0.8rem', fontFamily: 'monospace' }}>
            {browserInfo}
          </p>
        </div>

        <div style={{
          position: 'relative',
          width: '100%',
          maxWidth: '400px',
          height: '600px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {/* Background Ambient Glows and Stamps */}
          {cards.length > 0 && (
            <>
              {/* SLAY Element (Right Side, meaning dragged right) */}
              <motion.div style={{
                position: 'absolute', right: '10px', top: '50%', marginTop: '-50px', rotate: 15,
                opacity: slayOpacity, scale: slayScale, color: '#4ade80', fontSize: '4.5rem', fontWeight: '900',
                fontFamily: 'var(--font-serif)', textShadow: '0 0 30px rgba(74,222,128,0.8)', pointerEvents: 'none', zIndex: 0
              }}>
                SLAY
                <motion.div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '200px', height: '400px', background: slayGlow, filter: 'blur(50px)', zIndex: -1, borderRadius: '50%' }} />
              </motion.div>

              {/* FLOP Element (Left Side, meaning dragged left) */}
              <motion.div style={{
                position: 'absolute', left: '10px', top: '50%', marginTop: '-50px', rotate: -15,
                opacity: flopOpacity, scale: flopScale, color: '#f87171', fontSize: '4.5rem', fontWeight: '900',
                fontFamily: 'var(--font-serif)', textShadow: '0 0 30px rgba(248,113,113,0.8)', pointerEvents: 'none', zIndex: 0
              }}>
                FLOP
                <motion.div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '200px', height: '400px', background: flopGlow, filter: 'blur(50px)', zIndex: -1, borderRadius: '50%' }} />
              </motion.div>
            </>
          )}

          <AnimatePresence>
            {cards.map((video, index) => {
              const isTop = index === 0;
              return (
                <VideoCard
                  key={video._id}
                  video={video}
                  isTop={isTop}
                  onSwipe={(dir) => handleSwipe(video._id, dir)}
                  index={index}
                  dragX={isTop ? dragX : undefined}
                />
              );
            }).reverse()}
          </AnimatePresence>
          
          {cards.length === 0 && (
            <div style={{ color: 'var(--text-color)', textAlign: 'center' }}>
              <p>{language === 'EN' ? "You've seen everything!" : "¡Has visto todo!"}</p>
              <button 
                onClick={handleRefresh}
                style={{
                  marginTop: '1rem',
                  padding: '0.5rem 1rem',
                  background: 'var(--text-color)',
                  color: 'var(--bg-color)',
                  border: 'none',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  fontFamily: 'monospace'
                }}
              >
                {language === 'EN' ? "Refresh Feed" : "Actualizar"}
              </button>
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}

export default VideoView;
