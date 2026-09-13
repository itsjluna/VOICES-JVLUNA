import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaPlay, FaSlidersH, FaCopy, FaTint, FaSeedling, FaSun, FaCloud, FaHeart, FaGamepad } from 'react-icons/fa';
import { useLanguage } from '../../contexts/LanguageContext';
import PageWrapper from '../PageWrapper';
import BackButton from '../BackButton';
import './GamesView.css';

const THEMES = [
  { id: 'underwater', name: 'Underwater', icon: FaTint, bg: 'linear-gradient(-45deg, #0f2027, #203a43, #2c5364, #00b4db)', p1: '#00b4db', p2: '#0f2027' },
  { id: 'blossom', name: 'Blossom', icon: FaSeedling, bg: 'linear-gradient(-45deg, #fbc2eb, #a6c1ee, #ff9a9e, #fecfef)', p1: '#fbc2eb', p2: '#ff9a9e' },
  { id: 'spring', name: 'Spring Bloom', icon: FaSun, bg: 'linear-gradient(-45deg, #a8e063, #56ab2f, #d4fc79, #96e6a1)', p1: '#56ab2f', p2: '#96e6a1' },
  { id: 'skydive', name: 'Skydive', icon: FaCloud, bg: 'linear-gradient(-45deg, #89f7fe, #66a6ff, #a1c4fd, #c2e9fb)', p1: '#66a6ff', p2: '#89f7fe' },
  { id: 'girlypop', name: 'Girlypop', icon: FaHeart, bg: 'linear-gradient(-45deg, #ff0844, #ffb199, #fbc2eb, #a6c1ee)', p1: '#ff0844', p2: '#ffb199' }
];

export default function GamesView() {
  const { language } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [themeIdx, setThemeIdx] = useState(0);

  const activeTheme = THEMES[themeIdx];
  const ThemeIcon = activeTheme.icon;

  const cycleTheme = () => {
    setThemeIdx((prev) => (prev + 1) % THEMES.length);
  };

  return (
    <PageWrapper>
      <div 
        className="games-wall"
        style={{ 
          '--active-bg': activeTheme.bg,
          '--theme-p1': activeTheme.p1,
          '--theme-p2': activeTheme.p2
        }}
      >
        <div className="games-fullbleed-bg">
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
                    animationDelay: `-${Math.random() * 10}s`,
                    '--iri-rot': `${Math.random() * 360}deg`,
                    '--iri-hue': `${Math.random() * 90 - 45}deg`
                  }}
                ></div>
              );
            })}
          </div>
        </div>

        {/* Theme Cycler */}
        <button 
          className="theme-cycler-btn frutiger-button" 
          onClick={cycleTheme}
          style={{ '--theme-p1': activeTheme.p1, '--theme-p2': activeTheme.p2 }}
        >
          <ThemeIcon className="theme-icon" /> 
          <span className="theme-text">Vibe: {activeTheme.name}</span>
        </button>

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



        <div style={{ position: 'absolute', top: '2rem', left: '2rem', zIndex: 100 }}>
          <BackButton />
        </div>

        <div className="games-container">
          <div className="games-info">
            <div className="games-text-content">
              <motion.h1 
                className="games-title"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                JAM-DOG
              </motion.h1>
              
              <motion.div 
                className="games-desc"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <div className="games-genre-tag">
                  <FaGamepad style={{ marginRight: '0.5rem', fontSize: '1.1em', verticalAlign: 'text-bottom' }} />
                  {language === 'EN' ? 'Stealth Collectathon Parody' : 'Parodia de Sigilo y Recolección'}
                </div>
                  <p>
                    {language === 'EN' 
                      ? "JAM-DOG is a small proof-of-concept collectathon demo about a dog who has to collect the ingredients to make a peanut butter and jelly sandwich without his owner noticing, inspired by and acting as a parody of Metal Gear's stealth mechanics."
                      : "JAM-DOG es una pequeña demo de prueba de concepto del genero collectathon sobre un perro que tiene que recolectar los ingredientes para hacer un sandwich de mantequilla de mani y mermelada sin que su dueño lo note, inspirado y siendo una parodia de las mecanicas de sigilo de Metal Gear."}
                  </p>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <button 
                className="games-play-btn desktop-play-btn frutiger-button"
                onClick={() => setIsModalOpen(true)}
              >
                <FaPlay style={{ fontSize: '0.9em' }} /> {language === 'EN' ? 'Play Now' : 'Jugar Ahora'}
              </button>

              <a 
                href="https://play.unity.com/en/games/5b9d3b61-8f55-4209-87c5-d6989ecadd0b/jam-dog"
                target="_blank"
                rel="noreferrer"
                className="games-play-btn mobile-play-btn frutiger-button"
                style={{ textDecoration: 'none' }}
              >
                <FaPlay style={{ fontSize: '0.9em' }} /> {language === 'EN' ? 'Go to Unity' : 'Ir a Unity'}
              </a>
            </motion.div>
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
                  src="https://www.youtube.com/embed/YYUzG0kSPNc?autoplay=1&mute=1&loop=1&controls=0&playlist=YYUzG0kSPNc" 
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
            style={{ 
              '--theme-p1': activeTheme.p1,
              '--theme-p2': activeTheme.p2
            }}
          >
            <motion.div 
              className="game-modal-content"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <button className="game-modal-close frutiger-button circle" onClick={() => setIsModalOpen(false)}>
                <FaTimes size={20} color="#ffffff" style={{ display: 'block' }} />
              </button>
              
              <div className="game-iframe-wrapper">
                <iframe 
                  className="game-iframe"
                  src="https://play.unity.com/api/v1/games/game/5b9d3b61-8f55-4209-87c5-d6989ecadd0b/build/latest/frame" 
                  title="JAM-DOG"
                  frameBorder="0"
                  allow="autoplay; fullscreen; encrypted-media"
                ></iframe>
              </div>

              {/* Virtual Controllers for Mobile */}
              <div className="mobile-virtual-controllers">
                <div className="d-pad">
                  <motion.button className="d-pad-btn up" whileTap={{ scale: 0.8, filter: 'brightness(1.5)' }}></motion.button>
                  <motion.button className="d-pad-btn right" whileTap={{ scale: 0.8, filter: 'brightness(1.5)' }}></motion.button>
                  <motion.button className="d-pad-btn down" whileTap={{ scale: 0.8, filter: 'brightness(1.5)' }}></motion.button>
                  <motion.button className="d-pad-btn left" whileTap={{ scale: 0.8, filter: 'brightness(1.5)' }}></motion.button>
                  <div className="d-pad-center"></div>
                </div>
                <div className="action-buttons">
                  <motion.button className="action-btn y frutiger-button circle" whileTap={{ scale: 0.8, filter: 'brightness(1.5)' }}>Y</motion.button>
                  <motion.button className="action-btn x frutiger-button circle" whileTap={{ scale: 0.8, filter: 'brightness(1.5)' }}>X</motion.button>
                  <motion.button className="action-btn b frutiger-button circle" whileTap={{ scale: 0.8, filter: 'brightness(1.5)' }}>B</motion.button>
                  <motion.button className="action-btn a frutiger-button circle" whileTap={{ scale: 0.8, filter: 'brightness(1.5)' }}>A</motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageWrapper>
  );
}
