import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';
import PageWrapper from '../PageWrapper';
import BackButton from '../BackButton';
import { FaTimes, FaPalette } from 'react-icons/fa';
import api from '../../api';
import Sketchpad from './Sketchpad';
import './VisualsView.css';

function VisualsView() {
  const { language } = useLanguage();
  const [visuals, setVisuals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVisual, setSelectedVisual] = useState(null);
  const [columnsCount, setColumnsCount] = useState(3);
  const [isSketchpadOpen, setIsSketchpadOpen] = useState(false);

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

  // Update columns count based on window resize
  useEffect(() => {
    const updateColumns = () => {
      if (window.innerWidth >= 1024) setColumnsCount(3);
      else if (window.innerWidth >= 640) setColumnsCount(2);
      else setColumnsCount(1);
    };
    updateColumns();
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, []);

  const closeModal = () => setSelectedVisual(null);

  // Distribute items into columns (bulletproof masonry)
  const activeCols = Math.max(1, Math.min(visuals.length, columnsCount));
  const columnData = Array.from({ length: activeCols }, () => []);
  visuals.forEach((visual, index) => {
    columnData[index % activeCols].push(visual);
  });

  // Optimized souvenirs for background clutter
  const souvenirs = [
    { src: '/souvenirs/conepine.png', style: { top: '10%', left: '5%', '--rot': '-15deg', width: '80px', '--float-duration': '6s' } },
    { src: '/souvenirs/mapleleaf.png', style: { top: '30%', right: '8%', '--rot': '25deg', width: '90px', '--float-duration': '8s' } },
    { src: '/souvenirs/marquesitayucateca.png', style: { top: '60%', left: '12%', '--rot': '-5deg', width: '120px', '--float-duration': '7s' } },
    { src: '/souvenirs/conepine.png', style: { top: '80%', right: '15%', '--rot': '45deg', width: '60px', '--float-duration': '9s' } }
  ];

  // Watercolor Blooms for background - smaller, more liquid and varied
  const bloomColors = [
    'rgba(173, 216, 230, 0.5)', 
    'rgba(255, 182, 193, 0.5)', 
    'rgba(152, 251, 152, 0.4)', 
    'rgba(255, 239, 150, 0.5)', 
    'rgba(221, 160, 221, 0.5)', 
    'rgba(255, 204, 153, 0.5)', 
  ];

  const watercolorBlooms = Array.from({ length: 12 }).map((_, i) => {
    const br1 = Math.floor(40 + Math.random() * 20);
    const br2 = Math.floor(40 + Math.random() * 20);
    const br3 = Math.floor(40 + Math.random() * 20);
    const br4 = Math.floor(40 + Math.random() * 20);
    const size = Math.random() * 100 + 100; // 100px to 200px
    return {
      id: i,
      left: `${Math.random() * 90 + 5}vw`,
      top: `${Math.random() * 90 + 5}vh`,
      width: `${size}px`,
      height: `${size * (0.8 + Math.random() * 0.4)}px`,
      color: bloomColors[i % bloomColors.length],
      duration: `${Math.random() * 15 + 15}s`,
      delay: `${Math.random() * 15}s`,
      borderRadius: `${br1}% ${100-br1}% ${br2}% ${100-br2}% / ${br3}% ${br4}% ${100-br4}% ${100-br3}%`
    };
  });

  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      <PageWrapper 
        isLoading={isLoading} 
        loadingTextEn="Preparing gallery..." 
        loadingTextEs="Preparando galería..."
        style={{ minHeight: '100vh' }}
      >
        <div className="museum-wall">
          {watercolorBlooms.map(bloom => (
            <div 
              key={bloom.id}
              className="watercolor-bloom"
              style={{
                left: bloom.left,
                top: bloom.top,
                width: bloom.width,
                height: bloom.height,
                backgroundColor: bloom.color,
                borderRadius: bloom.borderRadius,
                '--duration': bloom.duration,
                animationDelay: bloom.delay
              }}
            />
          ))}
          {souvenirs.map((sov, idx) => (
            <img key={idx} src={sov.src} className="souvenir-bg" style={sov.style} alt="" />
          ))}
        </div>
        
        <div className="visuals-container">
          <div style={{ position: 'relative', zIndex: 100 }}>
            <BackButton />
          </div>
          
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
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}
            >
              <button 
                className="studio-btn-rgb"
                onClick={() => setIsSketchpadOpen(true)}
              >
                <div className="studio-btn-rgb-inner">
                  <FaPalette size={18} /> 
                  <span>{language === 'EN' ? 'Open Studio' : 'Abrir Estudio'}</span>
                </div>
              </button>
            </motion.div>
          </div>

          {visuals.length === 0 && !isLoading && (
            <div style={{ textAlign: 'center', opacity: 0.5, marginTop: '4rem' }}>
              {language === 'EN' ? 'No artworks on display yet.' : 'Aún no hay obras en exhibición.'}
            </div>
          )}

          <div className="visuals-masonry-flex">
            {columnData.map((col, colIndex) => (
              <div key={colIndex} className="visuals-masonry-col">
                {col.map((visual, index) => {
                  // Calculate a staggered delay based on total index for a nice wave entry
                  const totalIndex = (index * activeCols) + colIndex;
                  return (
                    <motion.div 
                      key={visual._id} 
                      className="visuals-masonry-item"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.1 + (totalIndex * 0.1) }}
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
                  );
                })}
              </div>
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

        <AnimatePresence>
          {isSketchpadOpen && (
            <Sketchpad onClose={() => setIsSketchpadOpen(false)} />
          )}
        </AnimatePresence>
      </PageWrapper>
    </div>
  );
}

export default React.memo(VisualsView);
