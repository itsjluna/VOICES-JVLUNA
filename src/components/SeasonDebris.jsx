import React, { useMemo } from 'react';

// Renders randomized physical aesthetic items based on the season
export const SeasonDebris = React.memo(({ theme }) => {
  
  // WINTER: Snowflakes, Ice Crystals, Holly, and Frost Stars
  const WinterFrost = useMemo(() => {
    return [...Array(28)].map((_, i) => {
      const top = Math.random() * 100;
      const left = Math.random() * 100;
      const rotate = Math.random() * 360;
      const size = Math.random() * 45 + 15;
      const type = Math.random();
      
      return (
        <svg key={i} width={size} height={size} style={{ position: 'absolute', top: `${top}vh`, left: `${left}vw`, opacity: Math.random() * 0.4 + 0.5, transform: `rotate(${rotate}deg)`, willChange: 'transform', filter: 'drop-shadow(0px 3px 5px rgba(255,255,255,0.25))' }} viewBox="0 0 100 100">
          {type > 0.8 ? (
            // Classic Snowflake
            <>
              <defs>
                <g id={`snow1-${i}`}>
                  <line x1="50" y1="50" x2="50" y2="5" stroke="#e0f7fa" strokeWidth="3.5" strokeLinecap="round" />
                  <line x1="50" y1="25" x2="35" y2="10" stroke="#e0f7fa" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="50" y1="25" x2="65" y2="10" stroke="#e0f7fa" strokeWidth="2.5" strokeLinecap="round" />
                  <circle cx="50" cy="5" r="3" fill="#ffffff" />
                </g>
              </defs>
              {[0, 60, 120, 180, 240, 300].map(angle => <use key={angle} href={`#snow1-${i}`} transform={`rotate(${angle} 50 50)`} />)}
              <circle cx="50" cy="50" r="6" fill="#ffffff" />
            </>
          ) : type > 0.6 ? (
            // Holly & Berries
            <>
              <path d="M 50 50 C 30 20, 10 30, 20 60 C 25 50, 40 45, 50 50 Z" fill="#2d6a4f" />
              <path d="M 50 50 C 70 20, 90 30, 80 60 C 75 50, 60 45, 50 50 Z" fill="#1b4332" />
              <circle cx="45" cy="55" r="9" fill="#d90429" />
              <circle cx="55" cy="60" r="8" fill="#ef233c" />
              <circle cx="48" cy="66" r="7" fill="#d90429" />
            </>
          ) : type > 0.4 ? (
            // Ice Crystal / Gem
            <>
              <polygon points="50,5 85,50 50,95 15,50" fill="#a8dadc" opacity="0.7" />
              <polygon points="50,5 85,50 50,50" fill="#f1faee" opacity="0.9" />
              <polygon points="50,95 85,50 50,50" fill="#457b9d" opacity="0.5" />
              <polygon points="50,5 15,50 50,50" fill="#e0f7fa" opacity="1" />
            </>
          ) : type > 0.2 ? (
            // Frost Star
            <>
               <path d="M50 5 L55 40 L90 45 L55 50 L50 85 L45 50 L10 45 L45 40 Z" fill="#ffffff" opacity="0.9"/>
            </>
          ) : (
            // Simple Snowball / Bokeh
            <circle cx="50" cy="50" r="25" fill="#f8f9fa" opacity="0.6" filter="blur(2px)" />
          )}
        </svg>
      );
    });
  }, []);

  // SPRING: Magnolias, Daisies, Tulips, & Lush Leaves
  const SpringMagnolias = useMemo(() => {
    return [...Array(22)].map((_, i) => {
      const top = Math.random() * 100;
      const left = Math.random() * 100;
      const rotate = Math.random() * 360;
      const size = Math.random() * 55 + 25;
      const type = Math.random();
      
      return (
        <svg key={i} width={size} height={size} style={{ position: 'absolute', top: `${top}vh`, left: `${left}vw`, opacity: 0.95, transform: `rotate(${rotate}deg)`, willChange: 'transform', filter: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.15))' }} viewBox="0 0 100 100">
          {type > 0.75 ? (
            // Magnolia (Pink)
            <>
              <path d="M50 50 C 25 15, 75 15, 50 50" fill="#f8c3cd" />
              <path d="M50 50 C 15 35, 25 80, 50 50" fill="#f4a7b9" />
              <path d="M50 50 C 85 35, 75 80, 50 50" fill="#f4a7b9" />
              <path d="M50 50 C 40 20, 60 20, 50 50" fill="#ffb7b2" />
              <circle cx="50" cy="50" r="7" fill="#e9cd4c" />
              <circle cx="50" cy="50" r="3" fill="#d4af37" />
            </>
          ) : type > 0.5 ? (
            // Daisy (White & Yellow)
            <>
              {[0, 45, 90, 135].map(angle => (
                <path key={angle} d="M50 50 L50 5 A12 12 0 0 1 64 5 L50 50" fill="#ffffff" transform={`rotate(${angle} 50 50)`} />
              ))}
              {[0, 45, 90, 135].map(angle => (
                <path key={angle} d="M50 50 L50 95 A12 12 0 0 1 36 95 L50 50" fill="#ffffff" transform={`rotate(${angle} 50 50)`} />
              ))}
              <circle cx="50" cy="50" r="14" fill="#ffd166" />
              <circle cx="50" cy="50" r="10" fill="#ffb703" />
            </>
          ) : type > 0.25 ? (
            // Tulip
            <>
              <path d="M 25 80 C 40 95, 60 95, 75 80 L 85 20 C 70 50, 50 40, 25 20 Z" fill="#9d4edd" />
              <path d="M 35 80 C 50 95, 65 80, 65 40 C 50 70, 35 40, 35 40 Z" fill="#7b2cbf" />
              <path d="M 45 80 C 50 90, 55 80, 55 50 Z" fill="#5a189a" />
            </>
          ) : (
            // Lush Green Leaf (Spring Green)
            <>
              <path d="M 50 95 C 15 60, 25 10, 50 5 C 75 10, 85 60, 50 95 Z" fill="#2d6a4f" opacity="0.95" />
              <path d="M 50 95 C 35 60, 40 15, 50 5" fill="none" stroke="#1b4332" strokeWidth="2" opacity="0.5" />
              <line x1="50" y1="95" x2="50" y2="10" stroke="#1b4332" strokeWidth="3" opacity="0.6" />
            </>
          )}
        </svg>
      );
    });
  }, []);

  // SUMMER: Watermelons, Lemons, Monstera Leaves, Sunflowers, & Fireflies
  const SummerCitrus = useMemo(() => {
    const items = [...Array(24)].map((_, i) => {
      const top = Math.random() * 100;
      const left = Math.random() * 100;
      const rotate = Math.random() * 360;
      const size = Math.random() * 60 + 25;
      const type = Math.random();

      return (
        <svg key={`summer-${i}`} width={size} height={size} style={{ position: 'absolute', top: `${top}vh`, left: `${left}vw`, opacity: 0.95, transform: `rotate(${rotate}deg)`, willChange: 'transform', filter: 'drop-shadow(2px 5px 6px rgba(0,0,0,0.2))' }} viewBox="0 0 100 100">
          {type > 0.8 ? (
            // Watermelon Slice
            <>
              <path d="M 10 30 A 40 40 0 0 0 90 30 Z" fill="#2d6a4f" />
              <path d="M 15 30 A 35 35 0 0 0 85 30 Z" fill="#d8f3dc" />
              <path d="M 20 30 A 30 30 0 0 0 80 30 Z" fill="#ff4d6d" />
              {[30, 40, 50, 60, 70].map((cx, idx) => (
                <ellipse key={idx} cx={cx} cy={45 + (idx % 2 === 0 ? 5 : 0)} rx="2" ry="3.5" fill="#111" transform={`rotate(${(cx-50)/2} ${cx} 45)`} />
              ))}
            </>
          ) : type > 0.6 ? (
            // Citrus Slice
            <>
              <circle cx="50" cy="50" r="45" fill="#ffd166" />
              <circle cx="50" cy="50" r="40" fill="#fff9eb" />
              {[0, 45, 90, 135, 180, 225, 270, 315].map(angle => (
                <path key={angle} d="M 50 50 L 50 12 A 38 38 0 0 1 77 23 Z" fill="#ffc300" stroke="#fff9eb" strokeWidth="2.5" strokeLinejoin="round" transform={`rotate(${angle} 50 50)`} />
              ))}
              <circle cx="50" cy="50" r="6" fill="#fff9eb" />
            </>
          ) : type > 0.4 ? (
            // Monstera Leaf
            <>
              <path d="M 50 95 C 20 80, 5 30, 30 10 C 65 0, 95 25, 85 70 C 75 90, 65 95, 50 95 Z" fill="#2a9d8f" />
              <path d="M 25 35 C 35 35, 45 40, 45 50 C 45 35, 30 20, 10 20 C 15 30, 20 35, 25 35 Z" fill="transparent" />
              <ellipse cx="25" cy="35" rx="10" ry="4" fill="white" style={{ mixBlendMode: 'destination-out' }} transform="rotate(30 25 35)" />
              <ellipse cx="75" cy="45" rx="12" ry="5" fill="white" style={{ mixBlendMode: 'destination-out' }} transform="rotate(-40 75 45)" />
              <ellipse cx="65" cy="20" rx="9" ry="4" fill="white" style={{ mixBlendMode: 'destination-out' }} transform="rotate(-60 65 20)" />
              <ellipse cx="35" cy="70" rx="11" ry="4" fill="white" style={{ mixBlendMode: 'destination-out' }} transform="rotate(20 35 70)" />
              <line x1="50" y1="95" x2="45" y2="15" stroke="#1b4332" strokeWidth="3" opacity="0.6" strokeLinecap="round" />
            </>
          ) : type > 0.2 ? (
            // Sunflower
            <>
              {[0, 30, 60, 90, 120, 150].map(angle => (
                <ellipse key={angle} cx="50" cy="25" rx="10" ry="20" fill="#fca311" transform={`rotate(${angle} 50 50)`} />
              ))}
              {[15, 45, 75, 105, 135, 165].map(angle => (
                <ellipse key={angle} cx="50" cy="30" rx="8" ry="16" fill="#ffb703" transform={`rotate(${angle} 50 50)`} />
              ))}
              <circle cx="50" cy="50" r="18" fill="#582f0e" />
              <circle cx="50" cy="50" r="14" fill="#7f4f24" stroke="#936639" strokeWidth="2" strokeDasharray="3,3" />
            </>
          ) : (
            // Sea Shell
            <>
              <path d="M 50 90 C 20 90, 10 60, 15 40 C 20 20, 80 20, 85 40 C 90 60, 80 90, 50 90 Z" fill="#ffddd2" />
              <path d="M 50 90 C 35 90, 25 70, 30 50 C 35 30, 65 30, 70 50 C 75 70, 65 90, 50 90 Z" fill="#e29578" opacity="0.5" />
              <path d="M 30 90 L 10 95 L 15 70 Z" fill="#ffddd2" />
              <path d="M 70 90 L 90 95 L 85 70 Z" fill="#ffddd2" />
              <line x1="50" y1="90" x2="50" y2="25" stroke="#e29578" strokeWidth="2" />
              <line x1="50" y1="90" x2="35" y2="30" stroke="#e29578" strokeWidth="2" />
              <line x1="50" y1="90" x2="65" y2="30" stroke="#e29578" strokeWidth="2" />
              <line x1="50" y1="90" x2="20" y2="40" stroke="#e29578" strokeWidth="2" />
              <line x1="50" y1="90" x2="80" y2="40" stroke="#e29578" strokeWidth="2" />
            </>
          )}
        </svg>
      );
    });

    return items;
  }, []);

  // AUTUMN: Maple, Oak, Mushrooms, Acorns, & Birch Leaves
  const AutumnLeaves = useMemo(() => {
    return [...Array(28)].map((_, i) => {
      const top = Math.random() * 100;
      const left = Math.random() * 100;
      const rotate = Math.random() * 360;
      const size = Math.random() * 50 + 20;
      const type = Math.random();

      return (
        <svg key={i} width={size} height={size} style={{ position: 'absolute', top: `${top}vh`, left: `${left}vw`, opacity: 0.95, transform: `rotate(${rotate}deg)`, willChange: 'transform', filter: 'drop-shadow(3px 5px 6px rgba(0,0,0,0.25))' }} viewBox="0 0 100 100">
          {type > 0.8 ? (
            // Rich Maple Leaf
            <>
              <path d="M 50 90 L 50 70 L 15 55 L 20 40 L 5 35 L 35 25 L 40 5 L 50 15 L 60 5 L 65 25 L 95 35 L 80 40 L 85 55 L 50 70 Z" fill="#d00000" stroke="#9d0208" strokeWidth="2" strokeLinejoin="round" />
              <path d="M 50 95 L 50 70" stroke="#6a040f" strokeWidth="3" strokeLinecap="round" />
              <line x1="50" y1="70" x2="50" y2="15" stroke="#6a040f" strokeWidth="2.5" opacity="0.8" />
              <line x1="50" y1="70" x2="20" y2="40" stroke="#6a040f" strokeWidth="2.5" opacity="0.8" />
              <line x1="50" y1="70" x2="80" y2="40" stroke="#6a040f" strokeWidth="2.5" opacity="0.8" />
            </>
          ) : type > 0.6 ? (
            // Oak Leaf
            <>
              <path d="M 50 90 C 40 70, 20 70, 25 55 C 10 50, 15 35, 30 35 C 25 20, 40 10, 50 5 C 60 10, 75 20, 70 35 C 85 35, 90 50, 75 55 C 80 70, 60 70, 50 90 Z" fill="#e85d04" stroke="#dc2f02" strokeWidth="1.5" />
              <path d="M 50 95 L 50 85" stroke="#6a040f" strokeWidth="3" strokeLinecap="round" />
              <line x1="50" y1="88" x2="50" y2="10" stroke="#9d0208" strokeWidth="2.5" opacity="0.8" />
            </>
          ) : type > 0.4 ? (
            // Acorn
            <>
              <path d="M 30 45 C 30 75, 40 90, 50 95 C 60 90, 70 75, 70 45 Z" fill="#9c6644" />
              <path d="M 25 45 C 25 20, 40 25, 50 25 C 60 25, 75 20, 75 45 Z" fill="#582f0e" />
              <path d="M 50 25 L 55 10" stroke="#582f0e" strokeWidth="4" strokeLinecap="round" />
              <path d="M 30 45 L 70 45" stroke="#7f4f24" strokeWidth="2" />
            </>
          ) : type > 0.2 ? (
            // Mushroom
            <>
              <path d="M 40 90 C 40 60, 42 50, 50 50 C 58 50, 60 60, 60 90 Z" fill="#edede9" />
              <path d="M 10 55 C 10 10, 90 10, 90 55 C 90 60, 10 60, 10 55 Z" fill="#d90429" />
              <circle cx="30" cy="35" r="5" fill="#ffffff" />
              <circle cx="70" cy="40" r="6" fill="#ffffff" />
              <circle cx="50" cy="25" r="7" fill="#ffffff" />
              <circle cx="20" cy="45" r="3" fill="#ffffff" />
              <circle cx="80" cy="30" r="4" fill="#ffffff" />
            </>
          ) : (
            // Birch / Yellow Leaf
            <>
               <path d="M 50 90 C 30 70, 15 50, 50 5 C 85 50, 70 70, 50 90 Z" fill="#ffb703" stroke="#fb8500" strokeWidth="1.5" />
               <line x1="50" y1="95" x2="50" y2="10" stroke="#9c6644" strokeWidth="2.5" opacity="0.7" />
               <line x1="50" y1="70" x2="35" y2="45" stroke="#9c6644" strokeWidth="2" opacity="0.6" />
               <line x1="50" y1="60" x2="65" y2="35" stroke="#9c6644" strokeWidth="2" opacity="0.6" />
               <line x1="50" y1="40" x2="35" y2="25" stroke="#9c6644" strokeWidth="2" opacity="0.6" />
            </>
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
