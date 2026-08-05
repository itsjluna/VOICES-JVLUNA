import React, { useEffect, useState, useMemo } from 'react';

// Unified Window Frame that wraps every season
const WindowFrame = ({ children, isNight }) => {
  const windowStroke = isNight ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.8)";
  const windowFill = isNight ? "#050510" : "#e0e5ec";

  return (
    <svg style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh', zIndex: -1, opacity: 0.8 }} preserveAspectRatio="xMidYMid slice" viewBox="0 0 1000 1000">
      {/* Base Background color for the outside */}
      <rect x="0" y="0" width="1000" height="1000" fill={windowFill} />
      
      {/* The Environment / Weather inside the window */}
      {children}

      {/* Massive Brutalist Concrete Window Frame */}
      <path d="M 0 0 L 1000 0 L 1000 1000 L 0 1000 Z M 100 100 L 100 900 L 900 900 L 900 100 Z" fill="var(--bg-color)" />
      
      {/* Window Panes (Mullions) */}
      <path d="M 366 100 L 366 900 M 633 100 L 633 900" stroke="var(--bg-color)" strokeWidth="30" />
      <path d="M 100 500 L 900 500" stroke="var(--bg-color)" strokeWidth="30" />

      {/* Subtle glass reflections */}
      <path d="M 120 120 L 300 300 M 400 120 L 550 270 M 670 120 L 850 300" stroke={windowStroke} strokeWidth="4" opacity="0.1" />
      <path d="M 120 520 L 300 700 M 400 520 L 550 700 M 670 520 L 850 700" stroke={windowStroke} strokeWidth="4" opacity="0.1" />
    </svg>
  );
};

export const Winter = React.memo(() => {
  const snowflakes = useMemo(() => {
    return [...Array(50)].map((_, i) => (
      <circle 
        key={i} 
        cx={Math.random() * 800 + 100} 
        cy={Math.random() * -1000} 
        r={Math.random() * 3 + 1} 
        fill="#fff"
      >
        <animate attributeName="cy" from="-100" to="1100" dur={`${Math.random() * 10 + 5}s`} repeatCount="indefinite" />
        <animate attributeName="cx" values={`${Math.random() * 800 + 100}; ${Math.random() * 800 + 100 + 50}; ${Math.random() * 800 + 100}`} dur={`${Math.random() * 5 + 3}s`} repeatCount="indefinite" />
      </circle>
    ));
  }, []);

  return (
    <WindowFrame isNight={false}>
      {/* Frozen Lake & Mountains */}
      <path d="M 100 700 L 900 700" stroke="#a0b0c0" strokeWidth="2" />
      <path d="M 100 650 Q 250 550 400 650 T 700 600 T 900 650" fill="none" stroke="#a0b0c0" strokeWidth="3" />
      
      {/* Falling Snow Animation */}
      <g opacity="0.8">
        {snowflakes}
      </g>
    </WindowFrame>
  );
});

export const Spring = React.memo(() => {
  const dandelions = useMemo(() => {
    return [...Array(100)].map((_, i) => {
      const left = -100 - Math.random() * 500;
      const top = Math.random() * 800 + 100;
      const delay = Math.random() * 10;
      const dur = Math.random() * 8 + 6;
      const opacity = Math.random() * 0.4 + 0.6;
      const scale = Math.random() * 0.8 + 0.8;

      return (
        <g key={i} opacity={opacity}>
          <animateTransform 
            attributeName="transform" 
            type="translate" 
            from={`${left} ${top}`} 
            to={`${left + 1200} ${top - 200 + Math.random() * 400}`} 
            dur={`${dur}s`} 
            begin={`-${delay}s`} 
            repeatCount="indefinite" 
          />
          <g transform={`scale(${scale})`}>
            <circle cx="0" cy="0" r="1.5" fill="#fff" />
            <path d="M 0 0 L -3 -5 M 0 0 L 0 -6 M 0 0 L 3 -5 M 0 0 L -4 -2 M 0 0 L 4 -2" stroke="#fff" strokeWidth="0.5" opacity="0.8" />
            <path d="M 0 0 L 0 8" stroke="#ccc" strokeWidth="0.5" />
          </g>
        </g>
      );
    });
  }, []);

  return (
    <WindowFrame isNight={false}>
      {/* Thawed Lake & Mountains */}
      <path d="M 100 700 Q 300 710 500 700 T 900 700" fill="none" stroke="#7a9080" strokeWidth="2" />
      <path d="M 100 720 Q 300 730 500 720 T 900 720" fill="none" stroke="#7a9080" strokeWidth="1" opacity="0.5" />
      <path d="M 100 650 Q 250 550 400 650 T 700 600 T 900 650" fill="none" stroke="#7a9080" strokeWidth="3" />

      {/* Tiny Sprout on windowsill */}
      <path d="M 480 885 Q 490 860 500 885 Q 510 860 520 885" fill="none" stroke="#5a9c60" strokeWidth="2" />
      <path d="M 500 885 L 500 900" stroke="#5a9c60" strokeWidth="2" />

      {/* Summer Dandelions Flying */}
      <g>
        {dandelions}
      </g>
    </WindowFrame>
  );
});

export const Summer = React.memo(() => {
  const [isNight, setIsNight] = useState(false);
  
  useEffect(() => {
    const hour = new Date().getHours();
    setIsNight(hour < 6 || hour > 19);
  }, []);

  const fireflies = useMemo(() => {
    return [...Array(30)].map((_, i) => (
      <circle 
        key={i} 
        cx={Math.random() * 800 + 100} 
        cy={Math.random() * 300 + 600} 
        r={Math.random() * 3 + 1} 
        fill="#ffff99"
      >
        <animate attributeName="opacity" values="0.2; 1; 0.2" dur={`${Math.random() * 3 + 2}s`} repeatCount="indefinite" />
        <animate attributeName="cy" values={`${Math.random() * 300 + 600}; ${Math.random() * 300 + 550}; ${Math.random() * 300 + 600}`} dur={`${Math.random() * 5 + 4}s`} repeatCount="indefinite" />
      </circle>
    ));
  }, []);

  return (
    <WindowFrame isNight={isNight}>
      {/* Lake & Mountains */}
      <path d="M 100 700 L 900 700" stroke={isNight ? "#4a4a6a" : "#d0b070"} strokeWidth="2" />
      <path d="M 100 650 Q 250 550 400 650 T 700 600 T 900 650" fill="none" stroke={isNight ? "#4a4a6a" : "#d0b070"} strokeWidth="3" />

      {!isNight ? (
        /* Blazing Sun Beams */
        <g opacity="0.15">
          <polygon points="100,100 300,100 900,900 700,900" fill="#ffdd55" />
          <polygon points="400,100 500,100 900,700 800,700" fill="#ffdd55" />
        </g>
      ) : (
        /* Fireflies */
        <g>
          {fireflies}
        </g>
      )}
    </WindowFrame>
  );
});

export const Autumn = React.memo(() => {
  const leaves = useMemo(() => {
    return [...Array(20)].map((_, i) => (
      <path 
        key={i} 
        d="M 0 0 Q 5 10 10 0 Q 5 -10 0 0" 
        fill="#d06040"
      >
        <animateTransform 
          attributeName="transform" 
          type="translate" 
          from={`${-100 - Math.random() * 200} ${Math.random() * 800 + 100}`} 
          to={`${1100 + Math.random() * 200} ${Math.random() * 800 + 100}`} 
          dur={`${Math.random() * 8 + 4}s`} 
          repeatCount="indefinite" 
        />
        <animateTransform 
          attributeName="transform" 
          type="rotate" 
          from="0" 
          to="360" 
          dur={`${Math.random() * 3 + 1}s`} 
          repeatCount="indefinite" 
          additive="sum"
        />
      </path>
    ));
  }, []);

  return (
    <WindowFrame isNight={false}>
      {/* Lake & Mountains */}
      <path d="M 100 700 L 900 700" stroke="#b07050" strokeWidth="2" />
      <path d="M 100 710 Q 300 700 500 710 T 900 700" fill="none" stroke="#b07050" strokeWidth="1" opacity="0.5" />
      <path d="M 100 650 Q 250 550 400 650 T 700 600 T 900 650" fill="none" stroke="#b07050" strokeWidth="3" />

      {/* Blowing Leaves Animation */}
      <g opacity="0.7">
        {leaves}
      </g>
    </WindowFrame>
  );
});

// --- NEW POEM ABSTRACT BACKGROUNDS --- //

export const AmbientDust = React.memo(() => {
  const dust = useMemo(() => {
    return [...Array(60)].map((_, i) => (
      <circle 
        key={i} 
        cx={Math.random() * 100} 
        cy={Math.random() * 100} 
        r={Math.random() * 0.3 + 0.1} 
        fill="#ffffff"
      >
        <animate attributeName="opacity" values="0; 0.6; 0" dur={`${Math.random() * 5 + 4}s`} repeatCount="indefinite" begin={`-${Math.random() * 5}s`} />
        <animateTransform attributeName="transform" type="translate" from="0 0" to={`${Math.random() * 10 - 5} ${Math.random() * 10 - 5}`} dur={`${Math.random() * 10 + 10}s`} repeatCount="indefinite" />
      </circle>
    ));
  }, []);

  return (
    <svg style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh', zIndex: -1, pointerEvents: 'none', background: 'radial-gradient(circle at center, #1a1a24 0%, #0d0d12 100%)' }} viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
      <g opacity="0.3">
        <polygon points="0,0 100,0 50,100" fill="url(#lightRay)" />
      </g>
      <defs>
        <linearGradient id="lightRay" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      {dust}
    </svg>
  );
});

export const DawnLight = React.memo(() => {
  const dust = useMemo(() => {
    return [...Array(50)].map((_, i) => (
      <circle 
        key={i} 
        cx={Math.random() * 100} 
        cy={Math.random() * 100} 
        r={Math.random() * 0.4 + 0.1} 
        fill="#ffebd6"
      >
        <animate attributeName="opacity" values="0; 0.8; 0" dur={`${Math.random() * 6 + 3}s`} repeatCount="indefinite" begin={`-${Math.random() * 5}s`} />
        <animateTransform attributeName="transform" type="translate" from="0 0" to={`${Math.random() * 15 - 5} -${Math.random() * 10 + 5}`} dur={`${Math.random() * 15 + 10}s`} repeatCount="indefinite" />
      </circle>
    ));
  }, []);

  return (
    <svg style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh', zIndex: -1, pointerEvents: 'none', background: 'radial-gradient(circle at top left, #fff0e0 0%, #f4d3b6 30%, #e6a788 70%, #d8816c 100%)' }} viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
      <defs>
        <radialGradient id="sunFlare" cx="20%" cy="20%" r="50%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
          <stop offset="30%" stopColor="#ffebb3" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#ffebb3" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect x="0" y="0" width="100" height="100" fill="url(#sunFlare)" />
      
      {/* Lens Flares */}
      <circle cx="30" cy="30" r="15" fill="#ffffff" opacity="0.05" />
      <circle cx="45" cy="45" r="5" fill="#ffd599" opacity="0.1" />
      <circle cx="60" cy="60" r="2" fill="#ffd599" opacity="0.15" />
      <circle cx="65" cy="65" r="8" fill="#ffffff" opacity="0.05" />
      
      {dust}
    </svg>
  );
});

export const DigitalMatrix = React.memo(() => {
  const lines = useMemo(() => {
    return [...Array(40)].map((_, i) => (
      <line 
        key={i} 
        x1={Math.random() * 100} 
        y1="-10" 
        x2={Math.random() * 100} 
        y2="110" 
        stroke="#44aa66" 
        strokeWidth={Math.random() * 0.2 + 0.05} 
        strokeDasharray={`${Math.random() * 10 + 5} ${Math.random() * 20 + 10}`}
      >
        <animate attributeName="stroke-dashoffset" from="100" to="0" dur={`${Math.random() * 10 + 5}s`} repeatCount="indefinite" />
      </line>
    ));
  }, []);

  return (
    <svg style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh', zIndex: -1, pointerEvents: 'none', background: '#050a05' }} viewBox="0 0 100 100" preserveAspectRatio="none">
      <g opacity="0.4">
        {lines}
      </g>
    </svg>
  );
});

export const Embers = React.memo(() => {
  const embers = useMemo(() => {
    return [...Array(50)].map((_, i) => (
      <circle 
        key={i} 
        cx={Math.random() * 100} 
        cy="110" 
        r={Math.random() * 0.4 + 0.1} 
        fill="#ff6622"
      >
        <animateTransform attributeName="transform" type="translate" from="0 0" to={`${Math.random() * 20 - 10} -120`} dur={`${Math.random() * 8 + 6}s`} begin={`-${Math.random() * 10}s`} repeatCount="indefinite" />
        <animate attributeName="opacity" values="0; 1; 0" dur={`${Math.random() * 4 + 2}s`} repeatCount="indefinite" />
      </circle>
    ));
  }, []);

  return (
    <svg style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh', zIndex: -1, pointerEvents: 'none', background: '#0a0500' }} viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
      <defs>
        <radialGradient id="glow" cx="50%" cy="100%" r="50%">
          <stop offset="0%" stopColor="#ff4400" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#ff4400" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect x="0" y="0" width="100" height="100" fill="url(#glow)" />
      {embers}
    </svg>
  );
});

export const Clocks = React.memo(() => {
  const clocks = useMemo(() => {
    return [...Array(25)].map((_, i) => (
      <g key={i} opacity={Math.random() * 0.4 + 0.1}>
        <animateTransform attributeName="transform" type="translate" from={`${Math.random() * 100} 110`} to={`${Math.random() * 100} -20`} dur={`${Math.random() * 20 + 20}s`} begin={`${Math.random() * -30}s`} repeatCount="indefinite" />
        <g transform={`scale(${Math.random() * 0.5 + 0.5}) rotate(${Math.random() * 360})`}>
          <circle cx="0" cy="0" r="8" fill="none" stroke="#8b7d6b" strokeWidth="1" />
          <circle cx="0" cy="0" r="7" fill="#1a1511" />
          <line x1="0" y1="0" x2="0" y2="-4" stroke="#c2a78a" strokeWidth="1" strokeLinecap="round">
            <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur={`${Math.random() * 5 + 5}s`} repeatCount="indefinite" />
          </line>
          <line x1="0" y1="0" x2="3" y2="0" stroke="#c2a78a" strokeWidth="1" strokeLinecap="round">
            <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur={`${Math.random() * 30 + 30}s`} repeatCount="indefinite" />
          </line>
          <circle cx="0" cy="0" r="1" fill="#8b7d6b" />
        </g>
      </g>
    ));
  }, []);
  return (
    <svg style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh', zIndex: -1, pointerEvents: 'none', background: '#0a0908' }} viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
      {clocks}
    </svg>
  );
});
