import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import PageWrapper from '../PageWrapper';
import BackButton from '../BackButton';
import CassetteItem from './CassetteItem';
import { MusicGraphics } from './MusicGraphics';
import { useLanguage } from '../../contexts/LanguageContext';
import api from '../../api';

const COLORS = [
  { name: 'purple', value: '#b566ff' },
  { name: 'green', value: '#10ff70' },
  { name: 'red', value: '#ff4040' },
  { name: 'yellow', value: '#ffe600' },
  { name: 'blue', value: '#1ab3ff' },
  { name: 'orange', value: '#ff8800' }
];

function MusicView() {
  const { language } = useLanguage();
  const [animColor, setAnimColor] = useState(COLORS[0].value);
  const [activeIndex, setActiveIndex] = useState(0);
  
  const { data: tracks = [], isLoading } = useQuery({
    queryKey: ['tracks'],
    queryFn: async () => {
      const res = await api.get('/tracks');
      return res.data;
    }
  });

  const handlePrev = () => {
    setActiveIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => Math.min(tracks.length - 1, prev + 1));
  };

  return (
    <PageWrapper isLoading={isLoading} loadingTextEn="Loading tracks..." loadingTextEs="Cargando pistas..." style={{ minHeight: '100vh', padding: '2rem 0' }}>
      <MusicGraphics color={animColor} />
      <BackButton />
      
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem', display: 'flex', flexDirection: 'column', minHeight: '80vh' }}>
        <div style={{ marginBottom: '1rem', textAlign: 'center', color: 'var(--text-color)' }}>
          <h1 style={{ fontSize: '3rem', fontFamily: 'var(--font-serif)', marginBottom: '0.5rem' }}>
            {language === 'EN' ? 'Music Library' : 'Biblioteca Musical'}
          </h1>
          <p style={{ opacity: 0.7, fontFamily: 'monospace', marginBottom: '1.5rem' }}>
            {language === 'EN' ? 'Select a cassette to play' : 'Selecciona un casete para reproducir'}
          </p>
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.8rem' }}>
            {COLORS.map(c => (
              <button
                key={c.name}
                onClick={() => setAnimColor(c.value)}
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: c.value,
                  border: animColor === c.value ? '2px solid var(--text-color)' : '2px solid transparent',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  padding: 0,
                  boxShadow: animColor === c.value ? '0 0 10px rgba(0,0,0,0.2)' : 'none'
                }}
                title={c.name}
              />
            ))}
          </div>
        </div>

        <div style={{ 
          position: 'relative', 
          flex: 1, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          overflow: 'hidden',
          perspective: '1200px',
          marginTop: '2rem',
          minHeight: '300px'
        }}>
          {tracks.length > 0 && (
            <>
              <button 
                onClick={handlePrev}
                disabled={activeIndex === 0}
                style={{
                  position: 'absolute', left: '5%', zIndex: 1000,
                  background: 'rgba(255,255,255,0.1)', border: 'none', color: 'var(--text-color)',
                  width: '50px', height: '50px', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: activeIndex === 0 ? 'default' : 'pointer',
                  opacity: activeIndex === 0 ? 0.2 : 0.8,
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.2s ease'
                }}
              >
                <FaChevronLeft size={24} />
              </button>

              <div style={{ position: 'relative', width: '100%', maxWidth: '350px', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', transformStyle: 'preserve-3d' }}>
                <AnimatePresence>
                  {tracks.map((track, i) => {
                    const offset = i - activeIndex;
                    const absOffset = Math.abs(offset);
                    const isActive = offset === 0;
                    const isVisible = absOffset <= 3;

                    if (!isVisible) return null;

                    // Calculate Cover Flow properties
                    const x = offset * 180; // Distance between items
                    const scale = isActive ? 1 : Math.max(0.6, 1 - absOffset * 0.15);
                    const rotateY = isActive ? 0 : (offset > 0 ? -45 : 45);
                    const z = isActive ? 100 : -absOffset * 150;
                    const opacity = isActive ? 1 : Math.max(0, 1 - absOffset * 0.3);
                    const zIndex = 100 - absOffset;

                    return (
                      <motion.div
                        key={track._id}
                        initial={false}
                        animate={{ x, scale, rotateY, z, opacity }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        style={{
                          position: 'absolute',
                          zIndex,
                          width: '100%',
                          transformStyle: 'preserve-3d'
                        }}
                      >
                        <CassetteItem 
                          track={track} 
                          animColor={animColor} 
                          isActive={isActive} 
                          onMakeActive={() => setActiveIndex(i)}
                        />
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>

              <button 
                onClick={handleNext}
                disabled={activeIndex === tracks.length - 1}
                style={{
                  position: 'absolute', right: '5%', zIndex: 1000,
                  background: 'rgba(255,255,255,0.1)', border: 'none', color: 'var(--text-color)',
                  width: '50px', height: '50px', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: activeIndex === tracks.length - 1 ? 'default' : 'pointer',
                  opacity: activeIndex === tracks.length - 1 ? 0.2 : 0.8,
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.2s ease'
                }}
              >
                <FaChevronRight size={24} />
              </button>
            </>
          )}

          {!isLoading && tracks.length === 0 && (
            <div style={{ opacity: 0.5 }}>
              {language === 'EN' ? 'No tracks found.' : 'No se encontraron pistas.'}
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}

export default MusicView;
