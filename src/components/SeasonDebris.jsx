import React, { useMemo } from 'react';

// Renders randomized physical aesthetic items based on the season
export const SeasonDebris = React.memo(({ theme }) => {
  
  // WINTER: Intricate Snowflakes, Ice Splinters, & Bokeh Snow Orbs
  const WinterFrost = useMemo(() => {
    return [...Array(20)].map((_, i) => {
      const top = Math.random() * 100;
      const left = Math.random() * 100;
      const rotate = Math.random() * 360;
      const size = Math.random() * 40 + 10;
      const type = Math.random();
      
      return (
        <svg key={i} width={size} height={size} style={{ position: 'absolute', top: `${top}vh`, left: `${left}vw`, opacity: Math.random() * 0.4 + 0.3, transform: `rotate(${rotate}deg)`, willChange: 'transform' }} viewBox="0 0 100 100">
          {type > 0.7 ? (
            // Intricate Snowflake
            <>
              <defs>
                <g id={`branch-${i}`}>
                  <line x1="50" y1="50" x2="50" y2="10" stroke="#7fb3d5" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="50" y1="30" x2="35" y2="15" stroke="#7fb3d5" strokeWidth="2" strokeLinecap="round" />
                  <line x1="50" y1="30" x2="65" y2="15" stroke="#7fb3d5" strokeWidth="2" strokeLinecap="round" />
                  <line x1="50" y1="40" x2="40" y2="30" stroke="#7fb3d5" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="50" y1="40" x2="60" y2="30" stroke="#7fb3d5" strokeWidth="1.5" strokeLinecap="round" />
                </g>
              </defs>
              <use href={`#branch-${i}`} />
              <use href={`#branch-${i}`} transform="rotate(60 50 50)" />
              <use href={`#branch-${i}`} transform="rotate(120 50 50)" />
              <use href={`#branch-${i}`} transform="rotate(180 50 50)" />
              <use href={`#branch-${i}`} transform="rotate(240 50 50)" />
              <use href={`#branch-${i}`} transform="rotate(300 50 50)" />
            </>
          ) : type > 0.4 ? (
            // Ice Splinter
            <path d="M 45 10 L 55 10 L 52 90 L 48 90 Z" fill="#5499c7" opacity="0.6" />
          ) : (
            // Optimized Bokeh Orb (No Blur Filter)
            <circle cx="50" cy="50" r="30" fill="#a9cce3" opacity="0.2" />
          )}
        </svg>
      );
    });
  }, []);

  // SPRING: Magnolias, Daisies, Tulips, & Lush Leaves
  const SpringMagnolias = useMemo(() => {
    return [...Array(15)].map((_, i) => {
      const top = Math.random() * 100;
      const left = Math.random() * 100;
      const rotate = Math.random() * 360;
      const size = Math.random() * 50 + 20;
      const type = Math.random();
      
      return (
        <svg key={i} width={size} height={size} style={{ position: 'absolute', top: `${top}vh`, left: `${left}vw`, opacity: 0.9, transform: `rotate(${rotate}deg)`, willChange: 'transform' }} viewBox="0 0 100 100">
          {type > 0.75 ? (
            // Magnolia (Pink)
            <>
              <path d="M50 50 Q30 20 50 5 Q70 20 50 50" fill="#f8c3cd" />
              <path d="M50 50 Q20 40 10 60 Q40 70 50 50" fill="#f4a7b9" />
              <path d="M50 50 Q80 40 90 60 Q60 70 50 50" fill="#f4a7b9" />
              <circle cx="50" cy="50" r="6" fill="#e9cd4c" />
            </>
          ) : type > 0.5 ? (
            // Daisy (White & Yellow)
            <>
              <path d="M50 50 L50 10 A10 10 0 0 1 60 10 L50 50" fill="#ffffff" stroke="#eee" strokeWidth="1" />
              <path d="M50 50 L50 90 A10 10 0 0 1 40 90 L50 50" fill="#ffffff" stroke="#eee" strokeWidth="1" />
              <path d="M50 50 L90 50 A10 10 0 0 1 90 60 L50 50" fill="#ffffff" stroke="#eee" strokeWidth="1" />
              <path d="M50 50 L10 50 A10 10 0 0 1 10 40 L50 50" fill="#ffffff" stroke="#eee" strokeWidth="1" />
              <path d="M50 50 L78 22 A10 10 0 0 1 85 29 L50 50" fill="#ffffff" stroke="#eee" strokeWidth="1" />
              <path d="M50 50 L22 78 A10 10 0 0 1 15 71 L50 50" fill="#ffffff" stroke="#eee" strokeWidth="1" />
              <path d="M50 50 L22 22 A10 10 0 0 0 29 15 L50 50" fill="#ffffff" stroke="#eee" strokeWidth="1" />
              <path d="M50 50 L78 78 A10 10 0 0 0 71 85 L50 50" fill="#ffffff" stroke="#eee" strokeWidth="1" />
              <circle cx="50" cy="50" r="12" fill="#ffd166" />
            </>
          ) : type > 0.25 ? (
            // Tulip (Purple/Red Cup)
            <>
              <path d="M30 80 Q50 90 70 80 L80 30 Q65 60 50 40 Q35 60 20 30 Z" fill="#9d4edd" />
              <path d="M35 80 Q50 90 65 80 L70 40 Q50 70 30 40 Z" fill="#7b2cbf" />
            </>
          ) : (
            // Lush Green Leaf (Spring Green)
            <>
              <path d="M50 90 Q20 50 50 10 Q80 50 50 90 Z" fill="#2d6a4f" opacity="0.85" />
              <line x1="50" y1="90" x2="50" y2="10" stroke="#1b4332" strokeWidth="2" opacity="0.5" />
            </>
          )}
        </svg>
      );
    });
  }, []);

  // SUMMER: Oranges, Lemons, Watermelons, & Window Rain
  const SummerCitrus = useMemo(() => {
    const fruits = [...Array(15)].map((_, i) => {
      const top = Math.random() * 100;
      const left = Math.random() * 100;
      const rotate = Math.random() * 360;
      const size = Math.random() * 55 + 20;
      const type = Math.random();

      return (
        <svg key={`fruit-${i}`} width={size} height={size} style={{ position: 'absolute', top: `${top}vh`, left: `${left}vw`, opacity: 0.85, transform: `rotate(${rotate}deg)`, willChange: 'transform' }} viewBox="0 0 100 100">
          {type > 0.7 ? (
            // Watermelon Slice
            <>
              <path d="M 10 30 A 40 40 0 0 0 90 30 Z" fill="#2d6a4f" />
              <path d="M 14 30 A 36 36 0 0 0 86 30 Z" fill="#d8f3dc" />
              <path d="M 18 30 A 32 32 0 0 0 82 30 Z" fill="#ff4d6d" />
              <circle cx="35" cy="45" r="2" fill="#111" />
              <circle cx="50" cy="52" r="2" fill="#111" />
              <circle cx="65" cy="45" r="2" fill="#111" />
              <circle cx="43" cy="35" r="2" fill="#111" />
              <circle cx="57" cy="35" r="2" fill="#111" />
            </>
          ) : type > 0.4 ? (
            // Lemon Slice
            <>
              <circle cx="50" cy="50" r="45" fill="#ffd166" />
              <circle cx="50" cy="50" r="40" fill="#fff9eb" />
              <path d="M50 50 L50 12 A38 38 0 0 1 77 23 Z" fill="#ffc300" stroke="#fff9eb" strokeWidth="2" />
              <path d="M50 50 L77 23 A38 38 0 0 1 88 50 Z" fill="#ffc300" stroke="#fff9eb" strokeWidth="2" />
              <path d="M50 50 L88 50 A38 38 0 0 1 77 77 Z" fill="#ffc300" stroke="#fff9eb" strokeWidth="2" />
              <path d="M50 50 L77 77 A38 38 0 0 1 50 88 Z" fill="#ffc300" stroke="#fff9eb" strokeWidth="2" />
              <path d="M50 50 L50 88 A38 38 0 0 1 23 77 Z" fill="#ffc300" stroke="#fff9eb" strokeWidth="2" />
              <path d="M50 50 L23 77 A38 38 0 0 1 12 50 Z" fill="#ffc300" stroke="#fff9eb" strokeWidth="2" />
              <path d="M50 50 L12 50 A38 38 0 0 1 23 23 Z" fill="#ffc300" stroke="#fff9eb" strokeWidth="2" />
              <path d="M50 50 L23 23 A38 38 0 0 1 50 12 Z" fill="#ffc300" stroke="#fff9eb" strokeWidth="2" />
            </>
          ) : (
            // Orange Slice
            <>
              <circle cx="50" cy="50" r="45" fill="#fca311" />
              <circle cx="50" cy="50" r="40" fill="#ffedd8" />
              <path d="M50 50 L50 12 A38 38 0 0 1 77 23 Z" fill="#fb8500" stroke="#ffedd8" strokeWidth="2" />
              <path d="M50 50 L77 23 A38 38 0 0 1 88 50 Z" fill="#fb8500" stroke="#ffedd8" strokeWidth="2" />
              <path d="M50 50 L88 50 A38 38 0 0 1 77 77 Z" fill="#fb8500" stroke="#ffedd8" strokeWidth="2" />
              <path d="M50 50 L77 77 A38 38 0 0 1 50 88 Z" fill="#fb8500" stroke="#ffedd8" strokeWidth="2" />
              <path d="M50 50 L50 88 A38 38 0 0 1 23 77 Z" fill="#fb8500" stroke="#ffedd8" strokeWidth="2" />
              <path d="M50 50 L23 77 A38 38 0 0 1 12 50 Z" fill="#fb8500" stroke="#ffedd8" strokeWidth="2" />
              <path d="M50 50 L12 50 A38 38 0 0 1 23 23 Z" fill="#fb8500" stroke="#ffedd8" strokeWidth="2" />
              <path d="M50 50 L23 23 A38 38 0 0 1 50 12 Z" fill="#fb8500" stroke="#ffedd8" strokeWidth="2" />
            </>
          )}
        </svg>
      );
    });

    const rain = (
      <svg key="rain-overlay" style={{ position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh', pointerEvents: 'none', willChange: 'transform' }}>
        {[...Array(40)].map((_, i) => {
          const left = Math.random() * 100;
          const delay = Math.random() * 2;
          const dur = Math.random() * 0.6 + 0.4; // Fast falling rain
          const height = Math.random() * 40 + 20; // Length of the raindrop streak
          const opacity = Math.random() * 0.4 + 0.2;

          return (
            <line 
              key={`rain-${i}`} 
              x1={`${left}%`} 
              y1="-100" 
              x2={`${left}%`} 
              y2={height - 100} 
              stroke="#90e0ef" 
              strokeWidth="2" 
              strokeLinecap="round" 
              opacity={opacity}
            >
              <animateTransform 
                attributeName="transform" 
                type="translate" 
                from="0 0" 
                to="0 1500" 
                dur={`${dur}s`} 
                begin={`${delay}s`} 
                repeatCount="indefinite" 
              />
            </line>
          );
        })}
      </svg>
    );

    return [...fruits, rain];
  }, []);

  // AUTUMN: Oak, Maple, Birch, & Pine Needles
  const AutumnLeaves = useMemo(() => {
    return [...Array(22)].map((_, i) => {
      const top = Math.random() * 100;
      const left = Math.random() * 100;
      const rotate = Math.random() * 360;
      const size = Math.random() * 40 + 20;
      const type = Math.random();

      return (
        <svg key={i} width={size} height={size} style={{ position: 'absolute', top: `${top}vh`, left: `${left}vw`, opacity: 0.85, transform: `rotate(${rotate}deg)`, willChange: 'transform' }} viewBox="0 0 100 100">
          {type > 0.75 ? (
            // Maple
            <>
              <path d="M50 90 Q40 60 10 50 Q40 40 50 10 Q60 40 90 50 Q60 60 50 90 Z" fill="#e76f51" />
              <path d="M50 90 L50 10 M10 50 L90 50" stroke="#264653" strokeWidth="1" opacity="0.3" />
            </>
          ) : type > 0.5 ? (
            // Oak
            <>
              <path d="M50 90 Q30 50 10 50 Q30 30 50 10 Q70 30 90 50 Q70 50 50 90 Z" fill="#f4a261" />
              <line x1="50" y1="90" x2="50" y2="10" stroke="#264653" strokeWidth="1" opacity="0.4" />
            </>
          ) : type > 0.25 ? (
            // Birch (Diamond)
            <>
              <path d="M50 90 L 20 60 L 50 10 L 80 60 Z" fill="#e9c46a" />
              <line x1="50" y1="90" x2="50" y2="10" stroke="#264653" strokeWidth="1" opacity="0.4" />
            </>
          ) : (
            // Pine Needle
            <path d="M 48 10 L 52 10 L 50 90 Z" fill="#2a9d8f" opacity="0.7" />
          )}
        </svg>
      );
    });
  }, []);

  const renderDebris = () => {
    switch (theme) {
      case 'winter': return WinterFrost;
      case 'spring': return SpringMagnolias;
      case 'summer': return SummerCitrus;
      case 'autumn': return AutumnLeaves;
      default: return null;
    }
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: 0, overflow: 'hidden', willChange: 'transform' }}>
      {renderDebris()}
    </div>
  );
});
