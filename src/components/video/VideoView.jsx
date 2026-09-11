import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageWrapper from '../PageWrapper';
import BackButton from '../BackButton';
import VideoCard from './VideoCard';
import { useLanguage } from '../../contexts/LanguageContext';

const MOCK_VIDEOS = [
  {
    id: 1,
    url: 'https://www.w3schools.com/html/mov_bbb.mp4',
    author: 'w3schools',
    description: 'Big Buck Bunny trailer',
    likes: 1240,
    comments: 45
  },
  {
    id: 2,
    url: 'https://media.w3.org/2010/05/sintel/trailer.mp4',
    author: 'blender_foundation',
    description: 'Sintel Trailer',
    likes: 8900,
    comments: 312
  },
  {
    id: 3,
    url: 'https://www.w3schools.com/html/mov_bbb.mp4',
    author: 'bunny_fan_99',
    description: 'Look at this bunny again!',
    likes: 245,
    comments: 12
  }
];

function VideoView() {
  const { language } = useLanguage();
  const [cards, setCards] = useState(MOCK_VIDEOS);
  const [browserInfo, setBrowserInfo] = useState('');

  useEffect(() => {
    // Gather browser info to personalize
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Unknown location';
    const lang = navigator.language || 'en-US';
    const platform = navigator.platform || 'Unknown OS';
    setBrowserInfo(`Browsing from ${tz} | System: ${platform} | Locale: ${lang}`);
  }, []);

  const handleSwipe = (id, direction) => {
    setCards(prev => prev.filter(card => card.id !== id));
  };

  const handleRefresh = () => {
    setCards([...MOCK_VIDEOS].sort(() => Math.random() - 0.5));
  };

  return (
    <PageWrapper>
      <BackButton />
      
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '80vh',
        padding: '2rem 1rem'
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
                  key={video.id}
                  video={video}
                  isTop={isTop}
                  onSwipe={(dir) => handleSwipe(video.id, dir)}
                  index={index}
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
