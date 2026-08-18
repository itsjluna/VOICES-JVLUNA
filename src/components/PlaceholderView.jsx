import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import PageWrapper from './PageWrapper';

function PlaceholderView({ title }) {
  const { language } = useLanguage();

  return (
    <PageWrapper 
      isLoading={false}
      style={{ 
        flex: 1, 
        padding: '2rem 1rem', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '80vh' 
      }}
    >
      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="glass-panel"
        style={{
          maxWidth: '600px',
          width: '100%',
          padding: 'clamp(3rem, 6vw, 5rem) clamp(2rem, 5vw, 4rem)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '2rem',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <h1 style={{ 
          fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', 
          letterSpacing: '0.15em', 
          textTransform: 'uppercase', 
          margin: 0,
          fontFamily: 'var(--font-serif)'
        }}>
          {title}
        </h1>
        
        <p style={{ 
          fontSize: '1.2rem', 
          opacity: 0.8, 
          lineHeight: '1.6',
          fontFamily: 'var(--font-sans)',
          maxWidth: '400px',
          fontStyle: 'italic'
        }}>
          {language === 'EN' ? 'Art is in the making...' : 'El arte está en proceso...'}
        </p>
      </motion.div>
    </PageWrapper>
  );
}

export default React.memo(PlaceholderView);
