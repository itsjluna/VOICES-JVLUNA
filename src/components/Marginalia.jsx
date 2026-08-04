import React, { useState, useEffect } from 'react';

const Paperclip = ({ style }) => (
  <svg style={{ position: 'absolute', opacity: 0.2, zIndex: 0, ...style }} width="40" height="100" viewBox="0 0 40 100" fill="none" stroke="#9ca3af" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M 20 10 L 20 80 Q 20 90 10 90 Q 0 90 0 80 L 0 20 Q 0 0 20 0 Q 40 0 40 20 L 40 70 Q 40 85 25 85 Q 10 85 10 70 L 10 30" />
  </svg>
);

const PressedLeaf = ({ style }) => (
  <svg style={{ position: 'absolute', opacity: 0.15, zIndex: 0, ...style }} width="100" height="150" viewBox="0 0 100 150" fill="#f0fdf4" stroke="#86efac" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    <path d="M 50 140 L 50 100" stroke="#4ade80" strokeWidth="2" />
    <path d="M 50 100 C 10 100, 0 50, 50 10 C 100 50, 90 100, 50 100" fill="#dcfce7" />
    <path d="M 50 100 Q 40 70 20 60" />
    <path d="M 50 90 Q 60 60 80 50" />
    <path d="M 50 60 Q 45 40 30 30" />
    <path d="M 50 50 Q 55 30 70 20" />
    <path d="M 50 10 L 50 100" stroke="#4ade80" strokeDasharray="2 4" />
  </svg>
);

const TornBookmark = ({ style, color }) => (
  <svg style={{ position: 'absolute', opacity: 0.8, zIndex: 0, ...style }} width="60" height="200" viewBox="0 0 60 200" fill={color || '#fef08a'}>
    <path d="M 0 0 L 60 0 L 60 180 L 50 190 L 40 185 L 30 195 L 20 185 L 10 195 L 0 180 Z" />
    <path d="M 0 0 L 60 0 L 60 180 L 50 190 L 40 185 L 30 195 L 20 185 L 10 195 L 0 180 Z" fill="url(#torn-texture)" opacity="0.2"/>
    <defs>
      <pattern id="torn-texture" patternUnits="userSpaceOnUse" width="4" height="4">
        <path d="M 0 4 L 4 0" stroke="rgba(0,0,0,0.1)" strokeWidth="1" />
      </pattern>
    </defs>
  </svg>
);

const Asterisk = ({ style }) => (
  <svg style={{ position: 'absolute', opacity: 0.3, zIndex: 0, ...style }} width="30" height="30" viewBox="0 0 30 30" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M 15 5 L 15 25 M 5 15 L 25 15 M 8 8 L 22 22 M 8 22 L 22 8" />
  </svg>
);

const CoffeeStain = ({ style }) => (
  <svg style={{ position: 'absolute', opacity: 0.1, zIndex: 0, ...style }} width="150" height="150" viewBox="0 0 150 150" fill="none" stroke="#78350f" strokeWidth="2">
    <circle cx="75" cy="75" r="60" strokeDasharray="10 5 30 5" strokeWidth="4" />
    <circle cx="78" cy="72" r="58" strokeWidth="1" opacity="0.5" />
    <path d="M 120 100 Q 130 110 140 100" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

const DoodleSwirl = ({ style }) => (
  <svg style={{ position: 'absolute', opacity: 0.2, zIndex: 0, ...style }} width="100" height="100" viewBox="0 0 100 100" fill="none" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M 10 50 C 10 20, 90 20, 90 50 C 90 80, 30 80, 30 50 C 30 30, 70 30, 70 50 C 70 65, 45 65, 45 50" />
  </svg>
);

const WashiTape = ({ style, color }) => (
  <svg style={{ position: 'absolute', opacity: 0.6, zIndex: 1, ...style }} width="120" height="30" viewBox="0 0 120 30" fill={color || '#fbcfe8'}>
    <path d="M 2 0 L 118 2 L 120 28 L 0 30 Z" />
    <path d="M 2 0 L 118 2 L 120 28 L 0 30 Z" fill="url(#washi-texture)" opacity="0.3"/>
    <defs>
      <pattern id="washi-texture" patternUnits="userSpaceOnUse" width="10" height="10">
        <circle cx="2" cy="2" r="1" fill="rgba(255,255,255,0.4)" />
      </pattern>
    </defs>
  </svg>
);

const Marginalia = () => {
  const [elements, setElements] = useState([]);

  useEffect(() => {
    // Generate 2-4 random marginalia elements on mount
    const numElements = Math.floor(Math.random() * 3) + 2;
    const components = [Paperclip, PressedLeaf, TornBookmark, Asterisk, CoffeeStain, DoodleSwirl, WashiTape];
    const pastelColors = ['#fdfd96', '#ffb7b2', '#c1e1c1', '#b5ead7', '#e2f0cb', '#fbcfe8', '#bfdbfe'];
    
    const newElements = Array.from({ length: numElements }).map((_, i) => {
      const Component = components[Math.floor(Math.random() * components.length)];
      const style = {
        top: `${Math.random() * 80 + 10}%`,
        left: `${Math.random() * 80 + 10}%`,
        transform: `rotate(${Math.random() * 360}deg)`,
      };
      const randomColor = pastelColors[Math.floor(Math.random() * pastelColors.length)];
      return <Component key={i} style={style} color={randomColor} />;
    });

    setElements(newElements);
  }, []);

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'hidden', borderRadius: 'inherit', zIndex: 0 }}>
      {elements}
    </div>
  );
};

export default React.memo(Marginalia);
