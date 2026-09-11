import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

  useEffect(() => {
    if (videos.length > 0) {
      setCards(videos);
    }
    if (!localStorage.getItem('videoSwipeTutorialSeen')) {
      setShowTutorial(true);
    }
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
                />
              );
            }).reverse()}
          </AnimatePresence>

          <AnimatePresence>
            {showTutorial && cards.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  position: 'absolute',
                  top: 0, left: 0, right: 0, bottom: 0,
                  backgroundColor: 'rgba(0,0,0,0.6)',
                  zIndex: 200,
                  borderRadius: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  pointerEvents: 'none',
                  color: '#fff',
                  fontFamily: 'monospace'
                }}
              >
                <motion.div
                  animate={{ x: [-20, 20, -20] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ fontSize: '3rem', marginBottom: '1rem' }}
                >
                  👆
                </motion.div>
                <h2 style={{ margin: 0, textShadow: '1px 1px 3px #000' }}>
                  {language === 'EN' ? 'Swipe to explore' : 'Desliza para explorar'}
                </h2>
              </motion.div>
            )}
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
