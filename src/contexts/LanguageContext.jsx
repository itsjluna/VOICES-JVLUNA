import React, { createContext, useState, useContext, useEffect } from 'react';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  // Default to Spanish (ES) as it's the original language of the site
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('site_language') || 'ES';
  });

  const toggleLanguage = () => {
    setLanguage(prev => {
      const next = prev === 'ES' ? 'EN' : 'ES';
      localStorage.setItem('site_language', next);
      return next;
    });
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
