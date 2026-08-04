import React, { useMemo } from 'react';

export const TravelGraphics = React.memo(({ type }) => {
  
  // PLANE: Flight Trajectories (Arcs, Take-offs, and Landings)
  const PlaneTrajectories = () => {
    const flightPaths = useMemo(() => [
      { id: 'f1', d: "M 200 800 Q 500 200 900 600", dur: 12, delay: 0 },
      { id: 'f2', d: "M 1500 300 Q 1200 100 800 400", dur: 15, delay: 2 },
      { id: 'f3', d: "M 100 400 Q 600 -100 1200 200", dur: 18, delay: 5 },
      { id: 'f4', d: "M 1800 800 Q 1400 900 1000 600", dur: 14, delay: 3 },
      { id: 'f5', d: "M 400 900 Q 800 1000 1600 700", dur: 16, delay: 7 },
    ], []);

    const flights = useMemo(() => {
      return flightPaths.map((flight, i) => (
        <g key={flight.id} style={{ willChange: 'transform, opacity' }}>
          {/* Dashed Trajectory Arc */}
          <path id={flight.id} d={flight.d} fill="none" stroke="var(--text-color)" strokeWidth="2" strokeDasharray="8 8" opacity="0.3" strokeLinecap="round" />
          
          {/* Plane Container for Motion */}
          <g>
            <animateMotion dur={`${flight.dur}s`} begin={`${flight.delay}s`} repeatCount="indefinite" rotate="auto">
              <mpath href={`#${flight.id}`} />
            </animateMotion>
            
            {/* The Airplane Graphic (Scales up and down to simulate altitude) */}
            <g style={{ willChange: 'transform' }}>
              <animateTransform attributeName="transform" type="scale" values="0.2; 1.5; 1.5; 0.2" keyTimes="0; 0.2; 0.8; 1" dur={`${flight.dur}s`} begin={`${flight.delay}s`} repeatCount="indefinite" additive="sum" />
              <animate attributeName="opacity" values="0; 1; 1; 0" keyTimes="0; 0.1; 0.9; 1" dur={`${flight.dur}s`} begin={`${flight.delay}s`} repeatCount="indefinite" />
              
              {/* Simple Plane SVG (Arrowhead pointing right) */}
              <path d="M 10 0 L -10 -10 L -5 0 L -10 10 Z" fill="var(--text-color)" stroke="var(--bg-color)" strokeWidth="1" strokeLinejoin="round" />
            </g>
          </g>
          
          {/* Take-off and Landing point rings */}
          <circle cx="0" cy="0" r="4" fill="none" stroke="var(--text-color)" opacity="0.5">
             <animateMotion dur="0.1s" begin="0" fill="freeze">
                <mpath href={`#${flight.id}`} />
             </animateMotion>
          </circle>
        </g>
      ));
    }, [flightPaths]);

    return (
      <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', willChange: 'transform' }} preserveAspectRatio="xMidYMid slice" viewBox="0 0 1920 1080">
        {/* Subtle Lat/Long Grid */}
        <pattern id="latlong-grid" width="100" height="100" patternUnits="userSpaceOnUse">
          <path d="M 100 0 L 0 0 0 100" fill="none" stroke="var(--text-color)" strokeWidth="1" opacity="0.05"/>
        </pattern>
        <rect width="100%" height="100%" fill="url(#latlong-grid)" />
        
        {/* Map Dots */}
        {[...Array(50)].map((_, i) => (
          <circle key={`dot-${i}`} cx={Math.random() * 1920} cy={Math.random() * 1080} r="2" fill="var(--text-color)" opacity="0.2" />
        ))}

        {flights}
      </svg>
    );
  };

  // TRAIN: Metro Control Room Map (Geometric & Geography-like)
  const TrainMetro = () => {
    const metroPaths = useMemo(() => [
      { id: 'm1', color: '#e63946', d: "M -100 300 L 400 300 A 20 20 0 0 1 414 306 L 586 478 A 20 20 0 0 0 600 484 L 1400 484 A 20 20 0 0 0 1414 478 L 1586 306 A 20 20 0 0 1 1600 300 L 2020 300", stations: [{x:400, y:300, name: 'SEC-1'}, {x:600, y:484, name: 'HUB-R'}, {x:1400, y:484, name: 'PORT-1'}, {x:1600, y:300, name: 'OUT-A'}] },
      { id: 'm2', color: '#2a9d8f', d: "M 1000 -100 L 1000 464 A 20 20 0 0 0 1006 478 L 1086 558 A 20 20 0 0 1 1100 564 L 2020 564", stations: [{x:1000, y:200, name: 'NTH-X'}, {x:1000, y:464, name: 'CEN-N'}, {x:1100, y:564, name: 'EST-1'}] },
      { id: 'm3', color: '#e9c46a', d: "M -100 800 L 400 800 A 20 20 0 0 0 414 794 L 886 322 A 20 20 0 0 1 900 316 L 2020 316", stations: [{x:400, y:800, name: 'STH-W'}, {x:900, y:316, name: 'CEN-Y'}, {x:1500, y:316, name: 'EST-2'}] },
      { id: 'm4', color: '#f4a261', d: "M -100 650 L 700 650 A 20 20 0 0 0 714 644 L 886 472 A 20 20 0 0 1 900 466 L 1500 466 A 20 20 0 0 1 1514 472 L 1686 644 A 20 20 0 0 0 1700 650 L 2020 650", stations: [{x:700, y:650, name: 'STH-C'}, {x:900, y:466, name: 'HUB-O'}, {x:1500, y:466, name: 'PORT-2'}, {x:1700, y:650, name: 'OUT-B'}] },
      { id: 'm5', color: '#8338ec', d: "M -100 400 L 500 400 A 20 20 0 0 0 514 394 L 686 222 A 20 20 0 0 1 700 216 L 1200 216 A 20 20 0 0 1 1214 222 L 1386 394 A 20 20 0 0 0 1400 400 L 2020 400", stations: [{x:500, y:400, name: 'WST-1'}, {x:700, y:216, name: 'NTH-W'}, {x:1200, y:216, name: 'NTH-E'}, {x:1400, y:400, name: 'EST-3'}] },
    ], []);

    const metroNetwork = useMemo(() => {
      return metroPaths.map((line) => {
        return (
          <g key={line.id} style={{ willChange: 'transform' }}>
            {/* The Track */}
            <path id={line.id} d={line.d} fill="none" stroke={line.color} strokeWidth="6" strokeLinecap="round" opacity="0.4" />
            
            {/* The Stations */}
            {line.stations.map((st, idx) => (
              <g key={idx}>
                <circle cx={st.x} cy={st.y} r="6" fill="var(--bg-color)" stroke={line.color} strokeWidth="3" />
                <circle cx={st.x} cy={st.y} r="2" fill="var(--text-color)" opacity="0.8" />
                <text x={st.x + 12} y={st.y - 12} fill="var(--text-color)" fontSize="10" fontFamily="monospace" opacity="0.6" letterSpacing="1">{st.name}</text>
              </g>
            ))}

            {/* The Train Capsule traveling the track */}
            <rect width="25" height="10" rx="5" fill="var(--bg-color)" stroke={line.color} strokeWidth="3">
              <animateMotion dur={`${Math.random() * 10 + 15}s`} repeatCount="indefinite" rotate="auto">
                <mpath href={`#${line.id}`} />
              </animateMotion>
            </rect>
            
            {/* A second train going the other way */}
            <rect width="25" height="10" rx="5" fill={line.color}>
              <animateMotion dur={`${Math.random() * 10 + 15}s`} begin={`${Math.random() * 5}s`} repeatCount="indefinite" rotate="auto-reverse" keyPoints="1;0" keyTimes="0;1">
                <mpath href={`#${line.id}`} />
              </animateMotion>
            </rect>
          </g>
        );
      });
    }, [metroPaths]);

    return (
      <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', willChange: 'transform' }} preserveAspectRatio="xMidYMid slice" viewBox="0 0 1920 1080">
        <pattern id="metro-grid" width="80" height="80" patternUnits="userSpaceOnUse">
          <path d="M 80 0 L 0 0 0 80" fill="none" stroke="var(--text-color)" strokeWidth="1" opacity="0.03"/>
        </pattern>
        <rect width="100%" height="100%" fill="url(#metro-grid)" />
        {metroNetwork}
      </svg>
    );
  };

  // BUS: Intercity Coach Network (Geometric Interstate Topology)
  const BusHighway = () => {
    const coachRoutes = useMemo(() => [
      { id: 'r1', color: '#ff9f1c', d: "M -100 300 L 200 300 L 400 500 L 800 500 L 1000 300 L 1400 300 L 1600 500 L 2020 500", nodes: [{x:200, y:300, name: 'STA-A'}, {x:800, y:500, name: 'STA-B'}, {x:1400, y:300, name: 'STA-C'}] },
      { id: 'r2', color: '#2ec4b6', d: "M -100 800 L 300 800 L 500 600 L 900 600 L 1200 900 L 1700 900 L 1900 700 L 2020 700", nodes: [{x:300, y:800, name: 'DEP-1'}, {x:900, y:600, name: 'DEP-2'}, {x:1700, y:900, name: 'DEP-3'}] },
      { id: 'r3', color: '#e71d36', d: "M 400 1100 L 400 500 L 600 300 L 600 -100", nodes: [{x:400, y:800, name: 'HUB-S'}, {x:600, y:150, name: 'HUB-N'}] },
      { id: 'r4', color: '#011627', d: "M 1200 -100 L 1200 300 L 1000 500 L 1000 700 L 1200 900 L 1200 1100", nodes: [{x:1200, y:150, name: 'TERM-X'}, {x:1000, y:600, name: 'TERM-Y'}, {x:1200, y:1000, name: 'TERM-Z'}] },
    ], []);

    const coachNetwork = useMemo(() => {
      return coachRoutes.map((route) => (
        <g key={route.id} style={{ willChange: 'transform' }}>
          {/* Interstate Highway Line */}
          <path id={route.id} d={route.d} fill="none" stroke={route.color} strokeWidth="4" opacity="0.3" strokeLinejoin="miter" />
          
          {/* Terminals / Nodes */}
          {route.nodes.map((node, idx) => (
            <g key={idx}>
              <rect x={node.x - 6} y={node.y - 6} width="12" height="12" fill="var(--bg-color)" stroke={route.color} strokeWidth="3" transform={`rotate(45 ${node.x} ${node.y})`} />
              <text x={node.x + 15} y={node.y + 4} fill="var(--text-color)" fontSize="10" fontFamily="monospace" opacity="0.5" letterSpacing="1">{node.name}</text>
            </g>
          ))}

          {/* Coach Bus (Square capsule) traveling the route */}
          <rect width="18" height="18" fill="var(--bg-color)" stroke={route.color} strokeWidth="3" transform="translate(-9, -9)">
            <animateMotion dur={`${Math.random() * 12 + 18}s`} repeatCount="indefinite" rotate="auto">
              <mpath href={`#${route.id}`} />
            </animateMotion>
          </rect>
          
          {/* Second Coach traveling in reverse */}
          <rect width="14" height="14" fill={route.color} transform="translate(-7, -7)">
            <animateMotion dur={`${Math.random() * 12 + 18}s`} begin={`${Math.random() * 8}s`} repeatCount="indefinite" rotate="auto-reverse" keyPoints="1;0" keyTimes="0;1">
              <mpath href={`#${route.id}`} />
            </animateMotion>
          </rect>
        </g>
      ));
    }, [coachRoutes]);

    return (
      <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', willChange: 'transform' }} preserveAspectRatio="xMidYMid slice" viewBox="0 0 1920 1080">
        <pattern id="hex-grid" width="60" height="103.923" patternUnits="userSpaceOnUse" patternTransform="scale(0.5)">
          <path d="M30 0 L60 17.32 L60 51.96 L30 69.28 L0 51.96 L0 17.32 Z" fill="none" stroke="var(--text-color)" strokeWidth="1" opacity="0.04"/>
          <path d="M30 103.92 L60 86.6 L60 51.96 L30 69.28 L0 51.96 L0 86.6 Z" fill="none" stroke="var(--text-color)" strokeWidth="1" opacity="0.04"/>
        </pattern>
        <rect width="100%" height="100%" fill="url(#hex-grid)" />
        {coachNetwork}
      </svg>
    );
  };

  // TRAIN CHERRY: Metro Control Room Map with Cherry Yum Yum scattered
  const TrainCherry = () => {
    // We'll reuse the Metro logic but color it pink/red and add cherry SVGs
    const metroPaths = useMemo(() => [
      { id: 'c1', color: '#ff0a54', d: "M -100 300 L 400 300 A 20 20 0 0 1 414 306 L 586 478 A 20 20 0 0 0 600 484 L 1400 484 A 20 20 0 0 0 1414 478 L 1586 306 A 20 20 0 0 1 1600 300 L 2020 300", stations: [{x:400, y:300, name: 'CRUST'}, {x:600, y:484, name: 'CREAM'}, {x:1400, y:484, name: 'BERRY'}, {x:1600, y:300, name: 'SWEET'}] },
      { id: 'c2', color: '#ff477e', d: "M 1000 -100 L 1000 464 A 20 20 0 0 0 1006 478 L 1086 558 A 20 20 0 0 1 1100 564 L 2020 564", stations: [{x:1000, y:200, name: 'CHERRY-N'}, {x:1000, y:464, name: 'CHERRY-C'}, {x:1100, y:564, name: 'CHERRY-E'}] },
      { id: 'c3', color: '#ff7096', d: "M -100 800 L 400 800 A 20 20 0 0 0 414 794 L 886 322 A 20 20 0 0 1 900 316 L 2020 316", stations: [{x:400, y:800, name: 'SUGAR-1'}, {x:900, y:316, name: 'SUGAR-2'}, {x:1500, y:316, name: 'SUGAR-3'}] },
    ], []);

    const metroNetwork = useMemo(() => {
      return metroPaths.map((line) => {
        return (
          <g key={line.id} style={{ willChange: 'transform' }}>
            <path id={line.id} d={line.d} fill="none" stroke={line.color} strokeWidth="6" strokeLinecap="round" opacity="0.6" />
            {line.stations.map((st, idx) => (
              <g key={idx}>
                <circle cx={st.x} cy={st.y} r="8" fill="var(--bg-color)" stroke={line.color} strokeWidth="4" />
                <text x={st.x + 15} y={st.y - 15} fill={line.color} fontSize="12" fontFamily="monospace" opacity="0.8" fontWeight="bold" letterSpacing="1">{st.name}</text>
              </g>
            ))}
            <rect width="30" height="12" rx="6" fill="#ff0a54" stroke="var(--bg-color)" strokeWidth="2">
              <animateMotion dur={`${Math.random() * 10 + 15}s`} repeatCount="indefinite" rotate="auto">
                <mpath href={`#${line.id}`} />
              </animateMotion>
            </rect>
          </g>
        );
      });
    }, [metroPaths]);

    // Generate random scattered cherries
    const cherries = useMemo(() => {
      return [...Array(15)].map((_, i) => (
        <svg key={`cherry-${i}`} x={Math.random() * 1920 - 50} y={Math.random() * 1080 - 50} width="60" height="60" viewBox="0 0 64 64" opacity="0.3" transform={`rotate(${Math.random() * 360})`}>
          <path d="M 32 30 Q 30 10 45 5" fill="none" stroke="#2d6a4f" strokeWidth="3" strokeLinecap="round" />
          <path d="M 32 30 Q 20 15 15 10" fill="none" stroke="#2d6a4f" strokeWidth="3" strokeLinecap="round" />
          <circle cx="20" cy="45" r="12" fill="#ff0a54" />
          <circle cx="45" cy="40" r="10" fill="#ff0a54" />
          <path d="M 15 40 Q 20 35 25 45" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
          <path d="M 40 35 Q 45 32 50 40" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
        </svg>
      ));
    }, []);

    return (
      <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', willChange: 'transform' }} preserveAspectRatio="xMidYMid slice" viewBox="0 0 1920 1080">
        <rect width="100%" height="100%" fill="var(--bg-color)" opacity="0.5" />
        {metroNetwork}
        {cherries}
      </svg>
    );
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', overflow: 'hidden', pointerEvents: 'none', zIndex: -1, opacity: 0.8 }}>
      {type === 'plane' && <PlaneTrajectories />}
      {type === 'train' && <TrainMetro />}
      {type === 'bus' && <BusHighway />}
      {type === 'train-cherry' && <TrainCherry />}
      
      <div style={{ position: 'absolute', top: '2rem', right: '2rem', fontFamily: 'monospace', fontSize: '0.75rem', color: 'var(--text-color)', opacity: 0.3, textAlign: 'right' }}>
        SYS_T: ACTIVE<br />
        T_MODE: {type ? type.toUpperCase() : 'UNKNOWN'}<br />
        LAT: {Math.random().toFixed(4)} N<br />
        LON: {Math.random().toFixed(4)} W
      </div>
    </div>
  );
});
