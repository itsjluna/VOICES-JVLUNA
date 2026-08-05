import React, { useMemo, useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import api from '../api';

export const IndexScatter = React.memo(() => {
  const [randomImages, setRandomImages] = useState([]);

  useEffect(() => {
    async function fetchImages() {
      try {
        const [poemsRes, chaptersRes] = await Promise.all([
          api.get('/poems'),
          api.get('/chapters')
        ]);
        
        const poemImages = poemsRes.data.filter(p => p.image).map(p => p.image);
        const chapterImages = chaptersRes.data.filter(c => c.image).map(c => c.image);
        
        const allImages = [...poemImages, ...chapterImages];
        const shuffled = allImages.sort(() => 0.5 - Math.random());
        const count = 5 + Math.floor(Math.random() * 2); // 5 or 6
        setRandomImages(shuffled.slice(0, count));
      } catch (err) {
        console.error(err);
      }
    }
    fetchImages();
  }, []);

  const [positions] = useState(() => {
    return [...Array(20)].map(() => ({
      top: Math.random() * 90,
      left: Math.random() * 90,
      rotate: Math.random() * 60 - 30,
    }));
  });

  const polaroids = useMemo(() => {
    return randomImages.map((image, i) => {
      const pos = positions[i] || positions[0];
      return (
        <PolaroidScatter key={`polaroid-${i}`} top={pos.top} left={pos.left} rotate={pos.rotate} index={i} image={image} />
      );
    });
  }, [randomImages, positions]);

  const coffeeRings = useMemo(() => {
    return [...Array(2)].map((_, i) => {
      const pos = positions[i + 5] || positions[1];
      const top = pos.top;
      const left = pos.left;
      const size = 150 + Math.random() * 50;
      return (
        <motion.svg key={`coffee-${i}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2, delay: 1 }}
          drag dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }} dragElastic={0.2} whileDrag={{ scale: 1.05, cursor: 'grabbing' }}
          width={size} height={size} viewBox="0 0 100 100" style={{ position: 'absolute', top: `${top}%`, left: `${left}%`, cursor: 'grab', zIndex: 0, opacity: 0.15, mixBlendMode: 'multiply', pointerEvents: 'auto', touchAction: 'none' }}>
          <circle cx="50" cy="50" r="45" fill="none" stroke="#795548" strokeWidth="2" opacity="0.5" />
          <circle cx="52" cy="48" r="45" fill="none" stroke="#6d4c41" strokeWidth="1" opacity="0.3" />
          <path d="M 10 50 A 40 40 0 0 1 50 10" fill="none" stroke="#5d4037" strokeWidth="3" opacity="0.4" />
          <circle cx={Math.random() * 100} cy={Math.random() * 100} r="2" fill="#795548" opacity="0.6" />
          <circle cx={Math.random() * 100} cy={Math.random() * 100} r="3" fill="#795548" opacity="0.4" />
        </motion.svg>
      );
    });
  }, [positions]);

  const scribbles = useMemo(() => {
    return [...Array(3)].map((_, i) => {
      const pos = positions[i + 7] || positions[2];
      const top = pos.top;
      const left = pos.left;
      const rotate = pos.rotate * 6;
      const paths = [
        "M 10 50 Q 25 10, 50 50 T 90 50",
        "M 20 20 Q 80 20, 50 50 T 80 80",
        "M 10 80 C 40 10, 60 90, 90 20"
      ];
      const pathData = paths[i % paths.length];
      const strokeColor = i % 2 === 0 ? '#777' : '#5D8AA8'; // softened scribbles
      return (
        <motion.svg key={`scribble-${i}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5, delay: 0.5 + Math.random() }}
          drag dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }} dragElastic={0.2} whileDrag={{ scale: 1.05, cursor: 'grabbing' }}
          width="100" height="100" viewBox="0 0 100 100" style={{ position: 'absolute', top: `${top}%`, left: `${left}%`, transform: `rotate(${rotate}deg)`, cursor: 'grab', zIndex: 1, opacity: 0.3, pointerEvents: 'auto', touchAction: 'none' }}>
          <path d={pathData} fill="none" stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" />
        </motion.svg>
      );
    });
  }, [positions]);

  const paperClips = useMemo(() => {
    return [...Array(2)].map((_, i) => {
      const pos = positions[i + 2] || positions[3];
      const top = pos.top;
      const left = pos.left;
      const rotate = pos.rotate * 6;
      return (
        <motion.svg key={`clip-${i}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5, delay: 0.8 }}
          drag dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }} dragElastic={0.2} whileDrag={{ scale: 1.05, cursor: 'grabbing' }}
          width="35" height="70" viewBox="0 0 120 200" style={{ position: 'absolute', top: `${top}%`, left: `${left}%`, transform: `rotate(${rotate}deg)`, cursor: 'grab', zIndex: 3, opacity: 0.8, filter: 'drop-shadow(2px 4px 3px rgba(0,0,0,0.3))', pointerEvents: 'auto', touchAction: 'none' }}>
          <path d="M45,45 L45,150 A15,15 0 0,0 75,150 L75,30 A25,25 0 0,0 25,30 L25,160 A35,35 0 0,0 95,160 L95,55" fill="none" stroke="#bdc3c7" strokeWidth="8" strokeLinecap="round" />
          <path d="M45,45 L45,150 A15,15 0 0,0 75,150 L75,30 A25,25 0 0,0 25,30 L25,160 A35,35 0 0,0 95,160 L95,55" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" opacity="0.5" transform="translate(-1, -1)" />
        </motion.svg>
      );
    });
  }, [positions]);

  const washitapes = useMemo(() => {
    return [...Array(2)].map((_, i) => {
      const pos = positions[i + 4] || positions[4];
      const top = pos.top;
      const left = pos.left;
      const rotate = pos.rotate;
      const colors = ['rgba(253, 253, 150, 0.6)', 'rgba(255, 183, 178, 0.6)', 'rgba(193, 225, 193, 0.6)', 'rgba(181, 234, 215, 0.6)']; // post-it pastel colors
      const bg = colors[Math.floor(Math.random() * colors.length)];
      return (
        <motion.div key={`washi-${i}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.2 }}
          drag dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }} dragElastic={0.2} whileDrag={{ scale: 1.05, cursor: 'grabbing' }}
          style={{ position: 'absolute', top: `${top}%`, left: `${left}%`, width: '120px', height: '25px', backgroundColor: bg, transform: `rotate(${rotate}deg)`, zIndex: 5, cursor: 'grab', backdropFilter: 'blur(2px)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', pointerEvents: 'auto', touchAction: 'none' }} />
      );
    });
  }, [positions]);

  const indexCards = useMemo(() => {
    return [...Array(1)].map((_, i) => {
      const pos = positions[i + 1] || positions[5];
      const top = pos.top;
      const left = pos.left;
      const rotate = pos.rotate / 3;
      return (
        <motion.div key={`indexcard-${i}`} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.5, delay: 0.3 }}
          drag dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }} dragElastic={0.2} whileDrag={{ scale: 1.05, cursor: 'grabbing' }}
          style={{ position: 'absolute', top: `${top}%`, left: `${left}%`, width: '200px', height: '140px', backgroundColor: '#fcfcfc', borderTop: '30px solid #e08b8b', boxShadow: '0 4px 15px rgba(0,0,0,0.08)', transform: `rotate(${rotate}deg)`, cursor: 'grab', zIndex: 1, backgroundImage: 'repeating-linear-gradient(transparent, transparent 19px, #e0e0e0 20px)', pointerEvents: 'auto', touchAction: 'none' }} />
      );
    });
  }, [positions]);

  const postIts = useMemo(() => {
    return [...Array(2)].map((_, i) => {
      const pos = positions[i + 10] || positions[6];
      const top = pos.top;
      const left = pos.left;
      const rotate = pos.rotate;
      const colors = ['#fdfd96', '#ffb7b2', '#c1e1c1', '#b5ead7', '#e2f0cb'];
      const bg = colors[i % colors.length];
      return (
        <motion.div key={`postit-${i}`} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.5, delay: 0.4 }}
          drag dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }} dragElastic={0.2} whileDrag={{ scale: 1.05, cursor: 'grabbing' }}
          style={{ position: 'absolute', top: `${top}%`, left: `${left}%`, width: '100px', height: '100px', backgroundColor: bg, boxShadow: '2px 5px 10px rgba(0,0,0,0.15)', transform: `rotate(${rotate}deg)`, cursor: 'grab', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '"Reenie Beanie", cursive', fontSize: '1.2rem', color: 'rgba(0,0,0,0.6)', padding: '10px', textAlign: 'center', pointerEvents: 'auto', touchAction: 'none' }}>
          {i === 0 ? "read me" : "don't forget"}
        </motion.div>
      );
    });
  }, [positions]);

  const tickets = useMemo(() => {
    return [...Array(2)].map((_, i) => {
      const pos = positions[i + 12] || positions[7];
      const top = pos.top;
      const left = pos.left;
      const rotate = pos.rotate;
      const colors = ['#e63946', '#2a9d8f', '#e9c46a', '#f4a261', '#8ecae6'];
      const bg = colors[i % colors.length];
      return (
        <motion.div key={`ticket-${i}`} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.5, delay: 0.6 }}
          drag dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }} dragElastic={0.2} whileDrag={{ scale: 1.05, cursor: 'grabbing' }}
          style={{ position: 'absolute', top: `${top}%`, left: `${left}%`, width: '160px', height: '60px', backgroundColor: '#fafafa', borderLeft: `8px solid ${bg}`, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', transform: `rotate(${rotate}deg)`, cursor: 'grab', zIndex: 2, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 15px', fontFamily: 'monospace', fontSize: '0.65rem', color: '#555', pointerEvents: 'auto', touchAction: 'none' }}>
          <div style={{ fontWeight: 'bold', fontSize: '0.75rem', marginBottom: '2px', color: bg }}>ADMIT ONE</div>
          <div>NO. {Math.floor(Math.random() * 9000) + 1000}</div>
        </motion.div>
      );
    });
  }, [positions]);

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', overflow: 'visible', pointerEvents: 'none', zIndex: -1 }}>
      {coffeeRings}
      {scribbles}
      {indexCards}
      {tickets}
      {postIts}
      {polaroids}
      {paperClips}
      {washitapes}
    </div>
  );
});

function PolaroidScatter({ top, left, rotate, index, image }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-200, 200], [15, -15]);
  const rotateY = useTransform(x, [-200, 200], [-15, 15]);
  const [revealed, setRevealed] = useState(false);
  
  return (
    <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: 0.2 + Math.random() * 0.5 }}
      drag dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }} dragElastic={0.2} whileDrag={{ scale: 1.1, zIndex: 100, cursor: 'grabbing' }}
      onClick={() => setRevealed(!revealed)}
      style={{ 
        position: 'absolute', top: `${top}%`, left: `${left}%`, width: '140px', height: '170px', 
        rotate: rotate, pointerEvents: 'auto', cursor: 'grab', touchAction: 'none',
        zIndex: 4, perspective: 1000
      }}>
      <motion.div 
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
          width: '100%', height: '100%',
          backgroundColor: '#fafafa', boxShadow: '0 5px 15px rgba(0,0,0,0.1)', 
          padding: '10px 10px 35px 10px', boxSizing: 'border-box',
          rotateX, rotateY
        }}
      >
        <div style={{ width: '100%', height: '120px', backgroundColor: '#222', position: 'relative', overflow: 'hidden' }}>
          {image ? (
            <img src={image} alt="poem polaroid" draggable="false" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            revealed && index === 0 && (
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: '#fff', color: '#111', padding: '10px', boxSizing: 'border-box', fontSize: '0.65rem', fontStyle: 'italic', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                Todo es arte<br/>
                Tambi&eacute;n este poema,<br/>
                Que se lee cerrando los ojos.<br/>
                Para vivir fuera del agua
              </div>
            )
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
