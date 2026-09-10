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
    <PageWrapper isLoading={isLoading} loadingTextEn="Loading tracks..." loadingTextEs="Cargando pistas..." style={{ minHeight: '100vh', padding: '2rem 0' }}>
      <MusicGraphics color={animColor} />
      <BackButton />
      
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
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

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '3rem 2rem',
          justifyItems: 'center',
          alignItems: 'center'
        }}>
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
