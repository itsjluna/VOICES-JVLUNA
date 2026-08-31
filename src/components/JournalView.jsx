import React, { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBookOpen, FaTicketAlt, FaSun, FaMoon, FaStickyNote, FaCloud, FaCloudRain, FaSnowflake, FaEye, FaEyeSlash, FaFilter } from 'react-icons/fa';
import api from '../api';
import { useQuery } from '@tanstack/react-query';
import { IndexScatter } from './IndexScatter';
import { useReadingProgress } from '../hooks/useReadingProgress';
import AmbientAudio from './AmbientAudio';
import { useLanguage } from '../contexts/LanguageContext';
import PageWrapper from './PageWrapper';

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

function JournalView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [localWeather, setLocalWeather] = useState('loading');
  const [showSky, setShowSky] = useState(true);
  const [showQuote, setShowQuote] = useState(false);
  const { readChapters } = useReadingProgress();
  const { language } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    if (showQuote) {
      const timer = setTimeout(() => setShowQuote(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [showQuote, showSky]);

  // Time of day logic
  const hour = new Date().getHours();
  const isDaytime = hour >= 6 && hour < 18;
  const isDawn = hour >= 5 && hour <= 7;
  const isSunset = hour >= 17 && hour <= 19;

  let skyGradientBase = 'linear-gradient(to bottom, rgba(10, 25, 47, 0.6) 0%, rgba(10, 25, 47, 0) 100%)';
  let skyIcon = <FaMoon />;
  if (isDawn) {
    skyGradientBase = 'linear-gradient(to bottom, rgba(255, 183, 178, 0.6) 0%, rgba(255, 183, 178, 0) 100%)';
    skyIcon = <FaSun />;
  } else if (isSunset) {
    skyGradientBase = 'linear-gradient(to bottom, rgba(255, 154, 118, 0.6) 0%, rgba(255, 154, 118, 0) 100%)';
    skyIcon = <FaSun />;
  } else if (isDaytime) {
    skyGradientBase = 'linear-gradient(to bottom, rgba(135, 206, 235, 0.6) 0%, rgba(135, 206, 235, 0) 100%)';
    skyIcon = <FaSun />;
  }

  let skyGradientWeather = 'transparent';
  if (localWeather === 'cloudy') {
    skyIcon = <FaCloud />;
    skyGradientWeather = isDaytime ? 'linear-gradient(to bottom, rgba(150, 160, 170, 0.7) 0%, rgba(200, 210, 220, 0) 100%)' : 'linear-gradient(to bottom, rgba(30, 40, 50, 0.8) 0%, rgba(30, 40, 50, 0) 100%)';
  } else if (localWeather === 'rain') {
    skyIcon = <FaCloudRain />;
    skyGradientWeather = isDaytime ? 'linear-gradient(to bottom, rgba(100, 120, 140, 0.8) 0%, rgba(140, 160, 180, 0) 100%)' : 'linear-gradient(to bottom, rgba(15, 20, 30, 0.9) 0%, rgba(15, 20, 30, 0) 100%)';
  } else if (localWeather === 'snow') {
    skyIcon = <FaSnowflake />;
    skyGradientWeather = isDaytime ? 'linear-gradient(to bottom, rgba(180, 190, 200, 0.7) 0%, rgba(220, 230, 240, 0) 100%)' : 'linear-gradient(to bottom, rgba(40, 50, 60, 0.8) 0%, rgba(40, 50, 60, 0) 100%)';
  }

  const { data: chapters = [], isLoading } = useQuery({
    queryKey: ['chapters', 'lean'],
    queryFn: async () => {
      const res = await api.get('/chapters?lean=true');
      return res.data;
    }
  });

  useEffect(() => {

    async function fetchWeather() {
      try {
        const geoRes = await fetch('https://get.geojs.io/v1/ip/geo.json');
        if (!geoRes.ok) return;
        const geoData = await geoRes.json();
        
        const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${geoData.latitude}&longitude=${geoData.longitude}&current_weather=true`);
        if (!weatherRes.ok) return;
        const weatherData = await weatherRes.json();
        const code = weatherData.current_weather.weathercode;
        
        if ([1, 2, 3, 45, 48].includes(code)) setLocalWeather('cloudy');
        else if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99].includes(code)) setLocalWeather('rain');
        else if ([71, 73, 75, 77, 85, 86].includes(code)) setLocalWeather('snow');
        else setLocalWeather('clear');
      } catch (err) {
        console.error('Error fetching weather:', err);
      }
    }
    fetchWeather();
  }, []);

  const stars = useMemo(() => [...Array(40)].map((_, i) => ({
    cx: Math.random() * 100,
    cy: Math.random() * 80,
    r: Math.random() * 1.5 + 0.5,
    dur: Math.random() * 4 + 2
  })), []);

  const clouds = useMemo(() => {
    return [...Array(12)].map((_, i) => ({
      d: [
        "M 30 70 A 20 20 0 0 1 25 35 A 25 25 0 0 1 65 20 A 25 25 0 0 1 95 35 A 20 20 0 0 1 100 70 Z",
        "M 40 80 A 25 25 0 0 1 35 40 A 35 35 0 0 1 85 25 A 30 30 0 0 1 125 45 A 25 25 0 0 1 130 80 Z",
        "M 35 65 A 20 20 0 0 1 25 35 A 30 30 0 0 1 70 15 A 25 25 0 0 1 105 30 A 25 25 0 0 1 120 65 Z"
      ][i % 3],
      scale: Math.random() * 2.5 + 1.5,
      dur: Math.random() * 120 + 180, // Slower clouds
      begin: Math.random() * 120,
      y: Math.random() * 200 - 20
    }));
  }, []);

  const rain = useMemo(() => [...Array(45)].map((_, i) => ({
    left: Math.random() * 120 - 10,
    dur: Math.random() * 0.8 + 0.6,
    delay: Math.random() * 5,
    width: Math.random() * 0.5 + 0.5,
    opacity: Math.random() * 0.3 + 0.1
  })), []);

  const snow = useMemo(() => [...Array(80)].map((_, i) => {
    const dur = Math.random() * 10 + 8;
    return {
      cx: Math.random() * 100,
      r: Math.random() * 2.5 + 1,
      dur: dur,
      sway: Math.random() * 8 + 3,
      opacity: Math.random() * 0.6 + 0.2,
      delay: Math.random() * dur
    };
  }), []);

  const renderWeatherEffects = () => {
    if (localWeather === 'loading') return null;

    const elements = [];

    if (localWeather === 'clear' && (!isDaytime && !isDawn && !isSunset)) {
      elements.push(stars.map((s, i) => (
        <circle key={`star-${i}`} cx={`${s.cx}%`} cy={`${s.cy}%`} r={s.r} fill="#fff">
          <animate attributeName="opacity" values="0.1; 0.8; 0.1" dur={`${s.dur}s`} repeatCount="indefinite" />
        </circle>
      )));
    }

    if (localWeather === 'cloudy' || localWeather === 'rain' || localWeather === 'snow' || (localWeather === 'clear' && (isDaytime || isDawn || isSunset))) {
      const cloudCount = (localWeather === 'cloudy' || localWeather === 'rain' || localWeather === 'snow') ? 12 : 4;
      const opacity = localWeather === 'clear' ? 0.3 : (isDaytime ? 0.5 : 0.25);
      elements.push(clouds.slice(0, cloudCount).map((c, i) => (
        <g key={`cloud-${i}`}>
          <animateTransform attributeName="transform" type="translate" from={`-300 ${c.y}`} to={`2000 ${c.y}`} dur={`${c.dur}s`} begin={`-${c.begin}s`} repeatCount="indefinite" />
          <path d={c.d} fill="#fff" opacity={opacity} transform={`scale(${c.scale})`} />
        </g>
      )));
    }

    if (localWeather === 'rain') {
      elements.push(rain.map((r, i) => (
        <g key={`rain-${i}`}>
          <line stroke="#a0c0d0" strokeWidth={r.width} opacity={r.opacity}>
            <animate attributeName="x1" from={`${r.left}%`} to={`${r.left - 20}%`} dur={`${r.dur}s`} begin={`${r.delay}s`} repeatCount="indefinite" />
            <animate attributeName="y1" from="-10%" to="110%" dur={`${r.dur}s`} begin={`${r.delay}s`} repeatCount="indefinite" />
            <animate attributeName="x2" from={`${r.left - 5}%`} to={`${r.left - 25}%`} dur={`${r.dur}s`} begin={`${r.delay}s`} repeatCount="indefinite" />
            <animate attributeName="y2" from="10%" to="130%" dur={`${r.dur}s`} begin={`${r.delay}s`} repeatCount="indefinite" />
          </line>
          <ellipse cx={`${r.left - 15}%`} cy="95%" rx="1" ry="0.5" fill="none" stroke="#a0c0d0" strokeWidth="1" opacity="0">
            <animate attributeName="opacity" values="0; 0.5; 0" dur={`${r.dur}s`} begin={`${r.delay}s`} repeatCount="indefinite" />
            <animate attributeName="rx" values="0; 10; 20" dur={`${r.dur}s`} begin={`${r.delay}s`} repeatCount="indefinite" />
            <animate attributeName="ry" values="0; 2.5; 5" dur={`${r.dur}s`} begin={`${r.delay}s`} repeatCount="indefinite" />
          </ellipse>
        </g>
      )));
    }

    if (localWeather === 'snow') {
      elements.push(snow.map((s, i) => (
        <circle key={`snow-${i}`} cx={`${s.cx}%`} cy="-10%" r={s.r} fill="#fff" opacity={s.opacity} filter="drop-shadow(0 0 2px rgba(255,255,255,0.8))">
          <animate attributeName="cy" from="-10%" to="110%" dur={`${s.dur}s`} begin={`-${s.delay}s`} repeatCount="indefinite" />
          <animate attributeName="cx" values={`${s.cx}%; ${s.cx + s.sway}%; ${s.cx - s.sway/2}%; ${s.cx}%`} dur={`${s.dur * 0.65}s`} begin={`-${s.delay}s`} repeatCount="indefinite" calcMode="spline" keyTimes="0; 0.333; 0.666; 1" keySplines="0.42 0 0.58 1; 0.42 0 0.58 1; 0.42 0 0.58 1" />
          <animate attributeName="opacity" values={`${s.opacity}; ${s.opacity * 0.3}; ${s.opacity}`} dur={`${s.dur * 0.5}s`} begin={`-${s.delay}s`} repeatCount="indefinite" />
        </circle>
      )));
    }
    
    return elements;
  };

  return (
    <PageWrapper 
      isLoading={isLoading}
      loadingTextEn="RETRIEVING ARCHIVES..."
      loadingTextEs="RECUPERANDO ARCHIVOS..."
      style={{ flex: 1, padding: 'clamp(2rem, 5vw, 4rem) clamp(1rem, 5vw, 2rem)', display: 'flex', flexDirection: 'column', position: 'relative', alignItems: 'center', width: '100%' }}
    >

      <AnimatePresence mode="wait">
        {showQuote && (
          <motion.div
            key={showSky ? 'waiting' : 'heavens'}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 0.5, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.8 }}
            style={{ 
              position: 'fixed', 
              top: '20px', 
              left: '50%', 
              transform: 'translateX(-50%)', 
              zIndex: 100, 
              fontFamily: 'var(--font-mono)', 
              fontSize: '0.65rem', 
              letterSpacing: '0.2em', 
              textTransform: 'uppercase', 
              pointerEvents: 'none' 
            }}
          >
            {showSky ? 'they are waiting' : 'somewhere in the heavens'}
          </motion.div>
        )}
      </AnimatePresence>

      <AmbientAudio src="/vinyl-crackle.mp3" volume={0.05} />
      <IndexScatter />
      
      {/* Full-width Sky Background */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          width: '100vw', 
          height: '40vh', 
          background: skyGradientBase, 
          zIndex: 0,
          pointerEvents: 'none',
          WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 50%, transparent 100%)',
          maskImage: 'linear-gradient(to bottom, black 0%, black 50%, transparent 100%)'
        }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: localWeather === 'loading' ? 0 : 1, background: skyGradientWeather }}
          transition={{ duration: 2, ease: "easeInOut" }}
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
        />

        <motion.svg 
          initial={{ opacity: 0 }}
          animate={{ opacity: localWeather === 'loading' || !showSky ? 0 : 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
        >
          {renderWeatherEffects()}
        </motion.svg>

        <motion.div 
          animate={localWeather === 'clear' || localWeather === 'loading' ? { rotate: 360, opacity: showSky ? 0.15 : 0 } : { rotate: 0, opacity: showSky ? 0.15 : 0 }} 
          transition={localWeather === 'clear' || localWeather === 'loading' ? { duration: 60, repeat: Infinity, ease: "linear" } : { duration: 0, ease: "linear" }}
          style={{ position: 'absolute', top: '15vh', right: '15vw', fontSize: '3.5rem', color: 'var(--text-color)', opacity: 0.15 }}
        >
          {skyIcon}
        </motion.div>
      </motion.div>

      {/* Main Content Card */}
      <div className="glass-panel" style={{
        maxWidth: '800px',
        margin: '0 auto',
        width: '100%',
        padding: 'clamp(1.5rem, 5vw, 3rem)',
        position: 'relative',
        zIndex: 10,
        flexShrink: 0,
        boxSizing: 'border-box'
      }}>
        <div style={{ marginBottom: '3rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
          <h1 style={{ fontSize: 'clamp(1.5rem, 8vw, 2.5rem)', letterSpacing: '0.2em', textTransform: 'uppercase', margin: 0 }}>
            {language === 'EN' ? 'Journal' : 'Diario'}
          </h1>
        </div>
        
        {!isLoading && (
          <motion.div variants={containerVariants} initial="hidden" animate="show" style={{ width: '100%' }}>
            <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>              <motion.button 
                whileHover={{ scale: 1.05, backgroundColor: 'var(--text-color)', color: 'var(--bg-color)' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { setShowSky(!showSky); setShowQuote(true); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-color)',
                  padding: '1rem clamp(1.5rem, 4vw, 3rem)',
                  cursor: 'pointer'
                }}
              >
                {showSky ? <FaEye size={16} /> : <FaEyeSlash size={16} />}
              </motion.button>
            </div>

            {chapters.filter(c => c.isVent).length === 0 && <p style={{ textAlign: 'center', fontStyle: 'italic', opacity: 0.5 }}>{language === 'EN' ? 'The journal is empty...' : 'El diario está vacío...'}</p>}
            
            {chapters
              .filter(c => c.isVent)
              .map((chapter, index) => {
              const isInt = chapter.isIntermission;
              const isVent = chapter.isVent;
              
              let linkPath = `/chapter/${chapter._id}`;
              if (isInt) linkPath = `/intermission/${chapter._id}`;
              if (isVent) linkPath = `/vent/${chapter._id}`;
              
              let icon = <FaBookOpen />;
              let iconColor = 'var(--text-color)';
              let numberText = String(index + 1).padStart(2, '0');
              
              if (isInt || isVent) {
                let sum = 0;
                for (let i = 0; i < chapter._id.length; i++) {
                  sum += chapter._id.charCodeAt(i);
                }
                if (isVent) {
                  const ventColors = ['#e6d15a', '#ff948d', '#8fc58f', '#7ec4a8', '#bed69b']; // slightly darker versions of post-its so text is readable
                  iconColor = ventColors[sum % ventColors.length];
                } else {
                  const t = (chapter.theme || '').toLowerCase();
                  if (t.includes('plane')) iconColor = '#8ecae6';
                  else if (t.includes('train')) iconColor = '#e63946';
                  else if (t.includes('bus')) iconColor = '#e9c46a';
                  else if (t.includes('boat')) iconColor = '#2a9d8f';
                  else if (t.includes('walking')) iconColor = '#f4a261';
                  else if (t.includes('car')) iconColor = '#e63946';
                  else {
                    const ticketColors = ['#e63946', '#2a9d8f', '#e9c46a', '#f4a261', '#8ecae6'];
                    iconColor = ticketColors[sum % ticketColors.length];
                  }
                }
              }
              
              if (isInt) { 
                icon = <FaTicketAlt />; 
                numberText = 'INT';
              } else if (isVent) {
                icon = <FaStickyNote />;
                numberText = 'VNT';
              }

              return (
                <motion.div variants={itemVariants} key={chapter._id} style={{ marginBottom: '1.5rem' }}>
                  <Link 
                    to={linkPath} 
                    onMouseEnter={() => {
                      if (!isInt && !isVent) {
                        api.get(`/poems?chapterId=${chapter._id}&lean=true`);
                      }
                    }}
                    style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}
                    className="index-item"
                  >
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'baseline', 
                      justifyContent: 'space-between',
                      width: '100%',
                      opacity: 1,
                      transition: 'opacity 0.3s ease'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'baseline', flexShrink: 1, paddingRight: '1rem' }}>
                        <span style={{ 
                          marginRight: '1rem',
                          color: (isInt || isVent) ? iconColor : (readChapters.includes(chapter._id) ? 'rgba(150, 150, 150, 0.4)' : iconColor),
                          fontSize: '0.9rem',
                          display: 'flex',
                          alignItems: 'center',
                          transform: 'translateY(2px)',
                          flexShrink: 0
                        }}>
                          {icon}
                        </span>

                        <span style={{ 
                          fontSize: '1.2rem', 
                          fontStyle: (isInt || isVent) ? 'italic' : 'normal',
                          fontWeight: (isInt || isVent) ? 'normal' : '500',
                          letterSpacing: '0.05em',
                          color: readChapters.includes(chapter._id) && !isInt && !isVent 
                            ? 'var(--text-color)' 
                            : 'inherit',
                          opacity: readChapters.includes(chapter._id) && !isInt && !isVent ? 0.5 : 1,
                          wordWrap: 'break-word',
                          overflowWrap: 'break-word',
                          wordBreak: 'break-word',
                          whiteSpace: 'normal'
                        }}>
                          {language === 'EN' && chapter.titleEn ? chapter.titleEn : chapter.title}
                        </span>
                      </div>
                      
                      <span className="toc-leader" style={{ opacity: 0.2 }}></span>
                      
                      {/* Only display numbers for chapters, not int/vents */}
                      {!isInt && !isVent && (
                        <span style={{ 
                          fontFamily: 'var(--font-mono)', 
                          fontSize: '1rem', 
                          opacity: readChapters.includes(chapter._id) ? 0.3 : 0.8,
                          letterSpacing: '0.1em',
                          color: 'var(--text-color)',
                          flexShrink: 0
                        }}>
                          {numberText}
                        </span>
                      )}
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>



      {/* Debug Buttons - Temporary (Dev Only) */}
      {import.meta.env.DEV && (
        <div style={{ position: 'fixed', bottom: '10px', right: '10px', zIndex: 100, display: 'flex', gap: '5px', opacity: 0.2, transition: 'opacity 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.opacity = 1} onMouseLeave={(e) => e.currentTarget.style.opacity = 0.2}>
          <button onClick={() => setLocalWeather('clear')} style={{ background: '#333', color: '#fff', border: 'none', padding: '5px', cursor: 'pointer', fontSize: '10px' }}>Clear</button>
          <button onClick={() => setLocalWeather('cloudy')} style={{ background: '#333', color: '#fff', border: 'none', padding: '5px', cursor: 'pointer', fontSize: '10px' }}>Cloudy</button>
          <button onClick={() => setLocalWeather('rain')} style={{ background: '#333', color: '#fff', border: 'none', padding: '5px', cursor: 'pointer', fontSize: '10px' }}>Rain</button>
          <button onClick={() => setLocalWeather('snow')} style={{ background: '#333', color: '#fff', border: 'none', padding: '5px', cursor: 'pointer', fontSize: '10px' }}>Snow</button>
        </div>
      )}
    </PageWrapper>
  );
}

export default React.memo(JournalView);
