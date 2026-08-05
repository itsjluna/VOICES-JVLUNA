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
    return [...Array(10)].map(() => ({
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

  const scribbles = useMemo(() => {
    return [...Array(3)].map((_, i) => {
      const pos = positions[i + 7] || positions[2];
      const top = pos.top;
      const left = pos.left;
      const rotate = pos.rotate * 6;
      const paths = [
        "M 10 50 Q 25 10, 50 50 T 90 50",
        "M 20 20 Q 80 20, 50 50 T 80 80",
        "M 10 10 L 90 90 M 90 10 L 10 90",
        "M 50 10 C 20 10, 10 40, 50 50 C 90 60, 80 90, 50 90"
      ];
      const path = paths[Math.floor(Math.random() * paths.length)];
      return (
        <motion.svg key={`scribble-${i}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5, delay: 0.5 + Math.random() }}
          width="120" height="120" viewBox="0 0 100 100" style={{ position: 'absolute', top: `${top}%`, left: `${left}%`, transform: `rotate(${rotate}deg)`, pointerEvents: 'none', zIndex: 1, opacity: 0.1 }}>
          <path d={path} fill="none" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </motion.svg>
      );
    });
  }, []);

  const paperClips = useMemo(() => {
    return [...Array(2)].map((_, i) => {
      const pos = positions[i + 2] || positions[3];
      const top = pos.top;
      const left = pos.left;
      const rotate = pos.rotate * 6;
      return (
        <motion.svg key={`clip-${i}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5, delay: 0.8 }}
          width="40" height="40" viewBox="0 0 100 100" style={{ position: 'absolute', top: `${top}%`, left: `${left}%`, transform: `rotate(${rotate}deg)`, pointerEvents: 'none', zIndex: 3, opacity: 0.7, filter: 'drop-shadow(2px 4px 4px rgba(0,0,0,0.3))' }}>
          <path d="M40 20 L40 70 A 15 15 0 0 0 70 70 L70 30 A 10 10 0 0 0 50 30 L50 60 A 5 5 0 0 0 60 60 L60 40" fill="none" stroke="#ddd" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
          {/* Metallic highlight */}
          <path d="M41 21 L41 68" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
        </motion.svg>
      );
    });
  }, []);

  const washitapes = useMemo(() => {
    return [...Array(2)].map((_, i) => {
      const pos = positions[i + 4] || positions[4];
      const top = pos.top;
      const left = pos.left;
      const rotate = pos.rotate;
      const colors = ['rgba(255,200,200,0.6)', 'rgba(200,255,200,0.6)', 'rgba(200,200,255,0.6)', 'rgba(255,255,200,0.6)'];
      const bg = colors[Math.floor(Math.random() * colors.length)];
      return (
        <motion.div key={`tape-${i}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.5 }}
          style={{ position: 'absolute', top: `${top}%`, left: `${left}%`, width: '120px', height: '30px', backgroundColor: bg, transform: `rotate(${rotate}deg)`, zIndex: 5, pointerEvents: 'none', opacity: 0.8, filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.1))' }} />
      );
    });
  }, []);

  const indexCards = useMemo(() => {
    return [...Array(1)].map((_, i) => {
      const pos = positions[i + 1] || positions[5];
      const top = pos.top;
      const left = pos.left;
      const rotate = pos.rotate / 3;
      return (
        <motion.div key={`indexcard-${i}`} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.5, delay: 0.3 }}
          style={{ position: 'absolute', top: `${top}%`, left: `${left}%`, width: '200px', height: '140px', backgroundColor: '#fcfcfc', borderTop: '30px solid #ff7b7b', boxShadow: '0 4px 15px rgba(0,0,0,0.08)', transform: `rotate(${rotate}deg)`, zIndex: 1, pointerEvents: 'none', backgroundImage: 'repeating-linear-gradient(transparent, transparent 19px, #e0e0e0 20px)' }} />
      );
    });
  }, []);

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0, overflow: 'visible' }}>
      {coffeeRings}
      {scribbles}
      {indexCards}
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
      drag dragConstraints={{ left: -1200, right: 1200, top: -1200, bottom: 1200 }} whileDrag={{ scale: 1.1, zIndex: 100 }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        x.set(e.clientX - rect.left - rect.width / 2);
        y.set(e.clientY - rect.top - rect.height / 2);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      onClick={() => setRevealed(!revealed)}
      style={{ 
        position: 'absolute', top: `${top}%`, left: `${left}%`, width: '140px', height: '170px', 
        backgroundColor: '#fafafa', boxShadow: '0 5px 15px rgba(0,0,0,0.1)', 
        transform: `rotate(${rotate}deg)`, pointerEvents: 'auto', cursor: 'grab', 
        zIndex: 4, padding: '10px 10px 35px 10px', boxSizing: 'border-box',
        rotateX, rotateY, perspective: 1000
      }}>
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
  );
}
