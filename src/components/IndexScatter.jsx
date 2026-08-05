import React, { useMemo, useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import api from '../api';

export const IndexScatter = React.memo(() => {
  const [randomPoemImages, setRandomPoemImages] = useState([]);

  useEffect(() => {
    async function fetchPoems() {
      try {
        const res = await api.get('/poems');
        const poemsWithImages = res.data.filter(p => p.image);
        // Shuffle and pick 2
        const shuffled = poemsWithImages.sort(() => 0.5 - Math.random());
        setRandomPoemImages(shuffled.slice(0, 2).map(p => p.image));
      } catch (err) {
        console.error(err);
      }
    }
    fetchPoems();
  }, []);

  // 1. Index Cards
  const indexCards = useMemo(() => {
    return [...Array(3)].map((_, i) => {
      const top = 10 + (Math.random() * 70); 
      const left = 5 + (Math.random() * 80); 
      const rotate = (Math.random() * 40) - 20; 
      const delay = Math.random() * 0.5;
      
      return (
        <motion.div key={`card-${i}`} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 0.4, scale: 1 }} transition={{ duration: 1.5, delay }}
          drag dragConstraints={{ left: -300, right: 300, top: -300, bottom: 300 }} whileDrag={{ scale: 1.1, opacity: 0.8 }}
          style={{ position: 'absolute', top: `${top}%`, left: `${left}%`, width: '200px', height: '120px', background: '#fff', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', transform: `rotate(${rotate}deg)`, pointerEvents: 'auto', cursor: 'grab', zIndex: 1, borderRadius: '2px', display: 'flex', flexDirection: 'column', padding: '10px' }}>
          <div style={{ borderBottom: '1px solid rgba(255, 0, 0, 0.2)', height: '20px', width: '100%', marginBottom: '5px' }}></div>
          <div style={{ borderBottom: '1px solid rgba(0, 0, 255, 0.1)', height: '15px', width: '100%' }}></div>
          <div style={{ borderBottom: '1px solid rgba(0, 0, 255, 0.1)', height: '15px', width: '100%' }}></div>
          <div style={{ borderBottom: '1px solid rgba(0, 0, 255, 0.1)', height: '15px', width: '100%' }}></div>
          <div style={{ borderBottom: '1px solid rgba(0, 0, 255, 0.1)', height: '15px', width: '100%' }}></div>
          
          {Math.random() > 0.5 && (
            <svg width="20" height="40" style={{ position: 'absolute', top: '-10px', left: '20px', transform: `rotate(${Math.random() * 20 - 10}deg)` }} viewBox="0 0 20 40">
              <path d="M10 35 C5 35 2 32 2 25 L2 10 C2 5 5 2 8 2 C11 2 14 5 14 10 L14 25 C14 28 12 30 10 30 C8 30 6 28 6 25 L6 12" fill="none" stroke="#bdc3c7" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          )}
        </motion.div>
      );
    });
  }, []);

  // 2. Washi Tape
  const washitapes = useMemo(() => {
    const colors = ['rgba(244, 162, 97, 0.2)', 'rgba(42, 157, 143, 0.2)', 'rgba(233, 196, 106, 0.2)', 'rgba(231, 111, 81, 0.2)'];
    return [...Array(3)].map((_, i) => {
      const top = Math.random() * 90;
      const left = i === 0 ? -2 : i === 1 ? 90 : Math.random() * 80;
      const rotate = (Math.random() * 60) - 30;
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      return (
        <motion.div key={`tape-${i}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.5 + Math.random() }}
          style={{ position: 'absolute', top: `${top}%`, left: `${left}%`, width: '120px', height: '35px', background: color, transform: `rotate(${rotate}deg)`, pointerEvents: 'none', zIndex: 5, mixBlendMode: 'multiply' }}>
          <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0 }} preserveAspectRatio="none">
            <path d="M 0 0 L 5 5 L 0 10 L 5 15 L 0 20 L 5 25 L 0 30 L 5 35 L 120 35 L 115 30 L 120 25 L 115 20 L 120 15 L 115 10 L 120 5 L 115 0 Z" fill={color} opacity="0.5"/>
          </svg>
        </motion.div>
      );
    });
  }, []);

  // 3. Coffee Rings & Stains
  const coffeeRings = useMemo(() => {
    return [...Array(4)].map((_, i) => {
      const top = Math.random() * 80;
      const left = Math.random() * 80;
      const size = 150 + Math.random() * 50;
      return (
        <motion.svg key={`coffee-${i}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2, delay: 1 }}
          width={size} height={size} viewBox="0 0 100 100" style={{ position: 'absolute', top: `${top}%`, left: `${left}%`, pointerEvents: 'none', zIndex: 0, opacity: 0.15, mixBlendMode: 'multiply' }}>
          <circle cx="50" cy="50" r="45" fill="none" stroke="#795548" strokeWidth="2" opacity="0.5" />
          <circle cx="52" cy="48" r="45" fill="none" stroke="#6d4c41" strokeWidth="1" opacity="0.3" />
          <path d="M 10 50 A 40 40 0 0 1 50 10" fill="none" stroke="#5d4037" strokeWidth="3" opacity="0.4" />
          <circle cx={Math.random() * 100} cy={Math.random() * 100} r="2" fill="#795548" opacity="0.6" />
          <circle cx={Math.random() * 100} cy={Math.random() * 100} r="3" fill="#795548" opacity="0.4" />
        </motion.svg>
      );
    });
  }, []);

  // 4. Ink Scribbles & Brush Strokes
  const scribbles = useMemo(() => {
    const scribblesList = [...Array(3)].map((_, i) => {
      const top = Math.random() * 90;
      const left = Math.random() * 90;
      return (
        <motion.svg key={`scribble-${i}`} initial={{ opacity: 0 }} animate={{ opacity: 0.15 }} transition={{ duration: 1 }}
          width="100" height="100" viewBox="0 0 100 100" style={{ position: 'absolute', top: `${top}%`, left: `${left}%`, pointerEvents: 'none', zIndex: 0 }}>
          <path d={`M 10 ${Math.random()*90} Q ${Math.random()*100} ${Math.random()*100} 50 ${Math.random()*90} T 90 ${Math.random()*90}`} fill="none" stroke="var(--text-color)" strokeWidth="1" />
          <path d={`M 20 ${Math.random()*90} Q ${Math.random()*100} ${Math.random()*100} 40 ${Math.random()*90} T 80 ${Math.random()*90}`} fill="none" stroke="var(--text-color)" strokeWidth="0.5" />
        </motion.svg>
      );
    });

    const brushes = [...Array(4)].map((_, i) => {
      const top = Math.random() * 90;
      const left = Math.random() * 90;
      const rotate = Math.random() * 360;
      const colors = ['#e74c3c', '#3498db', '#f1c40f', '#2ecc71', '#9b59b6', '#34495e'];
      const color = colors[Math.floor(Math.random() * colors.length)];
      return (
        <motion.svg key={`brush-${i}`} initial={{ opacity: 0 }} animate={{ opacity: 0.2 }} transition={{ duration: 1, delay: 0.5 }}
          width="150" height="50" viewBox="0 0 150 50" style={{ position: 'absolute', top: `${top}%`, left: `${left}%`, transform: `rotate(${rotate}deg)`, pointerEvents: 'none', zIndex: 0, mixBlendMode: 'multiply' }}>
          <path d={`M 10 25 Q 40 ${10 + Math.random()*30} 75 25 T 140 25`} fill="none" stroke={color} strokeWidth={15 + Math.random()*10} strokeLinecap="round" opacity="0.6" style={{ filter: 'blur(1px)' }} />
          <path d={`M 15 25 Q 45 ${15 + Math.random()*20} 75 25 T 135 25`} fill="none" stroke={color} strokeWidth={8 + Math.random()*5} strokeLinecap="round" opacity="0.8" />
        </motion.svg>
      );
    });

    return [...scribblesList, ...brushes];
  }, []);

  // 5. Polaroids (from database)
  const polaroids = useMemo(() => {
    return [...Array(2)].map((_, i) => {
      const top = 20 + Math.random() * 60;
      const left = 10 + Math.random() * 70;
      const rotate = Math.random() * 60 - 30;
      
      return (
        <PolaroidScatter key={`blank-pol-${i}`} top={top} left={left} rotate={rotate} index={i} image={randomPoemImages[i]} />
      );
    });
  }, [randomPoemImages]);

  // 6. User Media Clutter
  const mediaScatter = useMemo(() => {
    const allMedia = [
      '51ylQXnrobL.jpg', '53304_Florence.webp', '61qynEC9FAL._SL1421_.jpg', 
      '71xBLSCGDTL._SL1500_.jpg', '71xEY+ZI8kL.jpg', '81WCblz7GnL._SL1500_.jpg', 
      '9780062641540-xlpreview.jpg', 'OIP (10).webp', 'OIP (6).webp', 
      'OIP (7).webp', 'OIP (8).webp', 'OIP (9).webp', 'R (3).jpg', 
      'Wipeout-2097-PAL-PSX-FRONT.jpg', 'llorona-poster-ok.jpg'
    ];
    // Pick 1 or 2 random media images to scatter
    const shuffled = [...allMedia].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 2);
    
    return selected.map((img, i) => {
      const top = 10 + Math.random() * 70;
      const left = 5 + Math.random() * 80;
      const rotate = Math.random() * 60 - 30;
      const width = 120 + Math.random() * 60; // random width between 120px and 180px

      return (
        <PrismScatter key={`media-${i}`} top={top} left={left} rotate={rotate} width={width} image={`/media/${img}`} />
      );
    });
  }, []);

  // 5. Polaroids (from database) -> Now also PrismScatter
  const polaroids = useMemo(() => {
    return [...Array(2)].map((_, i) => {
      if (!randomPoemImages[i]) return null;
      const top = 20 + Math.random() * 60;
      const left = 10 + Math.random() * 70;
      const rotate = Math.random() * 60 - 30;
      
      return (
        <PrismScatter key={`poem-prism-${i}`} top={top} left={left} rotate={rotate} width={140} image={randomPoemImages[i]} />
      );
    });
  }, [randomPoemImages]);

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
      {coffeeRings}
      {scribbles}
      {indexCards}
      {mediaScatter}
      {polaroids}
      {washitapes}
    </div>
  );
});

function PrismScatter({ top, left, rotate, width, image }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-200, 200], [25, -25]);
  const rotateY = useTransform(x, [-200, 200], [-25, 25]);
  
  // Calculate glare/holographic position based on mouse
  const shineX = useTransform(x, [-200, 200], ['-100%', '100%']);
  const shineY = useTransform(y, [-200, 200], ['-100%', '100%']);

  return (
    <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: 0.2 + Math.random() * 0.5 }}
      drag dragConstraints={{ left: -400, right: 400, top: -400, bottom: 400 }} whileDrag={{ scale: 1.1, zIndex: 100 }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        x.set(e.clientX - rect.left - rect.width / 2);
        y.set(e.clientY - rect.top - rect.height / 2);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      style={{ 
        position: 'absolute', top: `${top}%`, left: `${left}%`, 
        width: `${width}px`, transform: `rotate(${rotate}deg)`, 
        pointerEvents: 'auto', cursor: 'grab', zIndex: 3, 
        rotateX, rotateY, perspective: 1000,
        borderRadius: '12px',
        boxShadow: '0 15px 35px rgba(0,0,0,0.4), 0 5px 15px rgba(0,0,0,0.2)',
      }}>
      
      {/* Thick plastic box container */}
      <div style={{ 
        width: '100%', height: '100%', position: 'relative', overflow: 'hidden', 
        borderRadius: '12px', backgroundColor: '#111',
        boxShadow: 'inset 0 0 0 2px rgba(255,255,255,0.5), inset 0 0 20px rgba(255,255,255,0.4)',
        border: '1px solid rgba(255,255,255,0.8)'
      }}>
        {/* Inner image */}
        <div style={{ padding: '6px', width: '100%', height: '100%', boxSizing: 'border-box' }}>
          <img src={image} alt="prism scatter" draggable="false" style={{ width: '100%', height: '100%', display: 'block', objectFit: 'cover', borderRadius: '6px' }} />
        </div>
        
        {/* Holographic / Glass prism overlay */}
        <motion.div style={{
          position: 'absolute', top: 0, left: 0, width: '200%', height: '200%',
          background: 'linear-gradient(135deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.03) 30%, rgba(255,255,255,0.8) 45%, rgba(255,100,200,0.4) 50%, rgba(100,200,255,0.4) 55%, rgba(255,255,255,0.8) 60%, rgba(255,255,255,0.03) 70%, rgba(255,255,255,0) 100%)',
          mixBlendMode: 'screen',
          x: shineX,
          y: shineY,
          pointerEvents: 'none',
          opacity: 0.9
        }} />
        
        {/* Secondary glare for plastic reflection */}
        <motion.div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          background: 'linear-gradient(to bottom, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 40%)',
          pointerEvents: 'none',
          opacity: 0.5
        }} />
      </div>
    </motion.div>
  );
}
