import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';
import PageWrapper from '../PageWrapper';
import BackButton from '../BackButton';
import './VisualsView.css';

// Using Unsplash as a temporary placeholder until a backend is integrated
const MOCK_VISUALS = [
  { id: 1, src: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?q=80&w=800&auto=format&fit=crop', titleEn: 'Abstract Thought', titleEs: 'Pensamiento Abstracto', mediumEn: 'Oil on Canvas', mediumEs: 'Óleo sobre Lienzo', year: '2026' },
  { id: 2, src: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=800&auto=format&fit=crop', titleEn: 'The Gaze', titleEs: 'La Mirada', mediumEn: 'Charcoal', mediumEs: 'Carbón', year: '2025' },
  { id: 3, src: 'https://images.unsplash.com/photo-1578301978693-85fa9c026f43?q=80&w=800&auto=format&fit=crop', titleEn: 'Texture 01', titleEs: 'Textura 01', mediumEn: 'Mixed Media', mediumEs: 'Técnica Mixta', year: '2023' },
  { id: 4, src: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=800&auto=format&fit=crop', titleEn: 'Urban Geometry', titleEs: 'Geometría Urbana', mediumEn: 'Digital Illustration', mediumEs: 'Ilustración Digital', year: '2026' },
  { id: 5, src: 'https://images.unsplash.com/photo-1580136608260-4ebf15fac362?q=80&w=800&auto=format&fit=crop', titleEn: 'Sculpted Mind', titleEs: 'Mente Esculpida', mediumEn: 'Digital Painting', mediumEs: 'Pintura Digital', year: '2026' },
  { id: 6, src: 'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?q=80&w=800&auto=format&fit=crop', titleEn: 'Color Study', titleEs: 'Estudio de Color', mediumEn: 'Acrylic', mediumEs: 'Acrílico', year: '2024' },
  { id: 7, src: 'https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?q=80&w=800&auto=format&fit=crop', titleEn: 'Serenity', titleEs: 'Serenidad', mediumEn: 'Watercolor', mediumEs: 'Acuarela', year: '2025' },
  { id: 8, src: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=800&auto=format&fit=crop', titleEn: 'Form & Space', titleEs: 'Forma y Espacio', mediumEn: 'Ink', mediumEs: 'Tinta', year: '2023' }
];

function VisualsView() {
  const { language } = useLanguage();
  const [visuals, setVisuals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setVisuals(MOCK_VISUALS);
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <PageWrapper 
      isLoading={isLoading} 
      loadingTextEn="Preparing gallery..." 
      loadingTextEs="Preparando galería..."
      style={{ minHeight: '100vh' }}
    >
      <div className="museum-wall" />
      
      <div className="visuals-container">
        <BackButton style={{ position: 'relative', zIndex: 100 }} />
        
        <div className="visuals-header">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {language === 'EN' ? 'Visual Arts' : 'Artes Visuales'}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {language === 'EN' ? 'Paintings, Drawings & Digital Illustrations' : 'Pinturas, Dibujos e Ilustraciones Digitales'}
          </motion.p>
        </div>

        <div className="visuals-masonry">
          {visuals.map((visual, index) => (
            <motion.div 
              key={visual.id} 
              className="visuals-masonry-item"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 + (index * 0.1) }}
            >
              <div className="metallic-frame-wrapper">
                <img src={visual.src} alt={language === 'EN' ? visual.titleEn : visual.titleEs} className="artwork-image" loading="lazy" />
              </div>
              <div className="museum-plaque">
                <div className="museum-plaque-title">
                  {language === 'EN' ? visual.titleEn : visual.titleEs}
                </div>
                <div className="museum-plaque-meta">
                  {language === 'EN' ? visual.mediumEn : visual.mediumEs}, {visual.year}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}

export default React.memo(VisualsView);
