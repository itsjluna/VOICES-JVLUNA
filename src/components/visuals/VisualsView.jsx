import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';
import PageWrapper from '../PageWrapper';
import BackButton from '../BackButton';
import { FaTimes } from 'react-icons/fa';
import api from '../../api';
import './VisualsView.css';

function VisualsView() {
  const { language } = useLanguage();
  const [visuals, setVisuals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVisual, setSelectedVisual] = useState(null);

  useEffect(() => {
    const fetchVisuals = async () => {
      try {
        const res = await api.get('/visuals');
        setVisuals(res.data);
      } catch (err) {
        console.error("Error fetching visuals:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchVisuals();
  }, []);

  const closeModal = () => setSelectedVisual(null);

  const masonryClass = `visuals-masonry items-${Math.min(visuals.length, 3)}`;

  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      <PageWrapper 
        isLoading={isLoading} 
        loadingTextEn="Preparing gallery..." 
        loadingTextEs="Preparando galería..."
        style={{ minHeight: '100vh' }}
      >
        <div className="museum-wall"></div>
        
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

          {visuals.length === 0 && !isLoading && (
            <div style={{ textAlign: 'center', opacity: 0.5, marginTop: '4rem' }}>
              {language === 'EN' ? 'No artworks on display yet.' : 'Aún no hay obras en exhibición.'}
            </div>
          )}

          <div className={masonryClass}>
            {visuals.map((visual, index) => (
              <motion.div 
                key={visual._id} 
                className="visuals-masonry-item"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 + (index * 0.1) }}
                onClick={() => setSelectedVisual(visual)}
              >
                <div className="metallic-frame-wrapper">
                  <img src={visual.image} alt={language === 'EN' ? visual.titleEn : visual.titleEs} className="artwork-image" loading="lazy" />
                </div>
                <div className="glass-plaque">
                  <div className="glass-plaque-title">
                    {language === 'EN' ? (visual.titleEn || visual.titleEs) : (visual.titleEs || visual.titleEn)}
                  </div>
                  <div className="glass-plaque-meta">
                    {visual.author}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <AnimatePresence>
          {selectedVisual && (
            <motion.div 
              className="visual-modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
            >
              <motion.div 
                className="visual-modal-content"
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                onClick={e => e.stopPropagation()}
              >
                <button className="visual-modal-close" onClick={closeModal}><FaTimes size={16} /></button>
                <div className="visual-modal-image-container">
                  <img src={selectedVisual.image} alt="Artwork" />
                </div>
                <div className="visual-modal-info">
                  <h2>{language === 'EN' ? (selectedVisual.titleEn || selectedVisual.titleEs) : (selectedVisual.titleEs || selectedVisual.titleEn)}</h2>
                  
                  <div className="meta-row">
                    <span>{language === 'EN' ? 'Author' : 'Autor'}</span>
                    <span>{selectedVisual.author}</span>
                  </div>
                  <div className="meta-row">
                    <span>{language === 'EN' ? 'Technique' : 'Técnica'}</span>
                    <span>{language === 'EN' ? (selectedVisual.techniqueEn || selectedVisual.techniqueEs) : (selectedVisual.techniqueEs || selectedVisual.techniqueEn)}</span>
                  </div>
                  <div className="meta-row">
                    <span>{language === 'EN' ? 'Year' : 'Año'}</span>
                    <span>{selectedVisual.year}</span>
                  </div>
                  
                  <p>
                    {language === 'EN' ? (selectedVisual.descriptionEn || selectedVisual.descriptionEs) : (selectedVisual.descriptionEs || selectedVisual.descriptionEn)}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </PageWrapper>
    </div>
  );
}

export default React.memo(VisualsView);
