import React, { useEffect, useState, useRef } from 'react';
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
  const containerRef = useRef(null);

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

  const handleMouseMove = (e) => {
    if (containerRef.current) {
      containerRef.current.style.setProperty('--mouse-x', `${e.clientX}px`);
      containerRef.current.style.setProperty('--mouse-y', `${e.clientY}px`);
    }
  };

  // Static souvenirs for background clutter with rotation state
  const souvenirs = [
    { src: '/souvenirs/conepine.png', style: { top: '10%', left: '5%', '--rot': '-15deg', width: '80px', '--float-duration': '5s' } },
    { src: '/souvenirs/mapleleaf.png', style: { top: '30%', right: '8%', '--rot': '25deg', width: '90px', '--float-duration': '7s' } },
    { src: '/souvenirs/marquesitayucateca.png', style: { top: '60%', left: '12%', '--rot': '-5deg', width: '120px', '--float-duration': '6s' } },
    { src: '/souvenirs/conepine.png', style: { top: '80%', right: '15%', '--rot': '45deg', transform: 'scale(0.8)', width: '80px', '--float-duration': '8s' } }
  ];

  // Random dust particles
  const dustParticles = Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}vw`,
    width: `${Math.random() * 4 + 2}px`,
    height: `${Math.random() * 4 + 2}px`,
    duration: `${Math.random() * 15 + 10}s`,
    delay: `${Math.random() * 10}s`,
    maxOpacity: Math.random() * 0.3 + 0.1
  }));

  return (
    <div ref={containerRef} onMouseMove={handleMouseMove} style={{ minHeight: '100vh', position: 'relative' }}>
      <PageWrapper 
        isLoading={isLoading} 
        loadingTextEn="Preparing gallery..." 
        loadingTextEs="Preparando galería..."
        style={{ minHeight: '100vh' }}
      >
        <div className="museum-wall">
          {dustParticles.map(particle => (
            <div 
              key={particle.id}
              className="dust-particle"
              style={{
                left: particle.left,
                width: particle.width,
                height: particle.height,
                '--duration': particle.duration,
                animationDelay: particle.delay,
                '--max-opacity': particle.maxOpacity
              }}
            />
          ))}
          {souvenirs.map((sov, idx) => (
            <img key={idx} src={sov.src} className="souvenir-bg" style={sov.style} alt="" />
          ))}
        </div>
        
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

          <div className="visuals-masonry">
            {visuals.map((visual, index) => (
              <motion.div 
                key={visual._id} 
                className="visuals-masonry-item"
                initial={{ opacity: 0, rotateZ: index % 2 === 0 ? -15 : 15, y: -50 }}
                animate={{ opacity: 1, rotateZ: 0, y: 0 }}
                transition={{ type: "spring", stiffness: 100, damping: 10, mass: 1, delay: 0.3 + (index * 0.15) }}
                style={{ transformOrigin: 'top center' }}
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
