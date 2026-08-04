import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaBookOpen, FaTicketAlt, FaSun, FaMoon, FaStickyNote } from 'react-icons/fa';
import api from '../api';
import { IndexScatter } from './IndexScatter';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

function IndexView() {
  const [chapters, setChapters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Time of day logic
  const hour = new Date().getHours();
  const isDaytime = hour >= 6 && hour < 18;
  const isDawn = hour >= 5 && hour <= 7;
  const isSunset = hour >= 17 && hour <= 19;

  let skyGradient = 'linear-gradient(to bottom, rgba(10, 25, 47, 0.2) 0%, transparent 100%)'; // Night
  let skyIcon = <FaMoon />;
  if (isDawn) {
    skyGradient = 'linear-gradient(to bottom, rgba(255, 183, 178, 0.25) 0%, transparent 100%)';
    skyIcon = <FaSun />;
  } else if (isSunset) {
    skyGradient = 'linear-gradient(to bottom, rgba(255, 154, 118, 0.25) 0%, transparent 100%)';
    skyIcon = <FaSun />;
  } else if (isDaytime) {
    skyGradient = 'linear-gradient(to bottom, rgba(135, 206, 235, 0.25) 0%, transparent 100%)';
    skyIcon = <FaSun />;
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const chapRes = await api.get('/chapters');
        setChapters(chapRes.data);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 1 }} 
      style={{ flex: 1, padding: '4rem 1rem', display: 'flex', flexDirection: 'column', position: 'relative' }}
    >
      <IndexScatter />
      
      {/* Full-width Sky Background */}
      <motion.div 
        className="animated-sky"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          width: '100vw', 
          height: '40vh', 
          background: skyGradient, 
          zIndex: 0,
          pointerEvents: 'none'
        }}
      >
        {/* Drifting Clouds / Stars */}
        <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.2 }}>
          {!isDaytime && !isDawn && !isSunset ? (
            /* Night Stars */
            [...Array(30)].map((_, i) => (
              <circle key={`star-${i}`} cx={`${Math.random() * 100}%`} cy={`${Math.random() * 100}%`} r={Math.random() * 1.5 + 0.5} fill="#fff">
                <animate attributeName="opacity" values="0.1; 0.8; 0.1" dur={`${Math.random() * 4 + 2}s`} repeatCount="indefinite" />
              </circle>
            ))
          ) : (
            /* Daytime Clouds */
            [...Array(4)].map((_, i) => (
              <path key={`cloud-${i}`} d="M 20 20 Q 30 10 40 20 Q 55 15 60 30 Q 70 30 70 40 Q 70 50 60 50 L 20 50 Q 5 50 10 35 Q 5 25 20 20 Z" fill="#fff" transform={`scale(${Math.random() * 2 + 1})`}>
                <animateTransform attributeName="transform" type="translate" from="-200 0" to="2000 0" dur={`${Math.random() * 60 + 60}s`} begin={`-${Math.random() * 60}s`} repeatCount="indefinite" additive="sum" />
                <animate attributeName="y" values={`${Math.random() * 20}vh`} />
              </path>
            ))
          )}
        </svg>

        <motion.div 
          animate={{ rotate: 360 }} 
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          style={{ position: 'absolute', top: '10vh', right: '15vw', fontSize: '3.5rem', color: 'var(--text-color)', opacity: 0.15 }}
        >
          {skyIcon}
        </motion.div>
      </motion.div>

      {/* Main Content Card */}
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        width: '100%',
        padding: '3rem',
        background: 'var(--bg-color)',
        borderRadius: '8px',
        boxShadow: '0 20px 50px rgba(0,0,0,0.08)',
        border: '1px solid var(--border-color)',
        position: 'relative',
        zIndex: 10,
        flexShrink: 0 /* Prevent the card itself from being squeezed by flexbox */
      }}>
        <h1 style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: '4rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Index</h1>
        
        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1, flexDirection: 'column' }}>
            <div style={{ width: '30px', height: '30px', border: '2px solid var(--text-color)', borderBottomColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', opacity: 0.3 }}></div>
            <p style={{ marginTop: '1rem', fontFamily: 'monospace', letterSpacing: '2px', opacity: 0.3, fontSize: '0.8rem' }}>RETRIEVING ARCHIVES...</p>
          </div>
        ) : (
          <motion.div variants={containerVariants} initial="hidden" animate="show" style={{ width: '100%' }}>
            {chapters.length === 0 && <p style={{ textAlign: 'center', fontStyle: 'italic', opacity: 0.5 }}>The archives are empty...</p>}
            
            {chapters.map((chapter, index) => {
              const isInt = chapter.isIntermission;
              const isVent = chapter.isVent;
              
              let linkPath = `/chapter/${chapter._id}`;
              if (isInt) linkPath = `/intermission/${chapter._id}`;
              if (isVent) linkPath = `/vent/${chapter._id}`;
              
              let icon = <FaBookOpen />;
              let iconColor = 'var(--text-color)';
              let numberText = String(index + 1).padStart(2, '0');
              
              if (isInt) { 
                icon = <FaTicketAlt />; 
                iconColor = '#8ecae6'; 
                numberText = 'INT';
              } else if (isVent) {
                icon = <FaStickyNote />;
                iconColor = '#cfcf2b'; // Darker yellow for visibility on light/dark
                numberText = 'VNT';
              }

              return (
                <motion.div variants={itemVariants} key={chapter._id} style={{ marginBottom: '1.5rem' }}>
                  <Link 
                    to={linkPath} 
                    style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}
                    className="index-item"
                  >
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'baseline', 
                      width: '100%',
                      opacity: (isInt || isVent) ? 0.7 : 1,
                      transition: 'opacity 0.3s ease'
                    }}>
                      <span style={{ 
                        marginRight: '1rem',
                        color: iconColor,
                        fontSize: '0.9rem',
                        display: 'flex',
                        alignItems: 'center',
                        transform: 'translateY(2px)'
                      }}>
                        {icon}
                      </span>

                      <span style={{ 
                        fontSize: '1.2rem', 
                        fontStyle: (isInt || isVent) ? 'italic' : 'normal',
                        fontWeight: (isInt || isVent) ? 'normal' : '500',
                        letterSpacing: '0.05em'
                      }}>
                        {chapter.title}
                      </span>
                      
                      <span className="toc-leader" style={{ opacity: 0.2 }}></span>
                      
                      <span style={{ 
                        fontSize: '1rem', 
                        fontFamily: 'monospace', 
                        color: iconColor,
                        opacity: 0.8
                      }}>
                        {numberText}
                      </span>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

export default React.memo(IndexView);
