import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';

export default function GlobalAdvisory({ children }) {
  const { language } = useLanguage();
  const [isAccepted, setIsAccepted] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem('advisory_accepted');
    if (!accepted) {
      setIsAccepted(false);
    }
    setIsMounted(true);
  }, []);

  const handleAccept = () => {
    localStorage.setItem('advisory_accepted', 'true');
    setIsAccepted(true);
  };

  if (!isMounted) return null;

  return (
    <>
      <AnimatePresence>
        {!isAccepted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              backgroundColor: 'var(--bg-color)',
              zIndex: 999999,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '2rem'
            }}
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              style={{
                maxWidth: '500px',
                width: '100%',
                textAlign: 'center',
                padding: '2.5rem',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                backgroundColor: 'rgba(255, 0, 0, 0.03)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
              }}
            >
              <h2 style={{ fontSize: '1.4rem', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '1.5rem', color: '#ff4d4d' }}>
                {language === 'EN' ? 'Content Advisory' : 'Aviso de Contenido'}
              </h2>
              
              <p style={{ fontSize: '0.95rem', lineHeight: '1.8', opacity: 0.8, marginBottom: '2.5rem', color: 'var(--text-color)' }}>
                {language === 'EN' 
                  ? 'This archive contains explicit imagery, mature language, and sensitive themes. By proceeding, you confirm you are 18 years of age or older, or have parental consent.' 
                  : 'Este archivo contiene imágenes explícitas, lenguaje maduro y temas sensibles. Al continuar, confirmas que tienes 18 años o más, o cuentas con consentimiento parental.'}
              </p>

              <motion.button 
                whileHover={{ scale: 1.05, backgroundColor: 'var(--text-color)', color: 'var(--bg-color)' }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAccept}
                style={{
                  background: 'transparent',
                  color: 'var(--text-color)',
                  border: '1px solid var(--text-color)',
                  padding: '1rem 3rem',
                  fontSize: '0.9rem',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  borderRadius: '4px',
                  transition: 'background 0.3s ease, color 0.3s ease'
                }}
              >
                {language === 'EN' ? 'I Understand' : 'Comprendo'}
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {isAccepted && children}
    </>
  );
}