import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api';
import Polaroid from './Polaroid';

function VentView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vent, setVent] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await api.get('/chapters');
        const found = res.data.find(c => c._id === id && c.isVent);
        setVent(found);
      } catch (err) {
        console.error(err);
      }
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
        // Notebook Scatters: Ink Blots, Coffee Rings, Paperclips
        const type = Math.random();
        if (type > 0.7) {
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
        } else if (type > 0.4) {
          // Coffee Ring
          const scale = Math.random() * 0.5 + 0.8;
          return (
            <motion.div 
              key={i} 
              style={{ position: 'absolute', top, left, width: '120px', height: '120px', borderRadius: '50%', border: '4px solid #6b4c3a', filter: 'blur(1px)' }}
              initial={{ opacity: 0, scale, rotate: rotation }}
              animate={{ opacity: 0.15, scale: [scale, scale + 0.05, scale] }}
              transition={{ opacity: { duration: 1 }, scale: { duration: Math.random() * 6 + 4, repeat: Infinity, ease: 'easeInOut' } }}
            >
               <div style={{ position: 'absolute', top: '-2px', left: '-2px', width: '100%', height: '100%', borderRadius: '50%', border: '2px solid #5a3c2a', opacity: 0.5 }}></div>
            </motion.div>
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
        &larr; Back
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
            padding: '4rem 5vw',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3), inset 0 0 50px rgba(0,0,0,0.02)',
            borderRadius: '2px',
            transform: 'rotate(1deg)',
            color: '#222',
            fontFamily: '"Courier New", Courier, monospace',
          })
        }}
      >
        <div className="editorial-margin left" style={{ color: isNotebook ? '#777' : '#555', left: isNotebook ? '-60px' : '-40px' }}>
          VENT Nº {id ? id.slice(-4).toUpperCase() : 'XXXX'}
        </div>

        <h1 style={{ 
          fontSize: '3rem', // Replaced clamp
          marginBottom: '3rem', 
          borderBottom: isNotebook ? 'none' : '2px solid #555', 
          paddingBottom: '1rem',
          lineHeight: '1.2'
        }}>
          {vent.title}
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
          dangerouslySetInnerHTML={{ __html: vent.content || '' }} 
          style={{ 
            fontSize: '1.2rem', // Replaced clamp
            lineHeight: isNotebook ? '2rem' : '1.8',
            fontWeight: isNotebook ? '400' : '500'
          }} 
        />
        
        <div style={{ clear: 'both' }}></div>
      </motion.div>
    </motion.div>
  );
}

export default VentView;
