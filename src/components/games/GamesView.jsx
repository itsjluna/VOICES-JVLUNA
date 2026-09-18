import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaPlay, FaTint, FaSeedling, FaSun, FaCloud, FaHeart, FaGamepad } from 'react-icons/fa';
import { useLanguage } from '../../contexts/LanguageContext';
import PageWrapper from '../PageWrapper';
import BackButton from '../BackButton';
import './GamesView.css';

const THEMES = [
  { id: 'underwater', name: 'Underwater', icon: FaTint, c1: '#0f2027', c2: '#203a43', c3: '#2c5364', c4: '#00b4db', p1: '#00b4db', p2: '#0f2027' },
  { id: 'blossom', name: 'Blossom', icon: FaSeedling, c1: '#fbc2eb', c2: '#a6c1ee', c3: '#ff9a9e', c4: '#fecfef', p1: '#fbc2eb', p2: '#ff9a9e' },
  { id: 'spring', name: 'Spring Bloom', icon: FaSun, c1: '#56ab2f', c2: '#a8e063', c3: '#d4fc79', c4: '#96e6a1', p1: '#56ab2f', p2: '#96e6a1' },
  { id: 'skydive', name: 'Skydive', icon: FaCloud, c1: '#66a6ff', c2: '#89f7fe', c3: '#a1c4fd', c4: '#c2e9fb', p1: '#66a6ff', p2: '#89f7fe' },
  { id: 'girlypop', name: 'Girlypop', icon: FaHeart, c1: '#ff0844', c2: '#ffb199', c3: '#fbc2eb', c4: '#a6c1ee', p1: '#ff0844', p2: '#ffb199' }
];

const GRAPHICS = [
  { src: 'y2kstar.png', style: { top: '20%', left: '30%', width: '80px', animationDelay: '0s' } },
  { src: 'y2kheart.png', style: { top: '10%', right: '35%', width: '90px', animationDelay: '1s' } },
  { src: 'y2ksphere.png', style: { bottom: '20%', left: '25%', width: '120px', animationDelay: '2s' } },
  { src: 'y2kflower.png', style: { bottom: '30%', right: '20%', width: '100px', animationDelay: '0.5s' } },
  { src: 'y2kstar2.png', style: { top: '40%', right: '5%', width: '70px', animationDelay: '1.5s' } },
  { src: 'y2keart.png', style: { bottom: '15%', right: '40%', width: '85px', animationDelay: '2.5s' } },
  { src: 'y2kclover.png', style: { top: '60%', left: '15%', width: '95px', animationDelay: '0.2s' } },
  { src: 'y2kflag.png', style: { top: '5%', left: '50%', width: '110px', animationDelay: '1.2s' } },
  { src: 'y2kshine.png', style: { bottom: '5%', left: '45%', width: '60px', animationDelay: '0.8s' } }
];

export default function GamesView() {
  const { language } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [themeIdx, setThemeIdx] = useState(0);

  const activeTheme = THEMES[themeIdx];
  const ThemeIcon = activeTheme.icon;

  // Generate randomized razor-thin light rays
  const rapidRays = React.useMemo(() => {
    return Array.from({ length: 6 }).map(() => ({
      top: `${Math.random() * 100}%`,
      duration: `${Math.random() * 6 + 4}s`,
      delay: `${Math.random() * 8}s`,
      rotate: `${Math.random() * -30 - 15}deg`,
      opacity: Math.random() * 0.5 + 0.3
    }));
  }, []);

  // Generate stable bubbles so they don't scramble on re-render
  const aeroBubbles = React.useMemo(() => {
    return Array.from({ length: 15 }).map(() => {
      const size = `${Math.random() * 60 + 20}px`;
      return {
        size,
        left: `${Math.random() * 100}%`,
        duration: `${Math.random() * 10 + 10}s`,
        delay: `-${Math.random() * 10}s`,
        iriRot: `${Math.random() * 360}deg`,
        iriHue: `${Math.random() * 90 - 45}deg`
      };
    });
  }, []);

  const cycleTheme = () => {
    setThemeIdx((prev) => (prev + 1) % THEMES.length);
  };

  return (
    <PageWrapper className="games-page">
      <BackButton />
      <div 
        className="games-wall"
        style={{ 
          '--theme-c1': activeTheme.c1,
          '--theme-c2': activeTheme.c2,
          '--theme-c3': activeTheme.c3,
          '--theme-c4': activeTheme.c4,
          '--theme-p1': activeTheme.p1,
          '--theme-p2': activeTheme.p2
        }}
      >
        <div className="games-fullbleed-bg">
          <div className="mesh-orb orb-1"></div>
          <div className="mesh-orb orb-2"></div>
          <div className="mesh-orb orb-3"></div>
          <div className="aurora-ray ray-1"></div>
          <div className="aurora-ray ray-2"></div>
          <div className="aurora-ray ray-4"></div>

          {rapidRays.map((ray, i) => (
            <div 
              key={`ray-${i}`}
              className="aurora-ray sharp-ray"
              style={{
                top: ray.top,
                animationDuration: ray.duration,
                animationDelay: ray.delay,
                '--ray-rot': ray.rotate,
                '--ray-op': ray.opacity
              }}
            />
          ))}
          <div className="aero-bubbles">
            {aeroBubbles.map((bubble, i) => (
              <div 
                key={`bubble-${i}`}
                className="aero-bubble"
                style={{
                  width: bubble.size,
                  height: bubble.size,
                  left: bubble.left,
                  animationDuration: bubble.duration,
                  animationDelay: bubble.delay,
                  '--iri-rot': bubble.iriRot,
                  '--iri-hue': bubble.iriHue
                }}
              />
            ))}
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
          {GRAPHICS.map((g, i) => (
            <img key={i} src={`/games/graphics/${g.src}`} className="graphic-img" style={g.style} />
          ))}
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
                  {language === "EN" ? "Stealth Collectathon Parody" : "Parodia de Sigilo y Recolección"}
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

              
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageWrapper>
  );
}
