import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaExclamationTriangle, FaHome, FaWifi, FaLock, FaGhost } from 'react-icons/fa';
import { useLanguage } from '../contexts/LanguageContext';
import PageWrapper from './PageWrapper';

function ErrorView({ fallbackCode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { language } = useLanguage();
  
  const queryParams = new URLSearchParams(location.search);
  const codeParam = queryParams.get('code');
  const code = codeParam || fallbackCode || 'unknown';

  const getErrorContent = () => {
    switch(String(code)) {
      case '404':
        return {
          icon: <FaGhost size={60} />,
          titleEn: "PAGE NOT FOUND",
          titleEs: "PÁGINA NO ENCONTRADA",
          descEn: "The entry you're looking for doesn't exist anymore or the URL is incorrect.",
          descEs: "La entrada que buscas ya no existe o la URL es incorrecta."
        };
      case '403':
      case '401':
        return {
          icon: <FaLock size={60} />,
          titleEn: "FORBIDDEN",
          titleEs: "PROHIBIDO",
          descEn: "You do not have access to view this area.",
          descEs: "No tienes acceso para ver esta área."
        };
      case 'network':
        return {
          icon: <FaWifi size={60} />,
          titleEn: "CONNECTION LOST",
          titleEs: "CONEXIÓN PERDIDA",
          descEn: "Unable to reach the server. Please check your internet connection.",
          descEs: "No se pudo conectar al servidor. Por favor revisa tu conexión a internet."
        };
      case '500':
        return {
          icon: <FaExclamationTriangle size={60} />,
          titleEn: "INTERNAL SERVER ERROR",
          titleEs: "ERROR INTERNO DEL SERVIDOR",
          descEn: "Something went wrong on our end. We're looking into it.",
          descEs: "Algo salió mal por nuestra parte. Lo estamos investigando."
        };
      default:
        return {
          icon: <FaExclamationTriangle size={60} />,
          titleEn: "UNEXPECTED ERROR",
          titleEs: "ERROR INESPERADO",
          descEn: `An error occurred (Code: ${code}).`,
          descEs: `Ocurrió un error (Código: ${code}).`
        };
    }
  };

  const content = getErrorContent();

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
        <div style={{ color: 'var(--text-color)', opacity: 0.7 }}>
          {content.icon}
        </div>
        
        <h1 style={{ 
          fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', 
          letterSpacing: '0.15em', 
          textTransform: 'uppercase', 
          margin: 0,
          fontFamily: 'var(--font-serif)'
        }}>
          {language === 'EN' ? content.titleEn : content.titleEs}
        </h1>
        
        <p style={{ 
          fontSize: '1.1rem', 
          opacity: 0.8, 
          lineHeight: '1.6',
          fontFamily: 'var(--font-sans)',
          maxWidth: '400px'
        }}>
          {language === 'EN' ? content.descEn : content.descEs}
        </p>

        <motion.button 
          whileHover={{ scale: 1.05, backgroundColor: 'var(--text-color)', color: 'var(--bg-color)' }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.8rem',
            background: 'transparent',
            border: '1px solid var(--border-color)',
            color: 'var(--text-color)',
            padding: '1rem 2rem',
            borderRadius: '30px',
            cursor: 'pointer',
            fontFamily: 'var(--font-sans)',
            fontSize: '1rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginTop: '1rem',
            transition: 'all 0.3s ease'
          }}
        >
          <FaHome size={18} />
          {language === 'EN' ? 'Return Home' : 'Volver al Inicio'}
        </motion.button>
      </motion.div>
    </PageWrapper>
  );
}

export default React.memo(ErrorView);
