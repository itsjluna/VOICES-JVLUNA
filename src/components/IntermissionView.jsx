import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaPlane, FaTrain, FaBus } from 'react-icons/fa';
import api from '../api';
import Polaroid from './Polaroid';
import { TravelGraphics } from './TravelGraphics';
import { useReadingProgress } from '../hooks/useReadingProgress';

const ticketTypes = ['plane', 'train', 'train-cherry', 'bus'];
const accentColors = ['#e63946', '#2a9d8f', '#e9c46a', '#f4a261', '#264653', '#8338ec', '#ff006e', '#fb8500', '#023047', '#8ecae6'];

function IntermissionView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [intermission, setIntermission] = useState(null);
  const [passenger, setPassenger] = useState('WANDERING SOUL');
  const { markAsRead } = useReadingProgress();
  
  const ticketType = useMemo(() => {
    if (intermission?.theme && ticketTypes.includes(intermission.theme)) {
      return intermission.theme;
    }
    if (!id) return 'plane';
    const sum = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return ticketTypes[sum % ticketTypes.length];
  }, [id, intermission]);

  const accentColor = useMemo(() => {
    if (!id) return accentColors[0];
    const sum = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return accentColors[sum % accentColors.length];
  }, [id]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await api.get('/chapters'); // Since intermissions are chapters
        const found = res.data.find(c => c._id === id);
        setIntermission(found);
      } catch (err) {
        console.error(err);
      }
      if (id) markAsRead(id);
    }
    
    async function fetchIp() {
      try {
        const res = await fetch('https://api.ipify.org?format=json');
        const data = await res.json();
        setPassenger(`IP: ${data.ip}`);
      } catch (err) {
        setPassenger('UNKNOWN TRAVELER');
      }
    }

    fetchData();
    fetchIp();
  }, [id]);

  if (!intermission) return <div style={{ padding: '2rem' }}>Loading Intermission...</div>;

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}
      style={{ flex: 1, padding: '2rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}
    >
      <TravelGraphics type={ticketType} />
      <button style={{ alignSelf: 'flex-start', marginBottom: '2rem', border: 'none', padding: '0', textDecoration: 'underline', position: 'relative', zIndex: 10 }} onClick={() => navigate(-1)}>
        &larr; Back
      </button>

      <div className="intermission-collage">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
          className={`ticket-container ticket-${ticketType}`}
          style={{ borderLeft: `8px solid ${accentColor}` }}
        >
          <div className="passport-stamp" style={{ borderColor: accentColor, color: accentColor }}>
            BOARDED
            <br />
            {id.toUpperCase().slice(-4)}
          </div>
          <div className="ticket-header" style={{ background: accentColor, color: '#fff' }}>
            <span className="ticket-logo" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {ticketType === 'plane' && <><FaPlane /> AIRWAYS BOARDING PASS</>}
              {ticketType.startsWith('train') && <><FaTrain /> RAILWAY EXPRESS TICKET</>}
              {ticketType === 'bus'   && <><FaBus /> INTERCITY COACH PASS</>}
            </span>
            <span className="ticket-class">FIRST CLASS</span>
          </div>
          
          <div className="ticket-body">
            <div className="ticket-info">
              <div className="ticket-field">
                <label>PASSENGER</label>
                <div className="value">{passenger}</div>
              </div>
              <div className="ticket-field">
                <label style={{ color: accentColor }}>DESTINATION</label>
                <div className="value">{intermission.title.toUpperCase()}</div>
              </div>
            </div>

            <div className="ticket-content">
              <h1 className="intermission-title">{intermission.title}</h1>
              <div className="poem-text" dangerouslySetInnerHTML={{ __html: intermission.content }} />
            </div>
          </div>
          
          <div className="ticket-stub">
            <div className="barcode"></div>
            <div className="stub-text" style={{ color: accentColor }}>{id.toUpperCase().slice(-8)}</div>
          </div>
        </motion.div>

        {intermission.image && (
          <motion.div 
            initial={{ opacity: 0, x: 50 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 1, delay: 0.6 }}
            className="intermission-polaroid"
          >
            <Polaroid src={intermission.image} alt={intermission.title} containerStyle={{ margin: 0, boxShadow: '0 20px 40px rgba(0,0,0,0.3)', position: 'relative', zIndex: 1 }} />
            
            {/* Metallic Paperclip (Clipping to the ticket on the left) */}
            <svg 
              viewBox="0 0 120 200" 
              style={{ 
                position: 'absolute', 
                top: '20px', 
                left: '-20px', 
                width: '35px', 
                height: '70px', 
                transform: 'rotate(-25deg)',
                zIndex: 10,
                filter: 'drop-shadow(2px 4px 3px rgba(0,0,0,0.3))'
              }}
            >
              <path d="M45,45 L45,150 A15,15 0 0,0 75,150 L75,30 A25,25 0 0,0 25,30 L25,160 A35,35 0 0,0 95,160 L95,55" fill="none" stroke="#bdc3c7" strokeWidth="8" strokeLinecap="round" />
              <path d="M45,45 L45,150 A15,15 0 0,0 75,150 L75,30 A25,25 0 0,0 25,30 L25,160 A35,35 0 0,0 95,160 L95,55" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" opacity="0.5" transform="translate(-1, -1)" />
            </svg>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

export default React.memo(IntermissionView);
