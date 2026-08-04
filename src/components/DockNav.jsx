import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaSun, FaMoon, FaHome, FaBookOpen } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';

function DockNav() {
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('theme') === 'dark' || 
           (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });
  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

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
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.5rem',
        borderRadius: '35px',
        background: isDark ? 'rgba(30, 30, 30, 0.6)' : 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(15px)',
        WebkitBackdropFilter: 'blur(15px)',
        border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
        boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
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
      
      <div style={{ width: '1px', height: '24px', background: inactiveColor, margin: '0 0.5rem', opacity: 0.5 }} />

      <DockButton 
        icon={isDark ? <FaSun size={20} color={inactiveColor} /> : <FaMoon size={20} color={inactiveColor} />} 
        label={isDark ? 'Light Mode' : 'Dark Mode'}
        active={false} 
        onClick={() => setIsDark(!isDark)} 
        isDark={isDark}
      />
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
        fontSize: '20px'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
        {icon}
      </div>
    </motion.button>
  );
}

export default DockNav;
