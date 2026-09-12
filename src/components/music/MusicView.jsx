import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
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
  
  const { data: tracks = [], isLoading } = useQuery({
    queryKey: ['tracks'],
    queryFn: async () => {
      const res = await api.get('/tracks');
      return res.data;
    }
  });

  return (
    <PageWrapper isLoading={isLoading} loadingTextEn="Loading tracks..." loadingTextEs="Cargando pistas..." style={{ minHeight: '100vh', paddingBottom: '2rem' }}>
      <MusicGraphics color={animColor} />
      <BackButton />
      
      <div style={{ width: '100%', maxWidth: '1400px', margin: '0 auto', padding: '2rem 1rem', boxSizing: 'border-box' }}>
        <div style={{ marginBottom: '2rem', textAlign: 'center', color: 'var(--text-color)' }}>
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

        <style>{`
          .music-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 3rem 2rem;
            justify-items: center;
            align-items: start;
          }
          @media (min-width: 600px) {
            .music-grid {
              grid-template-columns: repeat(2, 1fr);
            }
          }
          @media (min-width: 960px) {
            .music-grid {
              grid-template-columns: repeat(3, 1fr);
            }
          }
          @media (min-width: 1280px) {
            .music-grid {
              grid-template-columns: repeat(4, 1fr);
            }
          }
        `}</style>

        <div className="music-grid">
          {tracks.map(track => (
            <CassetteItem key={track._id} track={track} animColor={animColor} />
          ))}
          {!isLoading && tracks.length === 0 && (
            <div style={{ gridColumn: '1 / -1', opacity: 0.5 }}>
              {language === 'EN' ? 'No tracks found.' : 'No se encontraron pistas.'}
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}

export default MusicView;

