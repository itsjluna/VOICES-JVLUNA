import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import CassetteModal from './CassetteModal';

const CassetteItem = ({ track, animColor }) => {
  const [isOpen, setIsOpen] = useState(false);
  const layoutIdId = `cassette-${track._id}`;
  
  return (
    <>
      <style>{`
        .cassette-label-text {
          font-size: 1.1rem;
        }
        @media (min-width: 600px) {
          .cassette-label-text { font-size: 0.8rem; }
        }
        @media (min-width: 960px) {
          .cassette-label-text { font-size: 0.7rem; }
        }
        @media (min-width: 1280px) {
          .cassette-label-text { font-size: 0.65rem; }
        }
      `}</style>

      <motion.div
        layoutId={layoutIdId}
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '350px',
          cursor: 'pointer',
          margin: '0 auto',
          filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.3))'
        }}
      >
        <img src="/media/cassette.png" alt="Cassette Tape" style={{ width: '100%', display: 'block' }} draggable="false" />
        <div style={{
          position: 'absolute',
          top: '16.5%',
          left: '17%',
          width: '66%',
          height: '24%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          fontFamily: '"Permanent Marker", cursive',
          color: '#111',
          textAlign: 'center',
          padding: '0.2rem',
          boxSizing: 'border-box',
          whiteSpace: 'nowrap'
        }}>
          <span className="cassette-label-text" style={{ display: 'block', width: '100%', overflow: 'hidden', textOverflow: 'ellipsis' }}>{track.title} - {track.artist}</span>
        </div>
      </motion.div>

      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {isOpen && (
            <CassetteModal 
              layoutIdId={layoutIdId}
              track={track}
              animColor={animColor}
              onClose={() => setIsOpen(false)}
            />
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
};

export default CassetteItem;

