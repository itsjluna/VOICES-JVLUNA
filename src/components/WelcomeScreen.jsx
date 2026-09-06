import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { IndexScatter } from './IndexScatter';
import { useLanguage } from '../contexts/LanguageContext';
import PageWrapper from './PageWrapper';

function WelcomeScreen() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [step, setStep] = useState(0);

  const sections = [
    { id: 'poetry', path: '/index', labelEN: 'Index', labelES: 'Índice', status: 'available' },
    { id: 'photography', path: '/photography', labelEN: 'Photography', labelES: 'Fotografía', status: 'soon' },
    { id: 'video', path: '/video', labelEN: 'Videos', labelES: 'Videos', status: 'soon' },
    { id: 'gamedev', path: '/gamedev', labelEN: 'Games', labelES: 'Juegos', status: 'soon' },
  ];

  const renderStatusBadge = (status) => {
    if (status === 'available') {
      return (
        <span style={{ fontSize: '0.6rem', letterSpacing: '2px', padding: '0.2rem 0.5rem', border: '1px solid currentColor', borderRadius: '12px', opacity: 0.8 }}>
          {language === 'EN' ? 'EXPLORE' : 'EXPLORAR'}
        </span>
      );
    } else {
      return (
        <span style={{ fontSize: '0.6rem', letterSpacing: '2px', padding: '0.2rem 0.5rem', border: '1px dashed currentColor', borderRadius: '12px', opacity: 0.5 }}>
          {language === 'EN' ? 'IN THE MAKING' : 'EN PROCESO'}
        </span>
      );
    }
  };

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
        <div style={{ fontSize: '0.8rem', letterSpacing: '4px', opacity: 0.5, marginBottom: '2rem', fontFamily: 'monospace' }}>PATHS BY J VIOLET LUNA - FIRST EDITION VER1.0.0</div>
        
        <h1 style={{ fontSize: 'clamp(2rem, 6vw, 3.5rem)', letterSpacing: '0.15em', marginBottom: '2rem', textTransform: 'uppercase', lineHeight: '1.2' }}>PATHS</h1>
        
        <p style={{ fontStyle: 'italic', marginBottom: '3rem', fontSize: 'clamp(0.9rem, 2vw, 1.1rem)', opacity: 0.8, lineHeight: '1.8' }}>
          {language === 'EN' 
            ? 'The only way out is art.'
            : 'La única salida es el arte.'
          }
        </p>

        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.button 
              key="enter-btn"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.05, backgroundColor: 'var(--text-color)', color: 'var(--bg-color)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setStep(1)}
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
          )}

          {step === 1 && (
            <motion.div
              key="advisory"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%', maxWidth: '400px', margin: '0 auto' }}
            >
              <div style={{ border: '1px solid var(--border-color)', padding: '1.5rem', borderRadius: '8px', backgroundColor: 'rgba(255, 0, 0, 0.05)' }}>
                <h3 style={{ fontSize: '1.1rem', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '1rem', color: '#ff4d4d' }}>
                  {language === 'EN' ? 'Content Advisory' : 'Aviso de Contenido'}
                </h3>
                <p style={{ fontSize: '0.85rem', lineHeight: '1.6', opacity: 0.8, marginBottom: '0' }}>
                  {language === 'EN' 
                    ? 'This archive contains explicit imagery, mature language, and sensitive themes. By proceeding, you confirm you are 18 years of age or older, or have parental consent.' 
                    : 'Este archivo contiene imágenes explícitas, lenguaje maduro y temas sensibles. Al continuar, confirmas que tienes 18 años o más, o cuentas con consentimiento parental.'}
                </p>
              </div>
              <motion.button 
                whileHover={{ scale: 1.02, backgroundColor: 'var(--text-color)', color: 'var(--bg-color)' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setStep(2)}
                style={{
                  background: 'transparent',
                  color: 'var(--text-color)',
                  border: '1px solid var(--text-color)',
                  padding: '1rem',
                  fontSize: '0.85rem',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  borderRadius: '8px',
                  transition: 'background 0.3s ease, color 0.3s ease'
                }}
              >
                {language === 'EN' ? 'I Understand' : 'Comprendo'}
              </motion.button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="sections-list"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', width: '100%', maxWidth: '400px', margin: '0 auto' }}
            >
              {sections.map((sec, i) => (
                <motion.button
                  key={sec.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.1, duration: 0.3 }}
                  whileHover={{ backgroundColor: 'rgba(128,128,128,0.1)' }}
                  onClick={() => navigate(sec.path)}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'transparent',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-color)',
                    padding: '1rem',
                    fontSize: '0.85rem',
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s ease',
                    textAlign: 'left',
                    borderRadius: '8px'
                  }}
                >
                  <span>{language === 'EN' ? sec.labelEN : sec.labelES}</span>
                  {renderStatusBadge(sec.status)}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      
      {/* Decorative Marginalia */}
      <div className="editorial-margin left" style={{ opacity: 0.5 }}>{language === 'EN' ? 'ARCHIVE ENTRY — SEASONS' : 'ENTRADA DE ARCHIVO — TEMPORADAS'}</div>
      <div className="editorial-margin right" style={{ opacity: 0.5 }}>{language === 'EN' ? 'EDITION ONE' : 'EDICIÓN UNO'}</div>
    </PageWrapper>
  );
}

export default React.memo(WelcomeScreen);
