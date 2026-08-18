import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSun, FaMoon, FaHome, FaBookOpen, FaLanguage, FaStickyNote, FaCamera, FaFilm, FaGamepad, FaPalette } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

function DockNav() {
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('theme') === 'dark' || 
           (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });
  
  const navigate = useNavigate();
  const location = useLocation();
  const { language, toggleLanguage } = useLanguage();

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const [isArtMenuOpen, setIsArtMenuOpen] = useState(false);
  const popupRef = useRef(null);

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (e.target.closest('.palette-toggle-btn')) return;
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setIsArtMenuOpen(false);
      }
    };
    if (isArtMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isArtMenuOpen]);

  const activeColor = isDark ? '#121212' : '#fdfdf8';
  const inactiveColor = isDark ? '#fdfdf8' : '#121212';

  return (
    <motion.div 
      initial={{ y: 50, opacity: 0, x: '-50%' }}
      animate={{ y: 0, opacity: 1, x: '-50%' }}
      style={{
        position: 'fixed',
        bottom: '2rem',
        left: '50%',
        zIndex: 5000,
        borderRadius: '35px',
        background: isDark ? 'rgba(30, 30, 30, 0.6)' : 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(15px)',
        WebkitBackdropFilter: 'blur(15px)',
        border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
        boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
      }}
    >
      <div 
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem',
        }}
      >
        <DockButton 
          icon={<FaHome size={20} color={location.pathname === '/' ? activeColor : inactiveColor} />} 
          label="Home"
          active={location.pathname === '/'} 
          onClick={() => { navigate('/'); setIsArtMenuOpen(false); }} 
          isDark={isDark}
        />
        <div style={{ width: '1px', height: '24px', background: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)', flexShrink: 0 }} />
        <div className="palette-toggle-btn" style={{ position: 'relative' }}>
          <DockButton 
            icon={<FaPalette size={20} color={isArtMenuOpen ? activeColor : inactiveColor} />} 
            label="Art Collection"
            active={isArtMenuOpen} 
            onClick={() => setIsArtMenuOpen(!isArtMenuOpen)} 
            isDark={isDark}
          />

          <AnimatePresence>
            {isArtMenuOpen && (
              <motion.div
                ref={popupRef}
                className="glass-panel"
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                style={{
                  position: 'absolute',
                  bottom: 'calc(100% + 20px)',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  borderRadius: '25px',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                  minWidth: '180px',
                  width: 'max-content',
                  zIndex: 5001
                }}
              >
                <div style={{ padding: '0 0.5rem 0.5rem', borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`, marginBottom: '0.5rem', fontSize: '0.8rem', letterSpacing: '2px', textTransform: 'uppercase', opacity: 0.6, fontWeight: 600, textAlign: 'center' }}>
                  Paths
                </div>
                <MenuButton 
                  icon={<FaBookOpen size={16} />} 
                  label={language === 'EN' ? "Poetry" : "Poesía"}
                  active={location.pathname === '/index'} 
                  onClick={() => { navigate('/index'); setIsArtMenuOpen(false); }} 
                  isDark={isDark}
                />
                <MenuButton 
                  icon={<FaStickyNote size={16} />} 
                  label="Journal"
                  active={location.pathname === '/journal'} 
                  onClick={() => { navigate('/journal'); setIsArtMenuOpen(false); }} 
                  isDark={isDark}
                />
                <MenuButton 
                  icon={<FaCamera size={16} />} 
                  label={language === 'EN' ? "Photography" : "Fotografía"}
                  active={location.pathname === '/photography'} 
                  onClick={() => { navigate('/photography'); setIsArtMenuOpen(false); }} 
                  isDark={isDark}
                />
                <MenuButton 
                  icon={<FaFilm size={16} />} 
                  label={language === 'EN' ? "Video Editing" : "Edición de Video"}
                  active={location.pathname === '/video'} 
                  onClick={() => { navigate('/video'); setIsArtMenuOpen(false); }} 
                  isDark={isDark}
                />
                <MenuButton 
                  icon={<FaGamepad size={16} />} 
                  label="Game Dev"
                  active={location.pathname === '/gamedev'} 
                  onClick={() => { navigate('/gamedev'); setIsArtMenuOpen(false); }} 
                  isDark={isDark}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div style={{ width: '1px', height: '24px', background: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)', flexShrink: 0 }} />
        <DockButton 
          icon={isDark ? <FaSun size={20} color={inactiveColor} /> : <FaMoon size={20} color={inactiveColor} />} 
          label={isDark ? 'Light Mode' : 'Dark Mode'}
          active={false} 
          onClick={() => { setIsDark(!isDark); setIsArtMenuOpen(false); }} 
          isDark={isDark}
        />
        
        <DockButton 
          icon={<div style={{ fontSize: '14px', fontWeight: 'bold', color: inactiveColor }}>{language}</div>} 
          label="Toggle Language"
          active={false} 
          onClick={() => { toggleLanguage(); setIsArtMenuOpen(false); }} 
          isDark={isDark}
        />
      </div>
    </motion.div>
  );
}

function DockButton({ icon, active, onClick, label, isDark }) {
  const activeBg = isDark ? '#fdfdf8' : '#121212';
  const inactiveBg = 'transparent';

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.9 }}
      title={label}
      style={{
        width: '45px',
        height: '45px',
        borderRadius: '50%',
        border: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        background: active ? activeBg : inactiveBg,
        color: active ? (isDark ? '#121212' : '#fdfdf8') : (isDark ? '#fdfdf8' : '#121212'),
        transition: 'background 0.2s ease-in-out, color 0.2s ease-in-out',
        padding: 0,
        fontSize: '20px',
        flexShrink: 0
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
        {icon}
      </div>
    </motion.button>
  );
}
function MenuButton({ icon, label, active, onClick, isDark }) {
  const activeBg = isDark ? '#fdfdf8' : '#121212';
  const inactiveBg = 'transparent';
  
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02, backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }}
      whileTap={{ scale: 0.98 }}
      style={{
        width: '100%',
        padding: '0.8rem 1rem',
        borderRadius: '15px',
        border: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        textAlign: 'left',
        gap: '1rem',
        cursor: 'pointer',
        background: active ? activeBg : inactiveBg,
        color: active ? (isDark ? '#121212' : '#fdfdf8') : (isDark ? '#fdfdf8' : '#121212'),
        transition: 'all 0.2s ease-in-out',
        fontSize: '1rem',
        fontFamily: 'inherit',
        fontWeight: active ? 600 : 400
      }}
    >
      <div style={{ opacity: active ? 1 : 0.7 }}>{icon}</div>
      <span>{label}</span>
    </motion.button>
  );
}

export default DockNav;
