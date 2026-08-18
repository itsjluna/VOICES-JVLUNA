import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSun, FaMoon, FaHome, FaBookOpen, FaLanguage, FaStickyNote, FaCamera, FaFilm, FaGamepad, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
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

  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 2); // a little buffer
      setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth - 2);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    // Also check after a brief delay in case fonts/icons are loading
    const timer = setTimeout(checkScroll, 500);
    return () => {
      window.removeEventListener('resize', checkScroll);
      clearTimeout(timer);
    };
  }, []);

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
        boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
        maxWidth: 'calc(100vw - 2rem)',
        overflow: 'hidden'
      }}
    >
      <style>{`
        .dock-scroll-container::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      
      <AnimatePresence>
        {canScrollLeft && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: '40px',
              background: `linear-gradient(to right, ${isDark ? 'rgba(30,30,30,0.95)' : 'rgba(255,255,255,0.95)'}, transparent)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              paddingLeft: '8px',
              pointerEvents: 'none',
              zIndex: 10
            }}
          >
            <motion.div animate={{ x: [-3, 0, -3] }} transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}>
              <FaChevronLeft size={14} color={inactiveColor} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div 
        ref={scrollRef}
        className="dock-scroll-container"
        onScroll={checkScroll}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem',
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        <DockButton 
        icon={<FaHome size={20} color={location.pathname === '/' ? activeColor : inactiveColor} />} 
        label="Home"
        active={location.pathname === '/'} 
        onClick={() => navigate('/')} 
        isDark={isDark}
      />
      <DockButton 
        icon={<FaBookOpen size={20} color={location.pathname === '/index' ? activeColor : inactiveColor} />} 
        label="Index"
        active={location.pathname === '/index'} 
        onClick={() => navigate('/index')} 
        isDark={isDark}
      />
      <DockButton 
        icon={<FaStickyNote size={20} color={location.pathname === '/journal' ? activeColor : inactiveColor} />} 
        label="Journal"
        active={location.pathname === '/journal'} 
        onClick={() => navigate('/journal')} 
        isDark={isDark}
      />
      <div style={{ width: '1px', height: '24px', background: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)', flexShrink: 0 }} />
      <DockButton 
        icon={<FaCamera size={20} color={location.pathname === '/photography' ? activeColor : inactiveColor} />} 
        label="Photography"
        active={location.pathname === '/photography'} 
        onClick={() => navigate('/photography')} 
        isDark={isDark}
      />
      <DockButton 
        icon={<FaFilm size={20} color={location.pathname === '/video' ? activeColor : inactiveColor} />} 
        label="Video Editing"
        active={location.pathname === '/video'} 
        onClick={() => navigate('/video')} 
        isDark={isDark}
      />
      <DockButton 
        icon={<FaGamepad size={20} color={location.pathname === '/gamedev' ? activeColor : inactiveColor} />} 
        label="Game Dev"
        active={location.pathname === '/gamedev'} 
        onClick={() => navigate('/gamedev')} 
        isDark={isDark}
      />
      <div style={{ width: '1px', height: '24px', background: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)', flexShrink: 0 }} />
      <DockButton 
        icon={isDark ? <FaSun size={20} color={inactiveColor} /> : <FaMoon size={20} color={inactiveColor} />} 
        label={isDark ? 'Light Mode' : 'Dark Mode'}
        active={false} 
        onClick={() => setIsDark(!isDark)} 
        isDark={isDark}
      />
      
      <DockButton 
        icon={<div style={{ fontSize: '14px', fontWeight: 'bold', color: inactiveColor }}>{language}</div>} 
        label="Toggle Language"
        active={false} 
        onClick={toggleLanguage} 
        isDark={isDark}
      />
      </div>

      <AnimatePresence>
        {canScrollRight && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'absolute',
              right: 0,
              top: 0,
              bottom: 0,
              width: '40px',
              background: `linear-gradient(to left, ${isDark ? 'rgba(30,30,30,0.95)' : 'rgba(255,255,255,0.95)'}, transparent)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              paddingRight: '8px',
              pointerEvents: 'none',
              zIndex: 10
            }}
          >
            <motion.div animate={{ x: [3, 0, 3] }} transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}>
              <FaChevronRight size={14} color={inactiveColor} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
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

export default DockNav;
