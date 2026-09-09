import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import CassetteModal from './CassetteModal';

const CassetteItem = ({ track }) => {
  const [isOpen, setIsOpen] = useState(false);
  const layoutIdId = `cassette-${track._id}`;
  
  return (
    <>
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
          top: '25.5%',
          left: '17%',
          width: '66%',
          height: '24%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          fontFamily: 'monospace',
          color: '#222',
          textAlign: 'center',
          padding: '0.2rem',
          boxSizing: 'border-box'
        }}>
          <strong style={{ fontSize: '1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>{track.title}</strong>
          <span style={{ fontSize: '0.8rem', opacity: 0.8, marginTop: '2px' }}>{track.artist}</span>
        </div>
      </motion.div>

      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {isOpen && (
            <CassetteModal 
              layoutIdId={layoutIdId}
              track={track}
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
