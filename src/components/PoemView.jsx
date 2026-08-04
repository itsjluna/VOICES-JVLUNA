import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { IndexScatter } from './IndexScatter';
import { useReadingProgress } from '../hooks/useReadingProgress';
import api from '../api';
import Polaroid from './Polaroid';
import Marginalia from './Marginalia';
import { Winter, Spring, Summer, Autumn, AmbientDust, DigitalMatrix, Embers, Clocks, DawnLight } from './SeasonBackgrounds';

function PoemView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [poem, setPoem] = useState(null);
  const { markAsRead } = useReadingProgress();

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await api.get(`/poems/${id}`);
        setPoem(res.data);
      } catch (err) {
        console.error(err);
      }
      if (id) markAsRead(id);
    }
    fetchData();
  }, [id]);

  if (!poem) return <div style={{ padding: '2rem' }}>Loading...</div>;

  const renderBackground = () => {
    switch (poem.theme) {
      case 'winter': return <Winter />;
      case 'spring': return <Spring />;
      case 'summer': return <Summer />;
      case 'autumn': return <Autumn />;
      case 'ambient': return <AmbientDust />;
      case 'digital': return <DigitalMatrix />;
      case 'embers': return <Embers />;
      case 'clocks': return <Clocks />;
      case 'dawn': return <DawnLight />;
      default: return null;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}
      style={{ flex: 1, padding: '2rem 0', position: 'relative' }}
    >
      {renderBackground()}
      <button style={{ marginBottom: '2rem', border: 'none', padding: '0', textDecoration: 'underline', position: 'relative', zIndex: 10 }} onClick={() => navigate(-1)}>
        &larr; Back
      </button>

      <div className="editorial-margin left">
        ENTRY Nº {id.slice(-4).toUpperCase()} — VOICES
      </div>
      <div className="book-layout book-page-aesthetic">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
          className="book-content"
          style={{ position: 'relative' }}
        >
          <Marginalia />
          <h1 style={{ fontSize: '2rem', marginBottom: '3rem', position: 'relative', zIndex: 10 }}>{poem.title}</h1>

          {poem.image && (
            <motion.div 
              initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.5 }}
              className="book-media bookmark-wrapper"
              style={{ position: 'relative' }}
            >
              {/* Library Due Date Card (The other element) */}
              <div style={{
                position: 'absolute',
                top: '-30px',
                right: '15px',
                width: '130px',
                height: '180px',
                backgroundColor: '#f5f2eb',
                border: '1px solid #dcd3c6',
                transform: 'rotate(6deg)',
                boxShadow: '2px 3px 6px rgba(0,0,0,0.15)',
                padding: '10px 15px',
                zIndex: 0,
                fontFamily: '"Courier New", Courier, monospace',
                fontSize: '0.65rem',
                color: '#555',
                backgroundImage: 'linear-gradient(transparent 90%, #e6dfd1 90%)',
                backgroundSize: '100% 1.5rem',
                lineHeight: '1.5rem'
              }}>
                <div style={{ borderBottom: '2px solid #888', paddingBottom: '2px', marginBottom: '2px', textAlign: 'center', fontWeight: 'bold', letterSpacing: '1px', fontSize: '0.7rem' }}>DATE DUE</div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>OCT 14</span><span>1998</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>MAR 03</span><span>2003</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>SEP 21</span><span>2015</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#c0392b' }}><span>NOV 04</span><span>2026</span></div>
              </div>

              <Polaroid 
                src={poem.image} 
                alt={poem.title} 
                polaroidClass="bookmark-polaroid"
                containerStyle={{ position: 'relative', zIndex: 1 }}
              />

              {/* Metallic Paperclip */}
              <svg 
                viewBox="0 0 120 200" 
                style={{ 
                  position: 'absolute', 
                  top: '-45px', 
                  right: '45px', 
                  width: '35px', 
                  height: '70px', 
                  transform: 'rotate(-10deg)',
                  zIndex: 10,
                  filter: 'drop-shadow(2px 4px 3px rgba(0,0,0,0.3))'
                }}
              >
                <path d="M45,45 L45,150 A15,15 0 0,0 75,150 L75,30 A25,25 0 0,0 25,30 L25,160 A35,35 0 0,0 95,160 L95,55" fill="none" stroke="#bdc3c7" strokeWidth="8" strokeLinecap="round" />
                <path d="M45,45 L45,150 A15,15 0 0,0 75,150 L75,30 A25,25 0 0,0 25,30 L25,160 A35,35 0 0,0 95,160 L95,55" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" opacity="0.5" transform="translate(-1, -1)" />
              </svg>
            </motion.div>
          )}

          <div className="poem-text" dangerouslySetInnerHTML={{ __html: poem.content }} />
        </motion.div>
        <div style={{ clear: 'both' }}></div>
      </div>
    </motion.div>
  );
}

export default React.memo(PoemView);
