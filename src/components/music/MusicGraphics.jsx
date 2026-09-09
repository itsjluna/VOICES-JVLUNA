import React, { useMemo } from 'react';

export const MusicGraphics = React.memo(({ color }) => {
  const Equalizer = () => {
    const bars = useMemo(() => {
      const b = [];
      for (let i = 0; i < 40; i++) {
        b.push({
          id: `bar-${i}`,
          x: 20 + i * 48,
          h1: Math.random() * 100 + 20,
          h2: Math.random() * 200 + 50,
          h3: Math.random() * 50 + 10,
          dur: Math.random() * 2.0 + 1.5
        });
      }
      return b;
    }, []);

    return (
      <svg style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '50%', willChange: 'transform' }} preserveAspectRatio="none" viewBox="0 0 1920 400">
        <defs>
          <linearGradient id="eq-grad" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor={color || 'var(--text-color)'} stopOpacity="0" />
            <stop offset="50%" stopColor={color || 'var(--text-color)'} stopOpacity="0.25" />
            <stop offset="100%" stopColor={color || 'var(--text-color)'} stopOpacity="0.6" />
          </linearGradient>
        </defs>
        {bars.map(bar => (
          <rect key={bar.id} x={bar.x} y="400" width="30" fill="url(#eq-grad)" rx="15">
            <animate 
              attributeName="y" 
              values={`400; ${400 - bar.h1}; ${400 - bar.h2}; ${400 - bar.h3}; 400`} 
              dur={`${bar.dur}s`} 
              repeatCount="indefinite" 
              calcMode="spline"
              keySplines="0.4 0 0.2 1; 0.4 0 0.2 1; 0.4 0 0.2 1; 0.4 0 0.2 1"
            />
            <animate 
              attributeName="height" 
              values={`0; ${bar.h1}; ${bar.h2}; ${bar.h3}; 0`} 
              dur={`${bar.dur}s`} 
              repeatCount="indefinite" 
              calcMode="spline"
              keySplines="0.4 0 0.2 1; 0.4 0 0.2 1; 0.4 0 0.2 1; 0.4 0 0.2 1"
            />
          </rect>
        ))}
      </svg>
    );
  };

  const BouncingLogo = () => {
    return (
      <div style={{
        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'hidden'
      }}>
        <div style={{
          animation: 'bounceX 13s linear infinite alternate',
          position: 'absolute', top: 0, left: 0,
        }}>
          <div style={{
            animation: 'bounceY 9s linear infinite alternate',
            position: 'absolute', top: 0, left: 0,
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '180px',
              height: '60px',
              color: color || 'var(--text-color)',
              fontFamily: 'monospace',
              fontWeight: 'bold',
              fontSize: '1.5rem',
              border: `2px solid ${color || 'var(--text-color)'}`,
              borderRadius: '8px',
              opacity: 0.8,
              transition: 'all 0.5s ease',
              background: 'rgba(0,0,0,0.3)',
              backdropFilter: 'blur(4px)',
              transform: 'perspective(500px) rotateX(15deg) rotateY(-20deg)',
              boxShadow: `
                1px 1px 0px ${color || 'var(--text-color)'},
                2px 2px 0px ${color || 'var(--text-color)'},
                3px 3px 0px ${color || 'var(--text-color)'},
                4px 4px 0px ${color || 'var(--text-color)'},
                5px 5px 0px ${color || 'var(--text-color)'},
                10px 10px 20px rgba(0,0,0,0.5)
              `,
              textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
            }}>
              VIOLET/A
            </div>
          </div>
        </div>
        <style>
          {`
            @keyframes bounceX {
              0% { transform: translateX(0vw); }
              100% { transform: translateX(calc(100vw - 180px)); }
            }
            @keyframes bounceY {
              0% { transform: translateY(0vh); }
              100% { transform: translateY(calc(100vh - 60px)); }
            }
          `}
        </style>
      </div>
    );
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', overflow: 'hidden', pointerEvents: 'none', zIndex: -1, opacity: 0.8 }}>
      <BouncingLogo />
      <Equalizer />
      <div style={{ position: 'absolute', top: '2rem', right: '2rem', fontFamily: 'monospace', fontSize: '0.75rem', color: color || 'var(--text-color)', opacity: 0.7, textAlign: 'right', transition: 'color 0.5s ease' }}>
        SYS_M: AUDIO_LIB<br />
        T_MODE: CASSETTE<br />
        VIOLET/A
      </div>
    </div>
  );
});
