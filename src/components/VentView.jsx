import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api';
import Polaroid from './Polaroid';
import Sticker from './Sticker';
import { useReadingProgress } from '../hooks/useReadingProgress';
import { useLanguage } from '../contexts/LanguageContext';
import { FaLanguage } from 'react-icons/fa';
import TypewriterLoader from './TypewriterLoader';

function VentView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vent, setVent] = useState(null);
  const { markAsRead } = useReadingProgress();
  const { language } = useLanguage();
  const [ventLanguage, setVentLanguage] = useState(language);

  // Sync ventLanguage with global language when global language changes
  useEffect(() => {
    setVentLanguage(language);
  }, [language]);

  const handleBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate('/index');
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await api.get('/chapters');
        const found = res.data.find(c => c._id === id && c.isVent);
        setVent(found);
      } catch (err) {
        console.error(err);
      }
      if (id) markAsRead(id);
    }
    fetchData();
  }, [id]);

  const isNotebook = vent?.theme !== 'postits';

  // STICKERS GENERATION
  const stickerImages = ['bee.png', 'cat.png', 'cat2.png', 'flower.png', 'flower2.png', 'flower3.png', 'flower4.png', 'jjk.png', 'pig.png', 'lightpole.png', 'swing.png', 'whale.png'];
  const generatedStickers = useMemo(() => {
    const count = Math.floor(Math.random() * 4) + 3; // 3 to 6 stickers
    const items = [];
    const available = [...stickerImages];
    
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    
    // Define available placement slots to prevent clumping
    const availableSlots = [
      { region: 0, sub: 'left' },
      { region: 0, sub: 'right' },
      ...(isMobile ? [] : [
        { region: 1, sub: 'left' }, 
        { region: 1, sub: 'center' }, 
        { region: 1, sub: 'right' }
      ]),
      { region: 2, sub: 'top' },
      { region: 2, sub: 'bottom' },
      { region: 3, sub: 'top' },
      { region: 3, sub: 'bottom' }
    ];
    
    // Shuffle slots so placement is random but uniformly distributed
    availableSlots.sort(() => Math.random() - 0.5);

    for (let i = 0; i < count; i++) {
      if (available.length === 0 || availableSlots.length === 0) break;
      const idx = Math.floor(Math.random() * available.length);
      const img = available.splice(idx, 1)[0];
      const slot = availableSlots.pop();
      
      let topPos = 'auto', bottomPos = 'auto', leftPos = 'auto', rightPos = 'auto';
      const stickerWidth = Math.random() * 40 + 60; // 60 to 100px
      
      if (slot.region === 0) { // Top
        topPos = `-${Math.random() * 20 + 30}px`;
        leftPos = slot.sub === 'left' ? `${Math.random() * 10 - 5}%` : `${Math.random() * 10 + 85}%`;
      } else if (slot.region === 1) { // Bottom
        bottomPos = `-${Math.random() * 15 + 20}px`;
        if (slot.sub === 'left') leftPos = `${Math.random() * 15 + 10}%`;
        else if (slot.sub === 'center') leftPos = `${Math.random() * 20 + 40}%`;
        else leftPos = `${Math.random() * 15 + 70}%`;
      } else if (slot.region === 2) { // Left
        topPos = slot.sub === 'top' ? `${Math.random() * 20 + 20}%` : `${Math.random() * 20 + 60}%`;
        leftPos = `-${Math.random() * 20 + (isMobile ? stickerWidth - 20 : 40)}px`;
      } else { // Right
        topPos = slot.sub === 'top' ? `${Math.random() * 20 + 20}%` : `${Math.random() * 20 + 60}%`;
        rightPos = `-${Math.random() * 20 + (isMobile ? stickerWidth - 20 : 40)}px`;
      }
      
      items.push({
        id: `sticker-${i}`,
        src: `/sticker/${img}`,
        top: topPos,
        bottom: bottomPos,
        left: leftPos,
        right: rightPos,
        rotate: Math.random() * 60 - 30,
        width: `${stickerWidth}px`
      });
    }
    return items;
  }, []);

  // SCATTER GENERATION
  const scatters = useMemo(() => {
    return [...Array(isNotebook ? 12 : 25)].map((_, i) => {
      const top = `${Math.random() * 95}%`;
      const left = `${Math.random() * 95}%`;
      const rotation = Math.random() * 360;

      if (isNotebook) {
        // Notebook Scatters: Ink Blots, Paperclips, Torn Paper, Masking Tape, Staples, Pencil
        const type = Math.random();
        if (type > 0.85) {
          // Paperclip
          return (
            <motion.svg 
              key={i} 
              viewBox="0 0 120 200" 
              style={{ position: 'absolute', top, left, width: '30px', height: '60px', zIndex: 0, filter: 'drop-shadow(2px 4px 3px rgba(0,0,0,0.2))' }}
              initial={{ opacity: 0, rotate: rotation, y: 0 }}
              animate={{ opacity: 0.6, rotate: [rotation, rotation + 8, rotation], y: [0, -15, 0] }}
              transition={{ opacity: { duration: 1 }, y: { duration: Math.random() * 5 + 5, repeat: Infinity, ease: 'easeInOut' }, rotate: { duration: Math.random() * 5 + 5, repeat: Infinity, ease: 'easeInOut' } }}
            >
              <path d="M45,45 L45,150 A15,15 0 0,0 75,150 L75,30 A25,25 0 0,0 25,30 L25,160 A35,35 0 0,0 95,160 L95,55" fill="none" stroke="#bdc3c7" strokeWidth="8" strokeLinecap="round" />
            </motion.svg>
          );
        } else if (type > 0.7) {
          // Masking Tape
          return (
            <motion.div 
              key={i} 
              style={{ position: 'absolute', top, left, width: `${Math.random() * 60 + 60}px`, height: '25px', backgroundColor: '#e2d5a3', zIndex: 0, boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}
              initial={{ opacity: 0, rotate: rotation }}
              animate={{ opacity: 0.6, rotate: [rotation, rotation + 2, rotation] }}
              transition={{ opacity: { duration: 1 }, rotate: { duration: Math.random() * 6 + 4, repeat: Infinity, ease: 'easeInOut' } }}
            ></motion.div>
          );
        } else if (type > 0.5) {
          // Torn Paper Scrap
          return (
            <motion.svg 
              key={i} 
              viewBox="0 0 100 100" 
              style={{ position: 'absolute', top, left, width: `${Math.random() * 40 + 40}px`, height: `${Math.random() * 40 + 40}px`, zIndex: 0, filter: 'drop-shadow(2px 4px 3px rgba(0,0,0,0.15))' }}
              initial={{ opacity: 0, rotate: rotation, y: 0 }}
              animate={{ opacity: 0.9, rotate: [rotation, rotation - 5, rotation], y: [0, -10, 0] }}
              transition={{ opacity: { duration: 1 }, y: { duration: Math.random() * 5 + 5, repeat: Infinity, ease: 'easeInOut' }, rotate: { duration: Math.random() * 5 + 5, repeat: Infinity, ease: 'easeInOut' } }}
            >
              <polygon points="5,5 25,0 45,10 65,0 85,15 100,5 95,45 100,85 75,100 50,90 25,100 0,95 5,50" fill="#fdfdf8" />
            </motion.svg>
          );
        } else if (type > 0.35) {
          // Pencil Scribble
          return (
            <motion.svg 
              key={i} 
              viewBox="0 0 100 100" 
              style={{ position: 'absolute', top, left, width: '60px', height: '60px', zIndex: 0 }}
              initial={{ opacity: 0, rotate: rotation }}
              animate={{ opacity: 0.4, rotate: [rotation, rotation + 5, rotation] }}
              transition={{ opacity: { duration: 1 }, rotate: { duration: Math.random() * 5 + 5, repeat: Infinity, ease: 'easeInOut' } }}
            >
              <path d="M10,20 Q30,0 40,40 T70,20 T90,80 T50,60 T10,90" fill="none" stroke="#444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </motion.svg>
          );
        } else if (type > 0.2) {
          // Staple
          return (
            <motion.svg 
              key={i} 
              viewBox="0 0 40 20" 
              style={{ position: 'absolute', top, left, width: '30px', height: '15px', zIndex: 0, filter: 'drop-shadow(1px 2px 1px rgba(0,0,0,0.3))' }}
              initial={{ opacity: 0, rotate: rotation }}
              animate={{ opacity: 0.8, rotate: [rotation, rotation + 2, rotation] }}
              transition={{ opacity: { duration: 1 }, rotate: { duration: Math.random() * 5 + 5, repeat: Infinity, ease: 'easeInOut' } }}
            >
              <path d="M5,15 L5,5 L35,5 L35,15" fill="none" stroke="#88929b" strokeWidth="3" strokeLinecap="square" />
            </motion.svg>
          );
        } else {
          // Ink blot
          const opacity = Math.random() * 0.4 + 0.2;
          return (
            <motion.div 
              key={i} 
              style={{ position: 'absolute', top, left, width: `${Math.random() * 20 + 5}px`, height: `${Math.random() * 20 + 5}px`, backgroundColor: '#111', borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%', filter: 'blur(0.5px)' }}
              initial={{ opacity: 0, rotate: rotation, scale: 0.8 }}
              animate={{ opacity: [opacity, opacity + 0.2, opacity], scale: [0.8, 1, 0.8] }}
              transition={{ duration: Math.random() * 5 + 4, repeat: Infinity, ease: 'easeInOut' }}
            ></motion.div>
          );
        }
      } else {
        // Post-its Scatters: Background scattered sticky notes
        const colors = ['#ffb7b2', '#c1e1c1', '#b5ead7', '#e2f0cb', '#fdfd96', '#ffdac1'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        const size = Math.random() * 100 + 80; // 80px to 180px
        const rot = Math.random() * 60 - 30;
        return (
          <motion.div 
            key={i} 
            style={{
              position: 'absolute',
              top, left,
              width: `${size}px`, height: `${size}px`,
              backgroundColor: color,
              boxShadow: '2px 4px 10px rgba(0,0,0,0.15)',
              zIndex: 0,
              display: 'flex', justifyContent: 'center', alignItems: 'center'
            }}
            initial={{ opacity: 0, rotate: rot, y: 0 }}
            animate={{ opacity: 0.9, rotate: [rot, rot + (Math.random() * 10 - 5), rot], y: [0, Math.random() * -30 - 10, 0] }}
            transition={{ opacity: { duration: 1 }, rotate: { duration: Math.random() * 8 + 6, repeat: Infinity, ease: 'easeInOut' }, y: { duration: Math.random() * 8 + 6, repeat: Infinity, ease: 'easeInOut' } }}
          >
            {/* Random scribbles on background post-its */}
            {Math.random() > 0.5 && (
              <svg width="60%" height="60%" viewBox="0 0 100 100" opacity="0.3">
                <path d={`M10,${Math.random()*20+20} Q30,${Math.random()*40} 50,${Math.random()*20+20} T90,${Math.random()*20+40} M10,${Math.random()*20+60} Q40,${Math.random()*20+80} 80,${Math.random()*20+60}`} fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" />
              </svg>
            )}
          </motion.div>
        );
      }
    });
  }, [isNotebook]);

  if (!vent) return <TypewriterLoader text={language === 'EN' ? 'Opening vent...' : 'Abriendo desahogo...'} />;

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.15 } }} transition={{ duration: 0.8 }}
      className={isNotebook ? 'vent-notebook' : 'vent-postit'}
    >
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
        {scatters}
      </div>

      <button className="back-button" style={{ marginBottom: '3rem', alignSelf: 'flex-start' }} onClick={handleBack}>
        &larr; {language === 'EN' ? 'Back' : 'Volver'}
      </button>

      {/* Main Content Container */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
        style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          maxWidth: isNotebook ? '1200px' : '900px',
          ...(isNotebook ? {
            marginTop: '3rem',
            padding: 'clamp(2rem, 5vw, 4rem) clamp(0.75rem, 3vw, 5vw)',
          } : {
            // Giant Post-it Styling
            backgroundColor: '#fdfd96',
            padding: 'clamp(2rem, 5vw, 4rem) clamp(0.75rem, 3vw, 5vw)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3), inset 0 0 50px rgba(0,0,0,0.02)',
            borderRadius: '2px',
            transform: 'rotate(1deg)',
            color: '#222',
            fontFamily: '"Courier New", Courier, monospace',
          })
        }}
      >
        {/* Render Stickers */}
        {generatedStickers.map(sticker => (
          <Sticker
            key={sticker.id}
            src={sticker.src}
            style={{
              top: sticker.top,
              bottom: sticker.bottom,
              left: sticker.left,
              right: sticker.right,
              width: sticker.width,
              transform: `rotate(${sticker.rotate}deg)`,
              zIndex: 20
            }}
          />
        ))}

        <div className="editorial-margin left" style={{ color: isNotebook ? '#777' : '#555', left: isNotebook ? '-60px' : '-40px' }}>
          {language === 'EN' ? 'VENT Nº ' : 'DESAHOGO Nº '}{id ? id.slice(-4).toUpperCase() : 'XXXX'}
        </div>

        <div className="entry-header">
          <h1 style={{ 
            fontFamily: isNotebook ? '"Permanent Marker", cursive' : '"Reenie Beanie", cursive',
            fontSize: isNotebook ? 'clamp(1.8rem, 8vw, 2.5rem)' : 'clamp(2rem, 10vw, 3rem)',
            color: isNotebook ? '#111' : '#222',
            margin: 0,
            wordBreak: 'break-word',
            whiteSpace: 'normal'
          }}>
            {ventLanguage === 'EN' && vent.titleEn ? vent.titleEn : vent.title}
          </h1>
          <button 
            onClick={() => setVentLanguage(prev => prev === 'EN' ? 'ES' : 'EN')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'transparent',
              border: `1px solid ${isNotebook ? '#333' : '#333'}`,
              color: isNotebook ? '#333' : '#333',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              cursor: 'pointer',
              fontFamily: 'monospace',
              fontSize: '0.9rem',
              opacity: 0.8
            }}
          >
            <FaLanguage size={16} />
            {ventLanguage === 'EN' ? 'EN' : 'ES'}
          </button>
        </div>
        
        {vent.image && (
          <div className="vent-image" style={{ transform: `rotate(${Math.random() * 8 - 4}deg)` }}>
            <Polaroid src={vent.image} alt={vent.title} credit={vent.imageCredit} />
            {/* Tape */}
            {!isNotebook && <div style={{ position: 'absolute', top: '-15px', left: '50%', transform: 'translateX(-50%) rotate(-5deg)', width: '80px', height: '25px', backgroundColor: 'rgba(255,255,255,0.5)', border: '1px solid rgba(0,0,0,0.05)', backdropFilter: 'blur(2px)' }}></div>}
          </div>
        )}

        <div 
          className="vent-content" 
          dangerouslySetInnerHTML={{ __html: (ventLanguage === 'EN' && vent.contentEn ? vent.contentEn : vent.content) || '' }} 
          style={{ 
            fontSize: '1.2rem',
            lineHeight: isNotebook ? '2rem' : '1.8',
            fontWeight: isNotebook ? '400' : '500',
            wordWrap: 'break-word',
            overflowWrap: 'break-word',
            wordBreak: 'break-word'
          }} 
        />
        
        <div style={{ clear: 'both' }}></div>
      </motion.div>
    </motion.div>
  );
}

export default VentView;
