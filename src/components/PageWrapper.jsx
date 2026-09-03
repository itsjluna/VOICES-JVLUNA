import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TypewriterLoader from './TypewriterLoader';
import { useLanguage } from '../contexts/LanguageContext';

const PageWrapper = ({ isLoading = false, loadingTextEn = "Loading...", loadingTextEs = "Cargando...", style, className, children }) => {
  const { language } = useLanguage();

  React.useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  React.useEffect(() => {
    if (!isLoading) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  }, [isLoading]);

  return (
    <motion.div 
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
      style={{ position: 'relative', width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column' }} 
    >
      <AnimatePresence>
        {isLoading && (
          <motion.div
            key="loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8 } }}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 100, display: 'flex', flexDirection: 'column' }}
          >
            <TypewriterLoader text={language === 'EN' ? loadingTextEn : loadingTextEs} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!isLoading && (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            style={{ width: '100%', flex: 1, display: 'flex', flexDirection: 'column', ...style }}
            className={className}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PageWrapper;
