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
      const size = Math.random() * 45 + 15;
      const type = Math.random();
      
      return (
        <svg key={i} width={size} height={size} style={{ position: 'absolute', top: `${top}vh`, left: `${left}vw`, opacity: 0.95, transform: `rotate(${rotate}deg)`, willChange: 'transform', filter: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.15))' }} viewBox="0 0 100 100">
          {type > 0.75 ? (
            // Magnolia (Pink, larger and lusher)
            <g transform="scale(1.2) translate(-8, -8)">
              <path d="M 50 50 C 20 0, 80 0, 50 50" fill="#f8c3cd" />
              <path d="M 50 50 C -10 30, 20 90, 50 50" fill="#f4a7b9" />
              <path d="M 50 50 C 110 30, 80 90, 50 50" fill="#f4a7b9" />
              <path d="M 50 50 C 30 10, 70 10, 50 50" fill="#ffb7b2" opacity="0.8" />
              <path d="M 50 50 C 10 40, 30 70, 50 50" fill="#ffb7b2" opacity="0.6" />
              <path d="M 50 50 C 90 40, 70 70, 50 50" fill="#ffb7b2" opacity="0.6" />
              <circle cx="50" cy="50" r="9" fill="#e9cd4c" />
              <circle cx="50" cy="50" r="4" fill="#d4af37" />
            </g>
          ) : type > 0.5 ? (
            // Daisy (White & Yellow)
            <>
              {[0, 30, 60, 90, 120, 150].map(angle => (
                <ellipse key={angle} cx="50" cy="50" rx="8" ry="40" fill="#ffffff" transform={`rotate(${angle} 50 50)`} />
              ))}
              <circle cx="50" cy="50" r="14" fill="#ffd166" />
              <circle cx="50" cy="50" r="10" fill="#ffb703" />
            </>
          ) : type > 0.25 ? (
            // Wide Tulip / Purple Flower
            <g transform="scale(1.1) translate(-4, -2)">
              <path d="M 35 90 C 10 60, 10 25, 35 10 C 50 30, 45 60, 35 90 Z" fill="#9d4edd" transform="rotate(12 35 90)" />
              <path d="M 65 90 C 90 60, 90 25, 65 10 C 50 30, 55 60, 65 90 Z" fill="#9d4edd" transform="rotate(-12 65 90)" />
              <path d="M 50 95 C 25 60, 30 20, 50 5 C 70 20, 75 60, 50 95 Z" fill="#7b2cbf" />
              <path d="M 50 95 C 40 70, 45 40, 50 25 C 55 40, 60 70, 50 95 Z" fill="#5a189a" />
            </g>
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
      const size = Math.random() * 45 + 15;
      const type = Math.random();

      return (
        <svg key={`summer-${i}`} width={size} height={size} style={{ position: 'absolute', top: `${top}vh`, left: `${left}vw`, opacity: 0.95, transform: `rotate(${rotate}deg)`, willChange: 'transform', filter: 'drop-shadow(2px 5px 6px rgba(0,0,0,0.2))' }} viewBox="0 0 100 100">
          {type > 0.8 ? (
            // Starfish (Round and soft)
            <>
              <path d="M 50 15 L 58 38 L 85 38 L 63 55 L 70 80 L 50 65 L 30 80 L 37 55 L 15 38 L 42 38 Z" fill="#f4a261" stroke="#f4a261" strokeWidth="12" strokeLinejoin="round" />
              <path d="M 50 15 L 58 38 L 85 38 L 63 55 L 70 80 L 50 65 L 30 80 L 37 55 L 15 38 L 42 38 Z" fill="none" stroke="#e76f51" strokeWidth="1.5" strokeLinejoin="round" />
              <circle cx="50" cy="45" r="2" fill="#e76f51" />
              <circle cx="50" cy="55" r="2" fill="#e76f51" />
              <circle cx="45" cy="50" r="2" fill="#e76f51" />
              <circle cx="55" cy="50" r="2" fill="#e76f51" />
              <circle cx="50" cy="22" r="1.5" fill="#e76f51" />
              <circle cx="32" cy="42" r="1.5" fill="#e76f51" />
              <circle cx="68" cy="42" r="1.5" fill="#e76f51" />
              <circle cx="38" cy="70" r="1.5" fill="#e76f51" />
              <circle cx="62" cy="70" r="1.5" fill="#e76f51" />
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
            // Soft Monstera Leaf (Summer Green)
            <g>
              <mask id={`monstera-mask-${i}`}>
                <rect width="100" height="100" fill="white" />
                {/* Left Slits */}
                <ellipse cx="10" cy="35" rx="25" ry="3" fill="black" transform="rotate(15 10 35)" />
                <ellipse cx="15" cy="65" rx="22" ry="3.5" fill="black" transform="rotate(30 15 65)" />
                {/* Right Slits */}
                <ellipse cx="90" cy="35" rx="25" ry="3" fill="black" transform="rotate(-15 90 35)" />
                <ellipse cx="85" cy="65" rx="22" ry="3.5" fill="black" transform="rotate(-30 85 65)" />
                {/* Fenestrations (Holes) */}
                <circle cx="35" cy="48" r="3.5" fill="black" />
                <circle cx="32" cy="28" r="2.5" fill="black" />
                <circle cx="65" cy="50" r="3" fill="black" />
                <circle cx="68" cy="30" r="2.5" fill="black" />
              </mask>
              <g mask={`url(#monstera-mask-${i})`}>
                <path d="M 50 95 C -5 50, 15 10, 50 5 C 85 10, 105 50, 50 95 Z" fill="#52b788" opacity="0.95" />
                <path d="M 50 95 C 35 60, 40 15, 50 5" fill="none" stroke="#40916c" strokeWidth="2" opacity="0.5" />
                <line x1="50" y1="95" x2="50" y2="10" stroke="#40916c" strokeWidth="3" opacity="0.6" />
                <line x1="50" y1="75" x2="25" y2="55" stroke="#40916c" strokeWidth="1.5" opacity="0.4" />
                <line x1="50" y1="65" x2="75" y2="45" stroke="#40916c" strokeWidth="1.5" opacity="0.4" />
                <line x1="50" y1="45" x2="30" y2="30" stroke="#40916c" strokeWidth="1.5" opacity="0.4" />
                <line x1="50" y1="35" x2="70" y2="20" stroke="#40916c" strokeWidth="1.5" opacity="0.4" />
              </g>
            </g>
          ) : type > 0.2 ? (
            // Sunflower
            <>
              {[0, 30, 60, 90, 120, 150].map(angle => (
                <ellipse key={angle} cx="50" cy="50" rx="10" ry="40" fill="#fca311" transform={`rotate(${angle} 50 50)`} />
              ))}
              {[15, 45, 75, 105, 135, 165].map(angle => (
                <ellipse key={angle} cx="50" cy="50" rx="8" ry="32" fill="#ffb703" transform={`rotate(${angle} 50 50)`} />
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
      const size = Math.random() * 45 + 15;
      const type = Math.random();

      return (
        <svg key={i} width={size} height={size} style={{ position: 'absolute', top: `${top}vh`, left: `${left}vw`, opacity: 0.95, transform: `rotate(${rotate}deg)`, willChange: 'transform', filter: 'drop-shadow(3px 5px 6px rgba(0,0,0,0.25))' }} viewBox="0 0 100 100">
          {type > 0.8 ? (
            // Rich Maple Leaf
            <>
              <path d="M 50 95 L 50 82" stroke="#6a040f" strokeWidth="3" strokeLinecap="round" />
              <path d="M 50 82 L 35 78 L 20 78 L 18 68 L 30 60 L 12 55 L 8 45 L 25 40 L 35 45 L 40 25 L 50 5 L 60 25 L 65 45 L 75 40 L 92 45 L 88 55 L 70 60 L 82 68 L 80 78 L 65 78 Z" fill="#d00000" stroke="#9d0208" strokeWidth="1.5" strokeLinejoin="round" />
              <line x1="50" y1="82" x2="50" y2="10" stroke="#6a040f" strokeWidth="2.5" opacity="0.7" />
              <line x1="50" y1="82" x2="15" y2="48" stroke="#6a040f" strokeWidth="2" opacity="0.7" />
              <line x1="50" y1="82" x2="85" y2="48" stroke="#6a040f" strokeWidth="2" opacity="0.7" />
              <line x1="50" y1="82" x2="25" y2="73" stroke="#6a040f" strokeWidth="1.5" opacity="0.7" />
              <line x1="50" y1="82" x2="75" y2="73" stroke="#6a040f" strokeWidth="1.5" opacity="0.7" />
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
            // Pinecone
            <>
              <path d="M 50 15 C 20 30, 25 75, 50 90 C 75 75, 80 30, 50 15 Z" fill="#582f0e" />
              <path d="M 40 25 C 45 30, 55 30, 60 25 C 55 35, 45 35, 40 25 Z" fill="#7f4f24" />
              <path d="M 30 40 C 40 45, 60 45, 70 40 C 60 50, 40 50, 30 40 Z" fill="#7f4f24" />
              <path d="M 27 55 C 40 60, 60 60, 73 55 C 60 65, 40 65, 27 55 Z" fill="#7f4f24" />
              <path d="M 33 70 C 45 75, 55 75, 67 70 C 55 80, 45 80, 33 70 Z" fill="#7f4f24" />
              <path d="M 50 15 L 50 5" stroke="#432818" strokeWidth="3" strokeLinecap="round" />
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
