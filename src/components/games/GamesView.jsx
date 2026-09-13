import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaPlay } from 'react-icons/fa';
import { useLanguage } from '../../contexts/LanguageContext';
import PageWrapper from '../PageWrapper';
import BackButton from '../BackButton';
import './GamesView.css';

export default function GamesView() {
  const { language } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <PageWrapper>
      <div className="games-wall">
        {/* Frutiger Aero Background Elements */}
        <div className="aero-light"></div>
        <div className="aero-bubbles">
          {Array.from({ length: 15 }).map((_, i) => (
            <div 
              key={i} 
              className="aero-bubble"
              style={{
                width: `${Math.random() * 60 + 20}px`,
                height: `${Math.random() * 60 + 20}px`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 15}s`,
                animationDuration: `${Math.random() * 10 + 10}s`
              }}
            />
          ))}
        </div>

        <div style={{ position: 'absolute', top: '2rem', left: '2rem', zIndex: 100 }}>
          <BackButton />
        </div>

        <div className="games-container">
          <div className="games-info">
            <motion.h1 
              className="games-title"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              {language === 'EN' ? 'PROJECT: NEON' : 'PROYECTO: NEON'}
            </motion.h1>
            
            <motion.h3 
              className="games-genre"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {language === 'EN' ? 'First-Person Platformer' : 'Plataformas en Primera Persona'}
            </motion.h3>

            <motion.p 
              className="games-desc"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {language === 'EN' 
                ? 'An experimental unity game exploring the boundaries between digital dimensions. Navigate through liminal spaces, manipulate gravity, and escape the simulation before it collapses.'
                : 'Un juego experimental en Unity que explora los límites entre dimensiones digitales. Navega por espacios liminales, manipula la gravedad y escapa de la simulación antes de que colapse.'}
            </motion.p>

            <motion.button 
              className="games-play-btn"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              onClick={() => setIsModalOpen(true)}
            >
              <FaPlay size={16} /> {language === 'EN' ? 'PLAY GAME' : 'JUGAR AHORA'}
            </motion.button>
          </div>

          <div className="crt-container">
            <motion.div 
              className="crt-monitor"
              initial={{ opacity: 0, rotateY: 30, scale: 0.8 }}
              animate={{ opacity: 1, rotateY: -10, scale: 1 }}
              transition={{ duration: 1, type: "spring" }}
            >
              <div className="crt-screen-bezel">
                <div className="crt-screen">
                  <iframe 
                    className="crt-video"
                    src="https://www.youtube.com/embed/ScMzIvxBSi4?autoplay=1&mute=1&loop=1&controls=0&playlist=ScMzIvxBSi4" 
                    title="Game Trailer"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  ></iframe>
                  <div className="crt-glass"></div>
                  <div className="crt-glare"></div>
                  <div className="crt-static"></div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            className="game-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div 
              className="game-modal-content"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <button className="game-modal-close" onClick={() => setIsModalOpen(false)}>
                <FaTimes size={20} />
              </button>
              <iframe 
                src="https://play.unity.com/api/v1/games/game/5b9d3b61-8f55-4209-87c5-d6989ecadd0b/build/latest/frame" 
                className="game-iframe"
                allowFullScreen
              ></iframe>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageWrapper>
  );
}
