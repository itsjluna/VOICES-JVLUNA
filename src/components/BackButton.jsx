import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const BackButton = ({ style, className }) => {
  const navigate = useNavigate();
  const { language } = useLanguage();

  const handleBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate('/index');
    }
  };

  return (
    <button 
      className={`back-button ${className || ''}`}
      style={{ marginBottom: '2rem', alignSelf: 'flex-start', ...style }} 
      onClick={handleBack}
    >
      &larr; {language === 'EN' ? 'Back' : 'Volver'}
    </button>
  );
};

export default BackButton;
