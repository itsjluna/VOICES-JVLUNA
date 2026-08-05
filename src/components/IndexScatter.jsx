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

  const polaroids = useMemo(() => {
    return randomImages.map((image, i) => {
      const top = 5 + Math.random() * 70;
      const left = 5 + Math.random() * 75;
      const rotate = Math.random() * 60 - 30;
      
      return (
        <PolaroidScatter key={`polaroid-${i}`} top={top} left={left} rotate={rotate} index={i} image={image} />
      );
    });
  }, [randomImages]);

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
      {polaroids}
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
