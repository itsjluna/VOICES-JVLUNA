import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { IndexScatter } from './IndexScatter';
import { useLanguage } from '../contexts/LanguageContext';
import PageWrapper from './PageWrapper';

function WelcomeScreen() {
  const navigate = useNavigate();
  const { language } = useLanguage();

  return (
    <PageWrapper 
      style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'relative' }}
    >
      {/* Background Scatter */}
      <IndexScatter />

      <motion.div 
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0, duration: 1.5, ease: "easeInOut" }}
        className="glass-panel"
        style={{
          padding: 'clamp(2rem, 5vw, 4rem) clamp(2rem, 8vw, 5rem)',
          textAlign: 'center',
          maxWidth: '90%',
          width: '600px',
          position: 'relative',
          zIndex: 10
        }}
      >
        <div style={{ fontSize: '0.8rem', letterSpacing: '4px', opacity: 0.5, marginBottom: '2rem', fontFamily: 'monospace' }}>VOICES BY JOSHUA V LUNA - FIRST EDITION VER1.0.0</div>
        
        <h1 style={{ fontSize: 'clamp(2rem, 6vw, 3.5rem)', letterSpacing: '0.15em', marginBottom: '2rem', textTransform: 'uppercase', lineHeight: '1.2' }}>VOICES</h1>
        
        <p style={{ fontStyle: 'italic', marginBottom: '3rem', fontSize: 'clamp(0.9rem, 2vw, 1.1rem)', opacity: 0.8, lineHeight: '1.8' }}>
          {language === 'EN' 
            ? <React.Fragment>A curated collection of poetry, memories,<br/>ropes and sticks</React.Fragment>
            : <React.Fragment>Una cuidada colección de poesía, memorias,<br/>cuerdas y palos</React.Fragment>
          }
        </p>

        <motion.button 
          whileHover={{ scale: 1.05, backgroundColor: 'var(--text-color)', color: 'var(--bg-color)' }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/index')}
          style={{
            background: 'transparent',
            color: 'var(--text-color)',
            border: '1px solid var(--text-color)',
            padding: '1rem clamp(1.5rem, 4vw, 3rem)',
            fontSize: '0.9rem',
            letterSpacing: '3px',
            textTransform: 'uppercase',
            cursor: 'pointer',
            transition: 'background 0.3s ease, color 0.3s ease'
          }}
        >
          {language === 'EN' ? 'Enter' : 'Entrar'}
        </motion.button>
      </motion.div>
      
      {/* Decorative Marginalia */}
      <div className="editorial-margin left" style={{ opacity: 0.5 }}>{language === 'EN' ? 'ARCHIVE ENTRY — SEASONS' : 'ENTRADA DE ARCHIVO — TEMPORADAS'}</div>
      <div className="editorial-margin right" style={{ opacity: 0.5 }}>{language === 'EN' ? 'EDITION ONE' : 'EDICIÓN UNO'}</div>
    </PageWrapper>
  );
}

export default React.memo(WelcomeScreen);
