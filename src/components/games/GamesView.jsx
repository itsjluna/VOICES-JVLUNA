import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaPlay, FaSlidersH, FaCopy } from 'react-icons/fa';
import { useLanguage } from '../../contexts/LanguageContext';
import PageWrapper from '../PageWrapper';
import BackButton from '../BackButton';
import './GamesView.css';

const THEMES = [
  { id: 'underwater', name: 'Underwater', bg: 'linear-gradient(120deg, #0f2027, #203a43, #2c5364, #00b4db)' },
  { id: 'blossom', name: 'Blossom', bg: 'linear-gradient(120deg, #fbc2eb, #a6c1ee, #ff9a9e, #fecfef)' },
  { id: 'spring', name: 'Spring Bloom', bg: 'linear-gradient(120deg, #a8e063, #56ab2f, #d4fc79, #96e6a1)' },
  { id: 'skydive', name: 'Skydive', bg: 'linear-gradient(120deg, #89f7fe, #66a6ff, #a1c4fd, #c2e9fb)' },
  { id: 'girlypop', name: 'Girlypop', bg: 'linear-gradient(120deg, #ff0844, #ffb199, #fbc2eb, #a6c1ee)' }
];

export default function GamesView() {
  const { language } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [themeIdx, setThemeIdx] = useState(0);

  const activeTheme = THEMES[themeIdx];

  const cycleTheme = () => {
    setThemeIdx((prev) => (prev + 1) % THEMES.length);
  };

  return (
    <PageWrapper>
      <div className="games-fullbleed-bg" style={{ '--active-bg': activeTheme.bg }}>
        {/* Core base gradient */}
        <div className="games-bg-base"></div>
        
        {/* XMB Style 3D Morphing Ribbons/Waves */}
        <div className="xmb-wave xmb-wave-1"></div>
        <div className="xmb-wave xmb-wave-2"></div>
        <div className="xmb-wave xmb-wave-3"></div>
        <div className="xmb-wave xmb-wave-4"></div>
      </div>
      
      <div className="games-wall">
        {/* Theme Cycler */}
        <button className="theme-cycler-btn" onClick={cycleTheme}>
          Theme: {activeTheme.name}
        </button>

        {/* Frutiger Aero Background Elements */}
        <div className="aero-light"></div>
        
        {/* Background Clutter (Skeuomorphic Devices) */}
        <div className="games-clutter">
          <img src="/games/ps2.png" className="clutter-img" style={{ top: '5%', left: '5%', width: '300px', transform: 'rotate(-15deg)', filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.5))' }} />
          <img src="/games/dualshock2.png" className="clutter-img" style={{ bottom: '10%', right: '5%', width: '250px', transform: 'rotate(25deg)', filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.5))' }} />
          <img src="/games/bot-ster.png" className="clutter-img" style={{ bottom: '5%', left: '10%', width: '200px', transform: 'rotate(-5deg)', filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.5))' }} />
          <img src="/games/iphone.png" className="clutter-img" style={{ top: '15%', right: '15%', width: '150px', transform: 'rotate(15deg)', filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.5))' }} />
          <img src="/games/xperiax10.png" className="clutter-img" style={{ top: '50%', left: '2%', width: '120px', transform: 'rotate(-30deg)', filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.5))' }} />
        </div>

        {/* Y2K Graphic Elements */}
        <div className="games-graphics">
          <img src="/games/graphics/y2kstar.png" className="graphic-img" style={{ top: '20%', left: '30%', width: '80px', animationDelay: '0s' }} />
          <img src="/games/graphics/y2kheart.png" className="graphic-img" style={{ top: '10%', right: '35%', width: '90px', animationDelay: '1s' }} />
          <img src="/games/graphics/y2ksphere.png" className="graphic-img" style={{ bottom: '20%', left: '25%', width: '120px', animationDelay: '2s' }} />
          <img src="/games/graphics/y2kflower.png" className="graphic-img" style={{ bottom: '30%', right: '20%', width: '100px', animationDelay: '0.5s' }} />
          <img src="/games/graphics/y2kstar2.png" className="graphic-img" style={{ top: '40%', right: '5%', width: '70px', animationDelay: '1.5s' }} />
          <img src="/games/graphics/y2keart.png" className="graphic-img" style={{ bottom: '15%', right: '40%', width: '85px', animationDelay: '2.5s' }} />
          <img src="/games/graphics/y2kclover.png" className="graphic-img" style={{ top: '60%', left: '15%', width: '95px', animationDelay: '0.2s' }} />
          <img src="/games/graphics/y2kflag.png" className="graphic-img" style={{ top: '5%', left: '50%', width: '110px', animationDelay: '1.2s' }} />
          <img src="/games/graphics/y2kshine.png" className="graphic-img" style={{ bottom: '5%', left: '45%', width: '60px', animationDelay: '0.8s' }} />
        </div>

        <div className="aero-bubbles">
          {Array.from({ length: 15 }).map((_, i) => {
            const size = `${Math.random() * 60 + 20}px`;
            return (
              <div 
                key={i} 
                className="aero-bubble"
                style={{
                  width: size,
                  height: size,
                  left: `${Math.random() * 100}%`,
                  animationDuration: `${Math.random() * 10 + 10}s`,
                  animationDelay: `-${Math.random() * 10}s`
                }}
              ></div>
            );
          })}
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
              JAM-DOG
            </motion.h1>
            
            <motion.h3 
              className="games-genre"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {language === 'EN' ? 'Stealth Collectathon Parody' : 'Parodia de Sigilo y Recolección'}
            </motion.h3>

            <motion.p 
              className="games-desc"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {language === 'EN' 
                ? 'JAM-DOG is a small demo proof of concept of a collectathon genre game about a dog that has to collect the ingredients to make a PB and jelly sandwich without their owner noticing them, inspired and being a parody to metal gear stealth mechanics and made as a college project.'
                : 'JAM-DOG es una pequeña demo prueba de concepto de un juego del género collectathon sobre un perro que tiene que recolectar los ingredientes para hacer un sándwich de mantequilla de maní y mermelada sin que su dueño lo note, inspirado y siendo una parodia de las mecánicas de sigilo de Metal Gear, hecho como proyecto universitario.'}
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

          <div className="imac-container">
            <motion.div 
              className="imac-wrapper"
              initial={{ opacity: 0, rotateY: 30, scale: 0.8 }}
              animate={{ opacity: 1, rotateY: 0, scale: 1 }}
              transition={{ duration: 1, type: "spring" }}
            >
              {/* Fallback box if imacg3.png is missing. Add your PNG to public/imacg3.png! */}
              <div className="imac-image-placeholder">
                <img 
                  src="/games/imacg3.png" 
                  alt="iMac G3" 
                  className="imac-image"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.classList.add('missing-img');
                  }}
                />
              </div>

              <div className="imac-screen">
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
