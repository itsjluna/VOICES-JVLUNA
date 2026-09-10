import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import CassetteModal from './CassetteModal';

const CassetteItem = ({ track, animColor, isActive, onMakeActive }) => {
  const [isOpen, setIsOpen] = useState(false);
  const layoutIdId = `cassette-${track._id}`;
  
  return (
    <>
      <motion.div
        layoutId={layoutIdId}
        onClick={(e) => {
          if (!isActive && onMakeActive) {
            e.stopPropagation();
            onMakeActive();
          } else if (isActive) {
            setIsOpen(true);
          }
        }}
        whileHover={{ scale: isActive ? 1.05 : 1 }}
        whileTap={{ scale: isActive ? 0.95 : 1 }}
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '1.57 / 1',
          cursor: isActive ? 'pointer' : 'default',
          margin: '0 auto',
          transformStyle: 'preserve-3d'
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
          whiteSpace: 'nowrap',
          pointerEvents: 'none'
        }}>
          <span style={{ display: 'block', width: '100%', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '1.1rem' }}>{track.title} - {track.artist}</span>
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
