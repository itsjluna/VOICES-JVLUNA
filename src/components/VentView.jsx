import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api';
import Polaroid from './Polaroid';
import { useReadingProgress } from '../hooks/useReadingProgress';
import { useLanguage } from '../contexts/LanguageContext';

function VentView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vent, setVent] = useState(null);
  const { markAsRead } = useReadingProgress();
  const { language } = useLanguage();

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

  if (!vent) return <div style={{ padding: '2rem' }}>Loading...</div>;

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}
      className={isNotebook ? 'vent-notebook' : 'vent-postit'}
    >
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
        {scatters}
      </div>

      <button style={{ marginBottom: '3rem', border: 'none', padding: '0', textDecoration: 'underline', color: isNotebook ? '#333' : '#fff', position: 'relative', zIndex: 10, alignSelf: 'flex-start' }} onClick={() => navigate(-1)}>
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
          ...(isNotebook ? {} : {
            // Giant Post-it Styling
            backgroundColor: '#fdfd96',
            padding: 'clamp(2rem, 5vw, 4rem) clamp(1.5rem, 5vw, 5vw)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3), inset 0 0 50px rgba(0,0,0,0.02)',
            borderRadius: '2px',
            transform: 'rotate(1deg)',
            color: '#222',
            fontFamily: '"Courier New", Courier, monospace',
          })
        }}
      >
        <div className="editorial-margin left" style={{ color: isNotebook ? '#777' : '#555', left: isNotebook ? '-60px' : '-40px' }}>
          {language === 'EN' ? 'VENT Nº ' : 'DESAHOGO Nº '}{id ? id.slice(-4).toUpperCase() : 'XXXX'}
        </div>

        <h1 style={{ 
          fontSize: '3rem',
          marginBottom: '2rem', 
          borderBottom: isNotebook ? 'none' : '2px solid #555', 
          paddingBottom: isNotebook ? '1rem' : '1rem',
          lineHeight: isNotebook ? '3rem' : '1.2',
          wordWrap: 'break-word',
          overflowWrap: 'break-word',
          wordBreak: 'break-word',
          whiteSpace: 'normal'
        }}>
          {language === 'EN' && vent.titleEn ? vent.titleEn : vent.title}
        </h1>
        
        {vent.image && (
          <div style={{ float: 'right', margin: '0 0 2rem 3vw', transform: `rotate(${Math.random() * 8 - 4}deg)`, maxWidth: '400px', width: '40%' }}>
            <Polaroid src={vent.image} alt={vent.title} />
            {/* Tape */}
            {!isNotebook && <div style={{ position: 'absolute', top: '-15px', left: '50%', transform: 'translateX(-50%) rotate(-5deg)', width: '80px', height: '25px', backgroundColor: 'rgba(255,255,255,0.5)', border: '1px solid rgba(0,0,0,0.05)', backdropFilter: 'blur(2px)' }}></div>}
          </div>
        )}

        <div 
          className="vent-content" 
          dangerouslySetInnerHTML={{ __html: (language === 'EN' && vent.contentEn ? vent.contentEn : vent.content) || '' }} 
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
