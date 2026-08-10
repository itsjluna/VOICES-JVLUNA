import React, { useEffect, useState, useMemo } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';

const useMouseParallax = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const smoothX = useSpring(mouseX, { stiffness: 40, damping: 25, mass: 1.5 });
  const smoothY = useSpring(mouseY, { stiffness: 40, damping: 25, mass: 1.5 });

  useEffect(() => {
    const handleMove = (e) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      mouseX.set(nx);
      mouseY.set(ny);
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, [mouseX, mouseY]);

  return { smoothX, smoothY };
};

const useTimePhase = () => {
  const [timePhase, setTimePhase] = useState('day');
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 8) setTimePhase('dawn');
    else if (hour >= 8 && hour < 17) setTimePhase('day');
    else if (hour >= 17 && hour < 20) setTimePhase('dusk');
    else setTimePhase('night');
  }, []);
  return timePhase;
};

const WindowFrame = ({ bgLayer, midLayer, fgLayer, weatherLayer, timePhase, frameY, mouseFrameX, mouseFrameY, skyColor }) => {
  const isDark = timePhase === 'night' || timePhase === 'dusk';
  const windowStroke = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.8)";
  const windowFill = skyColor || (isDark ? "#050510" : "#e0e5ec");

  return (
    <svg style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh', zIndex: -1, opacity: 0.8 }} preserveAspectRatio="xMidYMid slice" viewBox="0 0 1000 1000">
      <rect x="-500" y="-500" width="2000" height="2000" fill={windowFill} />
      {bgLayer}
      {midLayer}
      {fgLayer}
      {weatherLayer}

      <motion.g style={{ x: mouseFrameX, y: mouseFrameY }}>
        <motion.g style={{ y: frameY }}>
          <path d="M -1000 -1000 L 2000 -1000 L 2000 2000 L -1000 2000 Z M 100 100 L 100 900 L 900 900 L 900 100 Z" fill="var(--bg-color)" />
          <path d="M 366 100 L 366 900 M 633 100 L 633 900" stroke="var(--bg-color)" strokeWidth="30" />
          <path d="M 100 500 L 900 500" stroke="var(--bg-color)" strokeWidth="30" />
          <path d="M 120 120 L 300 300 M 400 120 L 550 270 M 670 120 L 850 300" stroke={windowStroke} strokeWidth="4" opacity="0.1" />
          <path d="M 120 520 L 300 700 M 400 520 L 550 700 M 670 520 L 850 700" stroke={windowStroke} strokeWidth="4" opacity="0.1" />
        </motion.g>
      </motion.g>
    </svg>
  );
};

const AnimatedWaves = ({ strokeColor, opacity }) => {
  const wavePath = useMemo(() => {
    let d = "M -500 0 Q -450 10 -400 0 ";
    for (let i = -300; i <= 1500; i += 100) d += `T ${i} 0 `;
    return d;
  }, []);

  return (
    <g opacity={opacity}>
      <g transform="translate(0, 680)">
        <path d={wavePath} fill="none" stroke={strokeColor} strokeWidth="1.5">
          <animateTransform attributeName="transform" type="translate" from="-200 0" to="0 0" dur="12s" repeatCount="indefinite" />
        </path>
      </g>
      <g transform="translate(0, 720)">
        <path d={wavePath} fill="none" stroke={strokeColor} strokeWidth="1">
          <animateTransform attributeName="transform" type="translate" from="0 0" to="-200 0" dur="18s" repeatCount="indefinite" />
        </path>
      </g>
      <g transform="translate(0, 760)">
        <path d={wavePath} fill="none" stroke={strokeColor} strokeWidth="2">
          <animateTransform attributeName="transform" type="translate" from="-200 0" to="0 0" dur="25s" repeatCount="indefinite" />
        </path>
      </g>
    </g>
  );
};

export const Winter = React.memo(() => {
  const { scrollY } = useScroll();
  const bgScrollY = useTransform(scrollY, [0, 3000], [0, 80]);
  const midScrollY = useTransform(scrollY, [0, 3000], [0, 200]);
  const fgScrollY = useTransform(scrollY, [0, 3000], [0, 350]);
  const frameScrollY = useTransform(scrollY, [0, 3000], [0, -100]);

  const { smoothX, smoothY } = useMouseParallax();
  const mouseBgX = useTransform(smoothX, [-1, 1], [-2, 2]);
  const mouseBgY = useTransform(smoothY, [-1, 1], [-2, 2]);
  const mouseMidX = useTransform(smoothX, [-1, 1], [-5, 5]);
  const mouseMidY = useTransform(smoothY, [-1, 1], [-5, 5]);
  const mouseFgX = useTransform(smoothX, [-1, 1], [-10, 10]);
  const mouseFgY = useTransform(smoothY, [-1, 1], [-10, 10]);
  const mouseFrameX = useTransform(smoothX, [-1, 1], [12, -12]);
  const mouseFrameY = useTransform(smoothY, [-1, 1], [12, -12]);

  const timePhase = useTimePhase();
  const isDark = timePhase === 'night' || timePhase === 'dusk';

  const colors = {
    dawn: { mntnBg: "#b3a6b3", mntnFg: "#9a8c9a", snow: "#fcedec", lake: "#b0bacc", coast: "#e3d3dd", sky: "#e2c4d0" },
    day: { mntnBg: "#c6d4e1", mntnFg: "#b0c4d6", snow: "#ffffff", lake: "#a1b8ce", coast: "#e0e8f0", sky: "#d9e4ec" },
    dusk: { mntnBg: "#636d7a", mntnFg: "#535d6a", snow: "#c0cddb", lake: "#778696", coast: "#a6b9cd", sky: "#8897a6" },
    night: { mntnBg: "#2c3b4a", mntnFg: "#23303d", snow: "#9caec0", lake: "#1e2a36", coast: "#354759", sky: "#0d111a" }
  };
  const { mntnBg, mntnFg, snow, lake, coast, sky } = colors[timePhase];

  const snowflakes = useMemo(() => {
    return [...Array(60)].map((_, i) => {
      const cx = Math.random() * 1200 - 100;
      const cy = Math.random() * -1000 - 100;
      const r = Math.random() * 3 + 1;
      const dur = Math.random() * 10 + 6;
      const sway = Math.random() * 50 + 20;
      
      return (
        <circle key={i} cx={cx} cy={cy} r={r} fill="#fff" opacity={Math.random() * 0.5 + 0.3}>
          <animate attributeName="cy" from={cy} to={cy + 1300} dur={`${dur}s`} repeatCount="indefinite" />
          <animate attributeName="cx" values={`${cx}; ${cx + sway}; ${cx - sway/2}; ${cx}`} dur={`${dur * 0.65}s`} repeatCount="indefinite" calcMode="spline" keyTimes="0; 0.333; 0.666; 1" keySplines="0.42 0 0.58 1; 0.42 0 0.58 1; 0.42 0 0.58 1" />
        </circle>
      );
    });
  }, []);

  const auroras = useMemo(() => {
    return (
      <g>
        <defs>
          <linearGradient id="aurora-grad-0" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#43e97b" stopOpacity="0" />
            <stop offset="50%" stopColor="#38f9d7" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#43e97b" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="aurora-grad-1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8fd3f4" stopOpacity="0" />
            <stop offset="50%" stopColor="#84fab0" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#8fd3f4" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[...Array(2)].map((_, i) => (
          <path key={`aurora-${i}`} d="M-200 400 Q 300 300 700 350 T 1400 400" fill="none" stroke={`url(#aurora-grad-${i})`} strokeWidth={120 - i * 40} opacity={0.6 + i * 0.2} filter="blur(30px)">
            <animate attributeName="d" values="M-200 400 Q 300 250 700 350 T 1400 400; M-200 400 Q 400 450 800 300 T 1400 400; M-200 400 Q 300 250 700 350 T 1400 400" dur={`${40 + i * 20}s`} repeatCount="indefinite" calcMode="spline" keyTimes="0; 0.5; 1" keySplines="0.42 0 0.58 1; 0.42 0 0.58 1" />
          </path>
        ))}
      </g>
    );
  }, []);

  const frostHaze = useMemo(() => {
    return [...Array(3)].map((_, i) => (
      <path key={`haze-${i}`} d={`M-500 ${700 + i * 50} Q 0 ${600 + i * 50} 500 ${700 + i * 50} T 1500 ${700 + i * 50} L 1500 1200 L -500 1200 Z`} fill="#ffffff" opacity={0.25 - i * 0.05} filter="blur(20px)">
        <animateTransform attributeName="transform" type="translate" from="0 0" to="-300 0" dur={`${40 + i * 15}s`} repeatCount="indefinite" />
        <animate attributeName="opacity" values={`${0.2 - i*0.05}; ${0.35 - i*0.05}; ${0.2 - i*0.05}`} dur={`${12 + i * 3}s`} repeatCount="indefinite" calcMode="spline" keyTimes="0; 0.5; 1" keySplines="0.42 0 0.58 1; 0.42 0 0.58 1" />
      </path>
    ));
  }, []);

  const blizzard = useMemo(() => {
    return [...Array(100)].map((_, i) => {
      const cy = Math.random() * 1000 + 100;
      const dur = Math.random() * 1.5 + 0.5;
      const opacity = Math.random() * 0.4 + 0.2;
      return (
        <line key={`blizz-${i}`} x1="1400" y1={cy} x2="1350" y2={cy + 10} stroke="#fff" strokeWidth={Math.random() * 2 + 1} opacity={opacity}>
          <animateTransform attributeName="transform" type="translate" from="0 0" to="-1600 200" dur={`${dur}s`} begin={`${Math.random()}s`} repeatCount="indefinite" />
        </line>
      );
    });
  }, []);

  const bgLayer = (
    <motion.g style={{ x: mouseBgX, y: mouseBgY }}>
      <motion.g style={{ y: bgScrollY }}>
        <path d="M -200 650 L 100 500 L 300 600 L 600 450 L 900 650 L 1200 550 L 1200 1000 L -200 1000 Z" fill={mntnBg} />
      </motion.g>
    </motion.g>
  );

  const midLayer = (
    <motion.g style={{ x: mouseMidX, y: mouseMidY }}>
      <motion.g style={{ y: midScrollY }}>
        <path d="M -200 700 L 150 450 L 350 600 L 550 350 L 850 650 L 1200 450 L 1200 1000 L -200 1000 Z" fill={mntnFg} />
        <path d="M 100 533 L 150 450 L 210 515 Q 150 540 100 533 Z M 480 440 L 550 350 L 630 460 Q 560 490 480 440 Z M 1100 505 L 1200 450 L 1250 510 Q 1150 550 1100 505 Z" fill={snow} />
      </motion.g>
    </motion.g>
  );

  const fgLayer = (
    <motion.g style={{ x: mouseFgX, y: mouseFgY }}>
      <motion.g style={{ y: fgScrollY }}>
        <rect x="-200" y="650" width="1400" height="400" fill={lake} />
        
        {/* Ice drift lines instead of rolling waves */}
        <path d="M 200 700 L 350 700 M 250 750 L 500 750 M 600 720 L 900 720 M 100 800 L 400 800 M 700 820 L 1100 820" stroke={snow} strokeWidth="1" opacity="0.3">
          <animateTransform attributeName="transform" type="translate" from="-50 0" to="50 0" dur="20s" repeatCount="indefinite" />
        </path>
        
        <g transform="translate(0, -130)">
        {/* Jagged icy coastline */}
        <path d="M -200 1000 L -200 820 L 0 810 L 50 830 L 150 820 L 300 850 L 500 830 L 700 860 L 850 840 L 1000 870 L 1200 850 L 1200 1000 Z" fill={coast} />
        
        {/* Left framing icy rocks */}
        <path d="M -100 850 Q 50 820 150 900 T 250 1000 L -100 1000 Z" fill={coast} />
        <path d="M -50 880 Q 20 860 80 920" stroke={snow} strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M 50 930 Q 120 900 180 1000" stroke={mntnFg} strokeWidth="2" fill="none" strokeLinecap="round" />
        
        {/* Right framing icy rocks */}
        <path d="M 1100 800 Q 950 820 850 950 T 750 1050 L 1100 1050 Z" fill={coast} />
        <path d="M 980 840 Q 900 860 880 920" stroke={snow} strokeWidth="3" fill="none" strokeLinecap="round" />
        
        {/* Barren Tree/Shrubs on the left */}
        <path d="M 150 850 L 150 720 M 150 780 L 120 740 M 150 760 L 180 720 M 120 740 L 100 720 M 120 740 L 125 700" stroke={mntnFg} strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M 50 950 L 40 850 M 50 900 L 20 860 M 50 880 L 80 840" stroke={mntnFg} strokeWidth="2" fill="none" strokeLinecap="round" />
        
        {/* Barren Tree on the right */}
        <path d="M 850 880 L 850 680 M 850 780 L 790 710 M 850 750 L 920 680 M 790 710 L 760 670 M 920 680 L 950 640" stroke={mntnFg} strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M 950 950 L 930 850 M 950 910 L 900 880 M 950 890 L 980 840" stroke={mntnFg} strokeWidth="2" fill="none" strokeLinecap="round" />
      </g>
      </motion.g>
    </motion.g>
  );

  const renderWeather = () => {
    if (timePhase === 'dawn') return <motion.g style={{ y: bgScrollY }} opacity="0.8">{frostHaze}</motion.g>;
    if (timePhase === 'dusk') return <motion.g style={{ y: bgScrollY }} opacity="0.8">{blizzard}</motion.g>;
    if (timePhase === 'night') return <motion.g style={{ y: bgScrollY }} opacity="0.8">{auroras}{snowflakes}</motion.g>;
    return <motion.g style={{ y: bgScrollY }} opacity="0.8">{snowflakes}</motion.g>;
  };

  return <WindowFrame timePhase={timePhase} skyColor={sky} bgLayer={bgLayer} midLayer={midLayer} fgLayer={fgLayer} weatherLayer={renderWeather()} frameY={frameScrollY} mouseFrameX={mouseFrameX} mouseFrameY={mouseFrameY} />;
});

export const Spring = React.memo(() => {
  const { scrollY } = useScroll();
  const bgScrollY = useTransform(scrollY, [0, 3000], [0, 80]);
  const midScrollY = useTransform(scrollY, [0, 3000], [0, 200]);
  const fgScrollY = useTransform(scrollY, [0, 3000], [0, 350]);
  const frameScrollY = useTransform(scrollY, [0, 3000], [0, -100]);

  const { smoothX, smoothY } = useMouseParallax();
  const mouseBgX = useTransform(smoothX, [-1, 1], [-2, 2]);
  const mouseBgY = useTransform(smoothY, [-1, 1], [-2, 2]);
  const mouseMidX = useTransform(smoothX, [-1, 1], [-5, 5]);
  const mouseMidY = useTransform(smoothY, [-1, 1], [-5, 5]);
  const mouseFgX = useTransform(smoothX, [-1, 1], [-10, 10]);
  const mouseFgY = useTransform(smoothY, [-1, 1], [-10, 10]);
  const mouseFrameX = useTransform(smoothX, [-1, 1], [12, -12]);
  const mouseFrameY = useTransform(smoothY, [-1, 1], [12, -12]);

  const timePhase = useTimePhase();
  const isDark = timePhase === 'night' || timePhase === 'dusk';

  const colors = {
    dawn: { hillBg: "#a8c0af", hillFg: "#96b29d", lake: "#d4e6db", coast: "#a3c0a5", sky: "#ffebd6", leafColor: "#fff8e7" },
    day: { hillBg: "#b4cbb7", hillFg: "#a1bba5", lake: "#b0d0ce", coast: "#8eb394", sky: "#e4efde", leafColor: "#ffffff" },
    dusk: { hillBg: "#607a65", hillFg: "#526c57", lake: "#7e9c9b", coast: "#5c8263", sky: "#ffd8c4", leafColor: "#ffcce0" },
    night: { hillBg: "#384a3c", hillFg: "#2d3d31", lake: "#24322d", coast: "#202e23", sky: "#091209", leafColor: "#a0c0a0" }
  };
  const { hillBg, hillFg, lake, coast, sky, leafColor } = colors[timePhase];

  const dandelions = useMemo(() => {
    return [...Array(80)].map((_, i) => {
      const left = -200 - Math.random() * 500;
      const top = Math.random() * 800 + 100;
      const dur = Math.random() * 8 + 6;
      return (
        <g key={i} opacity={Math.random() * 0.4 + 0.6}>
          <animateTransform attributeName="transform" type="translate" from={`${left} ${top}`} to={`${left + 1500} ${top - 200 + Math.random() * 400}`} dur={`${dur}s`} begin={`-${Math.random() * 10}s`} repeatCount="indefinite" />
          <g transform={`scale(${Math.random() * 0.8 + 0.8})`}>
            <animateTransform attributeName="transform" type="rotate" values="-15; 25; -20; -15" dur={`${dur * 0.5}s`} repeatCount="indefinite" additive="sum" calcMode="spline" keyTimes="0; 0.333; 0.666; 1" keySplines="0.42 0 0.58 1; 0.42 0 0.58 1; 0.42 0 0.58 1" />
            <circle cx="0" cy="0" r="1.5" fill={leafColor} />
            <path d="M 0 0 L -3 -5 M 0 0 L 0 -6 M 0 0 L 3 -5 M 0 0 L -4 -2 M 0 0 L 4 -2" stroke={leafColor} strokeWidth="0.5" opacity="0.8" />
            <path d="M 0 0 L 0 8" stroke={hillFg} strokeWidth="0.5" />
          </g>
        </g>
      );
    });
  }, [leafColor, hillFg]);

  const glowingPollen = useMemo(() => {
    return [...Array(60)].map((_, i) => {
      const left = Math.random() * 1200 - 100;
      const top = Math.random() * 1000 + 200;
      const dur = Math.random() * 8 + 6;
      return (
        <circle key={`pollen-${i}`} cx={left} cy={top} r={Math.random() * 2 + 1} fill="#e2f1af" opacity={Math.random() * 0.6 + 0.4} filter="drop-shadow(0 0 6px #e2f1af)">
          <animate attributeName="cy" from={top} to={top - 500} dur={`${dur}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" values="0; 1; 0.2; 0.8; 0" dur={`${dur}s`} repeatCount="indefinite" calcMode="spline" keyTimes="0; 0.25; 0.5; 0.75; 1" keySplines="0.42 0 0.58 1; 0.42 0 0.58 1; 0.42 0 0.58 1; 0.42 0 0.58 1" />
          <animateTransform attributeName="transform" type="translate" values={`0,0; ${Math.random()*60-30},0; 0,0`} dur={`${dur*1.2}s`} repeatCount="indefinite" calcMode="spline" keyTimes="0; 0.5; 1" keySplines="0.42 0 0.58 1; 0.42 0 0.58 1" />
        </circle>
      );
    });
  }, []);

  const lightRays = useMemo(() => {
    return (
      <g>
        <defs>
          <linearGradient id="ray-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fff" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[...Array(4)].map((_, i) => (
          <polygon key={`ray-${i}`} points={`${i*300},-100 ${i*300+400},-100 ${i*300-100},1200 ${i*300-400},1200`} fill="url(#ray-grad)">
            <animate attributeName="opacity" values="0.4; 0.8; 0.4" dur={`${10 + i * 2}s`} repeatCount="indefinite" calcMode="spline" keyTimes="0; 0.5; 1" keySplines="0.42 0 0.58 1; 0.42 0 0.58 1" />
          </polygon>
        ))}
      </g>
    );
  }, []);

  const cherryBlossoms = useMemo(() => {
    return [...Array(60)].map((_, i) => {
      const left = -200 - Math.random() * 500;
      const top = Math.random() * 800 + 100;
      const dur = Math.random() * 6 + 4;
      return (
        <g key={`blossom-${i}`} opacity={Math.random() * 0.4 + 0.6}>
          <animateTransform attributeName="transform" type="translate" from={`${left} ${top}`} to={`${left + 1500} ${top + 300}`} dur={`${dur}s`} begin={`-${Math.random() * 10}s`} repeatCount="indefinite" />
          <path d="M 0 0 C 3 -3, 8 -3, 10 0 C 12 3, 7 8, 0 5 Z" fill="#ffb7c5">
            <animateTransform attributeName="transform" type="rotate" values="0; 360" dur={`${Math.random() * 2 + 1}s`} repeatCount="indefinite" additive="sum" />
          </path>
        </g>
      );
    });
  }, []);

  const bgLayer = (
    <motion.g style={{ x: mouseBgX, y: mouseBgY }}>
      <motion.g style={{ y: bgScrollY }}>
        <circle cx="250" cy="300" r="40" fill={isDark ? "#e0e8dc" : "#faecd7"} opacity={isDark ? "0.9" : "0.7"} />
        <path d="M -200 680 Q 100 550 400 650 T 1200 620 L 1200 1000 L -200 1000 Z" fill={hillBg} />
      </motion.g>
    </motion.g>
  );

  const midLayer = (
    <motion.g style={{ x: mouseMidX, y: mouseMidY }}>
      <motion.g style={{ y: midScrollY }}>
        <path d="M -200 650 Q 250 520 550 630 T 1200 580 L 1200 1000 L -200 1000 Z" fill={hillFg} />
        {/* Budding Tree Left */}
        <path d="M 300 600 L 300 550" stroke={hillBg} strokeWidth="6" strokeLinecap="round" />
        <circle cx="300" cy="535" r="25" fill={coast} />
        <circle cx="290" cy="545" r="15" fill={hillFg} />
      </motion.g>
    </motion.g>
  );

  const fgLayer = (
    <motion.g style={{ x: mouseFgX, y: mouseFgY }}>
      <motion.g style={{ y: fgScrollY }}>
        <rect x="-200" y="630" width="1400" height="400" fill={lake} />
        <AnimatedWaves strokeColor={isDark ? "#354841" : "#cde2e0"} opacity="0.6" />
        
        <g transform="translate(0, -130)">
        {/* Rolling Grassy Coastline */}
        <path d="M -200 1000 L -200 850 Q 0 830 200 860 T 600 840 T 1000 870 T 1200 850 L 1200 1000 Z" fill={coast} />
        
        {/* Left framing grass mound */}
        <path d="M -150 820 Q 50 800 180 950 T 250 1050 L -150 1050 Z" fill={coast} />
        <path d="M -50 840 Q 30 830 80 900" stroke={hillBg} strokeWidth="3" fill="none" strokeLinecap="round" />
        {/* Spring Bush Left */}
        <circle cx="20" cy="880" r="30" fill={hillFg} />
        <circle cx="60" cy="910" r="25" fill={hillBg} />
        <circle cx="-10" cy="930" r="40" fill={hillFg} />

        {/* Right framing grass mound */}
        <path d="M 1150 780 Q 900 780 800 950 T 700 1050 L 1150 1050 Z" fill={coast} />
        <path d="M 980 820 Q 880 840 850 920" stroke={hillBg} strokeWidth="3" fill="none" strokeLinecap="round" />
        {/* Spring Bush Right */}
        <circle cx="950" cy="850" r="40" fill={hillFg} />
        <circle cx="890" cy="890" r="35" fill={hillBg} />
        <circle cx="1000" cy="920" r="50" fill={hillFg} />
        
        <path d="M 480 885 Q 490 860 500 885 Q 510 860 520 885" fill="none" stroke={hillBg} strokeWidth="2" />
        <path d="M 500 885 L 500 900" stroke={hillBg} strokeWidth="2" />
      </g>
      </motion.g>
    </motion.g>
  );

  const renderWeather = () => {
    if (timePhase === 'dawn') return <motion.g style={{ y: bgScrollY }}>{lightRays}{dandelions}</motion.g>;
    if (timePhase === 'dusk') return <motion.g style={{ y: bgScrollY }}>{cherryBlossoms}</motion.g>;
    if (timePhase === 'night') return <motion.g style={{ y: bgScrollY }}>{glowingPollen}</motion.g>;
    return <motion.g style={{ y: bgScrollY }}>{dandelions}</motion.g>;
  };

  return <WindowFrame timePhase={timePhase} skyColor={sky} bgLayer={bgLayer} midLayer={midLayer} fgLayer={fgLayer} weatherLayer={renderWeather()} frameY={frameScrollY} mouseFrameX={mouseFrameX} mouseFrameY={mouseFrameY} />;
});

export const Summer = React.memo(() => {
  const { scrollY } = useScroll();
  const bgScrollY = useTransform(scrollY, [0, 3000], [0, 80]);
  const midScrollY = useTransform(scrollY, [0, 3000], [0, 200]);
  const fgScrollY = useTransform(scrollY, [0, 3000], [0, 350]);
  const frameScrollY = useTransform(scrollY, [0, 3000], [0, -100]);

  const { smoothX, smoothY } = useMouseParallax();
  const mouseBgX = useTransform(smoothX, [-1, 1], [-2, 2]);
  const mouseBgY = useTransform(smoothY, [-1, 1], [-2, 2]);
  const mouseMidX = useTransform(smoothX, [-1, 1], [-5, 5]);
  const mouseMidY = useTransform(smoothY, [-1, 1], [-5, 5]);
  const mouseFgX = useTransform(smoothX, [-1, 1], [-10, 10]);
  const mouseFgY = useTransform(smoothY, [-1, 1], [-10, 10]);
  const mouseFrameX = useTransform(smoothX, [-1, 1], [12, -12]);
  const mouseFrameY = useTransform(smoothY, [-1, 1], [12, -12]);

  const timePhase = useTimePhase();
  const isDark = timePhase === 'night' || timePhase === 'dusk';

  const colors = {
    dawn: { mntnBg: "#a0a4b8", mntnFg: "#8a8f9c", lake: "#d4e0e8", coast: "#b0b5aa", sky: "#ffebd6" },
    day: { mntnBg: "#d8c4a1", mntnFg: "#cdb385", lake: "#b0cfda", coast: "#eaddbc", sky: "#faead3" },
    dusk: { mntnBg: "#8f7363", mntnFg: "#7a5c4d", lake: "#8a9ea8", coast: "#a38c75", sky: "#e8b89e" },
    night: { mntnBg: "#3b3b4f", mntnFg: "#2a2a3c", lake: "#1c2137", coast: "#4b4b3b", sky: "#0d0d17" }
  };
  const { mntnBg, mntnFg, lake, coast, sky } = colors[timePhase];

  const fireflies = useMemo(() => {
    return [...Array(40)].map((_, i) => {
      const cx = Math.random() * 1200 - 100;
      const cy = Math.random() * 400 + 400;
      const r = Math.random() * 3 + 1.5;
      const dur = Math.random() * 4 + 3;
      return (
        <circle key={i} cx={cx} cy={cy} r={r} fill="#e9ff70" filter="drop-shadow(0 0 8px #e9ff70)">
          <animate attributeName="opacity" values="0.1; 1; 0.1" dur={`${dur}s`} repeatCount="indefinite" calcMode="spline" keyTimes="0; 0.5; 1" keySplines="0.42 0 0.58 1; 0.42 0 0.58 1" />
          <animateTransform attributeName="transform" type="translate" values={`0,0; ${Math.random()*80-40},${Math.random()*80-40}; 0,0`} dur={`${dur*1.5}s`} repeatCount="indefinite" calcMode="spline" keyTimes="0; 0.5; 1" keySplines="0.42 0 0.58 1; 0.42 0 0.58 1" />
        </circle>
      );
    });
  }, []);

  const summerRain = useMemo(() => {
    return [...Array(70)].map((_, i) => {
      const left = Math.random() * 1400 - 200;
      const dur = Math.random() * 0.2 + 0.35;
      const delay = Math.random();
      return (
        <g key={`rain-${i}`}>
          <line x1={left} y1="-100" x2={left - 80} y2="40" stroke="#90e0ef" strokeWidth="1.5" opacity={Math.random() * 0.4 + 0.2}>
            <animateTransform attributeName="transform" type="translate" from="0 0" to="-300 1200" dur={`${dur}s`} begin={`${delay}s`} repeatCount="indefinite" />
          </line>
          {/* Splash */}
          <ellipse cx={left - 270} cy="1000" rx="3" ry="1" fill="none" stroke="#90e0ef" strokeWidth="1.5" opacity="0">
            <animate attributeName="opacity" values="0; 0.6; 0" dur={`${dur}s`} begin={`${delay}s`} repeatCount="indefinite" />
            <animate attributeName="rx" values="0; 12; 25" dur={`${dur}s`} begin={`${delay}s`} repeatCount="indefinite" />
            <animate attributeName="ry" values="0; 3; 6" dur={`${dur}s`} begin={`${delay}s`} repeatCount="indefinite" />
          </ellipse>
        </g>
      );
    });
  }, []);

  const birds = useMemo(() => {
    return [...Array(12)].map((_, i) => {
      const dur = Math.random() * 15 + 15;
      return (
        <g key={`bird-${i}`}>
          <animateTransform attributeName="transform" type="translate" from="-100 0" to="1500 -200" dur={`${dur}s`} begin={`${Math.random() * 10}s`} repeatCount="indefinite" />
          <path d="M 0 0 Q 5 -5 10 0 Q 5 -2 0 0 M 10 0 Q 15 -5 20 0 Q 15 -2 10 0" fill="none" stroke="#5a5e6d" strokeWidth="1.5">
            <animate attributeName="d" values="M 0 0 Q 5 -5 10 0 Q 5 -2 0 0 M 10 0 Q 15 -5 20 0 Q 15 -2 10 0; M 0 0 Q 5 5 10 0 Q 5 2 0 0 M 10 0 Q 15 5 20 0 Q 15 2 10 0; M 0 0 Q 5 -5 10 0 Q 5 -2 0 0 M 10 0 Q 15 -5 20 0 Q 15 -2 10 0" dur="0.8s" repeatCount="indefinite" />
          </path>
        </g>
      );
    });
  }, []);

  const goldenDust = useMemo(() => {
    return [...Array(60)].map((_, i) => {
      const cx = Math.random() * 1200 - 100;
      const cy = Math.random() * 800 + 200;
      const dur = Math.random() * 8 + 6;
      return (
        <circle key={`dust-${i}`} cx={cx} cy={cy} r={Math.random() * 2 + 0.5} fill="#ffcc70" opacity={Math.random() * 0.5 + 0.2} filter="drop-shadow(0 0 3px #ffcc70)">
          <animate attributeName="opacity" values="0.1; 0.8; 0.1" dur={`${dur}s`} repeatCount="indefinite" calcMode="spline" keyTimes="0; 0.5; 1" keySplines="0.42 0 0.58 1; 0.42 0 0.58 1" />
          <animateTransform attributeName="transform" type="translate" values={`0,0; ${Math.random()*40-20},${Math.random()*40-20}; 0,0`} dur={`${dur*1.5}s`} repeatCount="indefinite" calcMode="spline" keyTimes="0; 0.5; 1" keySplines="0.42 0 0.58 1; 0.42 0 0.58 1" />
        </circle>
      );
    });
  }, []);

  const bgLayer = (
    <motion.g style={{ x: mouseBgX, y: mouseBgY }}>
      <motion.g style={{ y: bgScrollY }}>
        {isDark ? (
          <path d="M 800 200 A 50 50 0 1 1 730 130 A 60 60 0 0 0 800 200 Z" fill="#ffeedd" opacity="0.9" />
        ) : (
          <circle cx="500" cy="500" r="300" fill="#f7e0a3" opacity="0.3" />
        )}
        <path d="M -100 650 L 50 450 L 250 650 M 500 650 L 650 400 L 850 650 L 850 1000 L -100 1000 Z" fill={mntnBg} />
      </motion.g>
    </motion.g>
  );

  const midLayer = (
    <motion.g style={{ x: mouseMidX, y: mouseMidY }}>
      <motion.g style={{ y: midScrollY }}>
        <path d="M -200 650 L 100 350 L 350 600 L 700 200 L 1000 600 L 1200 450 L 1200 1000 L -200 1000 Z" fill={mntnFg} />
        <path d="M 200 650 L 200 580 M 180 620 L 220 620 M 190 600 L 210 600 M 195 580 L 205 580" stroke={coast} strokeWidth="4" strokeLinecap="round" />
        <path d="M 850 650 L 850 520 M 820 600 L 880 600 M 830 560 L 870 560 M 840 530 L 860 530" stroke={coast} strokeWidth="5" strokeLinecap="round" />
      </motion.g>
    </motion.g>
  );

  const fgLayer = (
    <motion.g style={{ x: mouseFgX, y: mouseFgY }}>
      <motion.g style={{ y: fgScrollY }}>
        <rect x="-200" y="650" width="1400" height="400" fill={lake} />
        <AnimatedWaves strokeColor={isDark ? "#262e49" : "#cce1e8"} opacity="0.8" />
        
        <g transform="translate(0, -130)">
        {/* Smooth Sandy/Grassy Coast */}
        <path d="M -200 1000 L -200 880 Q 200 860 500 890 T 1200 870 L 1200 1000 Z" fill={coast} />

        {/* Left sand bank & tall grass */}
        <path d="M -100 850 Q 80 850 200 950 T 300 1050 L -100 1050 Z" fill={coast} />
        <path d="M 50 900 Q 150 900 180 980" stroke={mntnBg} strokeWidth="3" fill="none" strokeLinecap="round" />
        {/* Tall reeds left */}
        <path d="M 80 950 Q 100 850 120 780 M 100 950 Q 130 880 150 800 M 50 950 Q 80 880 90 820" stroke={mntnFg} strokeWidth="2" fill="none" strokeLinecap="round" />

        {/* Right sand bank & rocks */}
        <path d="M 1100 800 Q 950 800 800 950 T 700 1050 L 1100 1050 Z" fill={coast} />
        <path d="M 950 850 Q 850 880 820 950" stroke={mntnBg} strokeWidth="3" fill="none" strokeLinecap="round" />
        {/* Smooth rocks right */}
        <ellipse cx="900" cy="920" rx="40" ry="20" fill={mntnFg} />
        <ellipse cx="840" cy="950" rx="50" ry="25" fill={mntnBg} />
        <ellipse cx="980" cy="900" rx="30" ry="15" fill={lake} opacity="0.5" />
      </g>
      </motion.g>
    </motion.g>
  );

  const renderWeather = () => {
    if (timePhase === 'dawn') return <motion.g style={{ y: bgScrollY }}>{birds}</motion.g>;
    if (timePhase === 'dusk') return <motion.g style={{ y: bgScrollY }}>{goldenDust}</motion.g>;
    if (timePhase === 'night') return <motion.g style={{ y: bgScrollY }}>{fireflies}</motion.g>;
    return <motion.g style={{ y: bgScrollY }}>{summerRain}</motion.g>;
  };

  return <WindowFrame timePhase={timePhase} skyColor={sky} bgLayer={bgLayer} midLayer={midLayer} fgLayer={fgLayer} weatherLayer={renderWeather()} frameY={frameScrollY} mouseFrameX={mouseFrameX} mouseFrameY={mouseFrameY} />;
});

export const Autumn = React.memo(() => {
  const { scrollY } = useScroll();
  const bgScrollY = useTransform(scrollY, [0, 3000], [0, 80]);
  const midScrollY = useTransform(scrollY, [0, 3000], [0, 200]);
  const fgScrollY = useTransform(scrollY, [0, 3000], [0, 350]);
  const frameScrollY = useTransform(scrollY, [0, 3000], [0, -100]);

  const { smoothX, smoothY } = useMouseParallax();
  const mouseBgX = useTransform(smoothX, [-1, 1], [-2, 2]);
  const mouseBgY = useTransform(smoothY, [-1, 1], [-2, 2]);
  const mouseMidX = useTransform(smoothX, [-1, 1], [-5, 5]);
  const mouseMidY = useTransform(smoothY, [-1, 1], [-5, 5]);
  const mouseFgX = useTransform(smoothX, [-1, 1], [-10, 10]);
  const mouseFgY = useTransform(smoothY, [-1, 1], [-10, 10]);
  const mouseFrameX = useTransform(smoothX, [-1, 1], [12, -12]);
  const mouseFrameY = useTransform(smoothY, [-1, 1], [12, -12]);

  const timePhase = useTimePhase();
  const isDark = timePhase === 'night' || timePhase === 'dusk';

  const colors = {
    dawn: { hillBg: "#a88e84", hillFg: "#8a7066", lake: "#e0d3cb", coast: "#967568", sky: "#ffe3d6" },
    day: { hillBg: "#d8a088", hillFg: "#c4886f", lake: "#e6cfbd", coast: "#ba7d62", sky: "#f4e4d7" },
    dusk: { hillBg: "#965538", hillFg: "#804326", lake: "#a88b7f", coast: "#7a4128", sky: "#d69778" },
    night: { hillBg: "#4d2f23", hillFg: "#3a2117", lake: "#241814", coast: "#43281a", sky: "#140e0b" }
  };
  const { hillBg, hillFg, lake, coast, sky } = colors[timePhase];

  const leaves = useMemo(() => {
    return [...Array(40)].map((_, i) => {
      const startX = -100 - Math.random() * 200;
      const startY = Math.random() * 800 + 100;
      const dur = Math.random() * 8 + 6;
      return (
        <g key={i}>
          <animateTransform attributeName="transform" type="translate" from={`${startX} ${startY}`} to={`${startX + 1500} ${startY + (Math.random() * 400 - 100)}`} dur={`${dur}s`} repeatCount="indefinite" />
          <path d="M 0 0 C 10 5, 20 15, 25 5 C 30 -5, 15 -15, 0 0 Z" fill={isDark ? "#733e24" : "#c97b5f"} opacity={0.9}>
            <animateTransform attributeName="transform" type="rotate" values="0 10 0; 360 10 0" dur={`${Math.random() * 3 + 1.5}s`} repeatCount="indefinite" />
          </path>
        </g>
      );
    });
  }, [isDark]);

  const autumnFog = useMemo(() => {
    return [...Array(4)].map((_, i) => (
      <path key={`fog-${i}`} d={`M-500 ${750 + i * 40} Q 0 ${600 + i * 50} 500 ${750 + i * 40} T 1500 ${750 + i * 40} L 1500 1200 L -500 1200 Z`} fill="#d8d0c8" opacity={0.35 - i * 0.05} filter="blur(45px)">
        <animateTransform attributeName="transform" type="translate" from="0 0" to="-500 0" dur={`${35 + i * 15}s`} repeatCount="indefinite" />
        <animate attributeName="opacity" values={`${0.3 - i*0.05}; ${0.4 - i*0.05}; ${0.3 - i*0.05}`} dur={`${10 + i * 2}s`} repeatCount="indefinite" calcMode="spline" keyTimes="0; 0.5; 1" keySplines="0.42 0 0.58 1; 0.42 0 0.58 1" />
      </path>
    ));
  }, []);

  const morningFog = useMemo(() => {
    return [...Array(3)].map((_, i) => (
      <path key={`mfog-${i}`} d={`M-500 ${750 + i * 40} Q 0 ${600 + i * 50} 500 ${750 + i * 40} T 1500 ${750 + i * 40} L 1500 1200 L -500 1200 Z`} fill="#f0f4f8" opacity={0.4 - i * 0.05} filter="blur(30px)">
        <animateTransform attributeName="transform" type="translate" from="0 0" to="-400 -50" dur={`${40 + i * 15}s`} repeatCount="indefinite" />
        <animate attributeName="opacity" values={`${0.3 - i*0.05}; ${0.5 - i*0.05}; ${0.3 - i*0.05}`} dur={`${12 + i * 2}s`} repeatCount="indefinite" calcMode="spline" keyTimes="0; 0.5; 1" keySplines="0.42 0 0.58 1; 0.42 0 0.58 1" />
      </path>
    ));
  }, []);

  const swirlingLeaves = useMemo(() => {
    return [...Array(40)].map((_, i) => {
      const startX = -100 - Math.random() * 200;
      const startY = Math.random() * 800 + 100;
      const dur = Math.random() * 5 + 3;
      return (
        <g key={`swirl-${i}`}>
          <animateTransform attributeName="transform" type="translate" from={`${startX} ${startY}`} to={`${startX + 1500} ${startY + (Math.random() * 800 - 400)}`} dur={`${dur}s`} repeatCount="indefinite" />
          <path d="M 0 0 C 10 5, 20 15, 25 5 C 30 -5, 15 -15, 0 0 Z" fill="#8c3310" opacity={0.9}>
            <animateTransform attributeName="transform" type="rotate" values="0 10 0; 720 10 0" dur={`${Math.random() * 1.5 + 0.5}s`} repeatCount="indefinite" />
          </path>
        </g>
      );
    });
  }, []);

  const bgLayer = (
    <motion.g style={{ x: mouseBgX, y: mouseBgY }}>
      <motion.g style={{ y: bgScrollY }}>
        <circle cx="800" cy="400" r="100" fill={isDark ? "#d8b39c" : "#ecbc9b"} opacity="0.3" />
        <path d="M -200 650 Q 100 500 400 650 T 1200 550 L 1200 1000 L -200 1000 Z" fill={hillBg} />
      </motion.g>
    </motion.g>
  );

  const midLayer = (
    <motion.g style={{ x: mouseMidX, y: mouseMidY }}>
      <motion.g style={{ y: midScrollY }}>
        <path d="M -200 670 Q 250 550 550 670 T 1200 620 L 1200 1000 L -200 1000 Z" fill={hillFg} />
        {/* Autumn Tree Left */}
        <path d="M 200 610 L 200 540" stroke={hillBg} strokeWidth="8" strokeLinecap="round" />
        <circle cx="200" cy="520" r="35" fill={coast} />
        <circle cx="185" cy="535" r="20" fill={isDark ? "#733e24" : "#c97b5f"} />
        <circle cx="215" cy="525" r="25" fill={hillFg} />
      </motion.g>
    </motion.g>
  );

  const fgLayer = (
    <motion.g style={{ x: mouseFgX, y: mouseFgY }}>
      <motion.g style={{ y: fgScrollY }}>
        <rect x="-200" y="670" width="1400" height="400" fill={lake} />
        <AnimatedWaves strokeColor={isDark ? "#35241f" : "#ebd7c9"} opacity="0.7" />
        
        <g transform="translate(0, -130)">
        {/* Sloping Coastal Bank */}
        <path d="M -200 1000 L -200 870 Q 100 840 400 880 T 1200 860 L 1200 1000 Z" fill={coast} />

        {/* Left earthen bank & autumn bush */}
        <path d="M -100 830 Q 100 820 220 950 T 300 1050 L -100 1050 Z" fill={coast} />
        <path d="M 20 860 Q 120 880 160 960" stroke={hillBg} strokeWidth="3" fill="none" strokeLinecap="round" />
        {/* Autumn bush left */}
        <circle cx="80" cy="900" r="35" fill={hillFg} />
        <circle cx="30" cy="930" r="45" fill={isDark ? "#5c3320" : "#a86448"} />
        <circle cx="130" cy="950" r="30" fill={hillBg} />

        {/* Right earthen bank & fallen logs */}
        <path d="M 1150 780 Q 950 790 850 950 T 750 1050 L 1150 1050 Z" fill={coast} />
        <path d="M 1000 820 Q 900 850 880 930" stroke={hillBg} strokeWidth="3" fill="none" strokeLinecap="round" />
        {/* Fallen log right */}
        <path d="M 920 880 L 1050 980" stroke={hillFg} strokeWidth="15" strokeLinecap="round" />
        <path d="M 940 895 L 1050 980" stroke={isDark ? "#2c1810" : "#8c533c"} strokeWidth="5" strokeLinecap="round" />
      </g>
      </motion.g>
    </motion.g>
  );

  const renderWeather = () => {
    if (timePhase === 'dawn') return <motion.g style={{ y: bgScrollY }} opacity="0.8">{morningFog}{leaves}</motion.g>;
    if (timePhase === 'dusk') return <motion.g style={{ y: bgScrollY }} opacity="0.8">{swirlingLeaves}</motion.g>;
    if (timePhase === 'night') return <motion.g style={{ y: bgScrollY }} opacity="0.8">{autumnFog}</motion.g>;
    return <motion.g style={{ y: bgScrollY }} opacity="0.8">{leaves}</motion.g>;
  };

  return <WindowFrame timePhase={timePhase} skyColor={sky} bgLayer={bgLayer} midLayer={midLayer} fgLayer={fgLayer} weatherLayer={renderWeather()} frameY={frameScrollY} mouseFrameX={mouseFrameX} mouseFrameY={mouseFrameY} />;
});

// --- NEW POEM ABSTRACT BACKGROUNDS --- //

export const AmbientDust = React.memo(() => {
  const dust = useMemo(() => {
    return [...Array(60)].map((_, i) => (
      <circle key={i} cx={Math.random() * 100} cy={Math.random() * 100} r={Math.random() * 0.3 + 0.1} fill="#ffffff">
        <animate attributeName="opacity" values="0; 0.6; 0" dur={`${Math.random() * 5 + 4}s`} repeatCount="indefinite" begin={`-${Math.random() * 5}s`} />
        <animateTransform attributeName="transform" type="translate" from="0 0" to={`${Math.random() * 10 - 5} ${Math.random() * 10 - 5}`} dur={`${Math.random() * 10 + 10}s`} repeatCount="indefinite" />
      </circle>
    ));
  }, []);

  return (
    <svg style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh', zIndex: -1, pointerEvents: 'none', background: 'radial-gradient(circle at center, #1a1a24 0%, #0d0d12 100%)' }} viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
      <g opacity="0.3"><polygon points="0,0 100,0 50,100" fill="url(#lightRay)" /></g>
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
      <circle key={i} cx={Math.random() * 100} cy={Math.random() * 100} r={Math.random() * 0.4 + 0.1} fill="#ffebd6">
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
      <line key={i} x1={Math.random() * 100} y1="-10" x2={Math.random() * 100} y2="110" stroke="#44aa66" strokeWidth={Math.random() * 0.2 + 0.05} strokeDasharray={`${Math.random() * 10 + 5} ${Math.random() * 20 + 10}`}>
        <animate attributeName="stroke-dashoffset" from="100" to="0" dur={`${Math.random() * 10 + 5}s`} repeatCount="indefinite" />
      </line>
    ));
  }, []);

  return (
    <svg style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh', zIndex: -1, pointerEvents: 'none', background: '#050a05' }} viewBox="0 0 100 100" preserveAspectRatio="none">
      <g opacity="0.4">{lines}</g>
    </svg>
  );
});

export const Embers = React.memo(() => {
  const embers = useMemo(() => {
    return [...Array(50)].map((_, i) => (
      <circle key={i} cx={Math.random() * 100} cy="110" r={Math.random() * 0.4 + 0.1} fill="#ff6622">
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

export const LgbtPride = React.memo(() => {
  const { scrollY } = useScroll();
  const bgScrollY = useTransform(scrollY, [0, 3000], [0, 80]);
  const midScrollY = useTransform(scrollY, [0, 3000], [0, 200]);
  const fgScrollY = useTransform(scrollY, [0, 3000], [0, 350]);
  const frameScrollY = useTransform(scrollY, [0, 3000], [0, -100]);

  const { smoothX, smoothY } = useMouseParallax();
  const mouseBgX = useTransform(smoothX, [-1, 1], [-2, 2]);
  const mouseBgY = useTransform(smoothY, [-1, 1], [-2, 2]);
  const mouseMidX = useTransform(smoothX, [-1, 1], [-5, 5]);
  const mouseMidY = useTransform(smoothY, [-1, 1], [-5, 5]);
  const mouseFgX = useTransform(smoothX, [-1, 1], [-10, 10]);
  const mouseFgY = useTransform(smoothY, [-1, 1], [-10, 10]);
  const mouseFrameX = useTransform(smoothX, [-1, 1], [12, -12]);
  const mouseFrameY = useTransform(smoothY, [-1, 1], [12, -12]);

  const timePhase = useTimePhase();
  const isDark = timePhase === 'night' || timePhase === 'dusk';

  const skyColor = isDark ? "#2a1b3d" : "#ffe6e6";

  const rainbowGradient = (
    <linearGradient id="rainbow" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#ff4d4d" />
      <stop offset="20%" stopColor="#ff9e4d" />
      <stop offset="40%" stopColor="#ffe74d" />
      <stop offset="60%" stopColor="#4dff5b" />
      <stop offset="80%" stopColor="#4d8cff" />
      <stop offset="100%" stopColor="#b64dff" />
    </linearGradient>
  );

  const bgLayer = (
    <motion.g style={{ y: bgScrollY, x: mouseBgX }}>
      <defs>{rainbowGradient}</defs>
      <circle cx="500" cy="500" r="400" fill="url(#rainbow)" opacity={isDark ? 0.3 : 0.6} filter="blur(60px)" />
      <circle cx="200" cy="800" r="300" fill="#ff4d4d" opacity={0.2} filter="blur(80px)" />
      <circle cx="800" cy="200" r="300" fill="#b64dff" opacity={0.2} filter="blur(80px)" />
    </motion.g>
  );

  const floatingHearts = useMemo(() => {
    const colors = ["#ff4d4d", "#ff9e4d", "#ffe74d", "#4dff5b", "#4d8cff", "#b64dff"];
    return [...Array(40)].map((_, i) => {
      const x = Math.random() * 1200 - 100;
      const y = Math.random() * 1200 - 100;
      const dur = Math.random() * 15 + 10;
      const col = colors[Math.floor(Math.random() * colors.length)];
      return (
        <circle key={i} cx={x} cy={y} r={Math.random() * 6 + 2} fill={col} opacity="0.6">
          <animate attributeName="cy" values={`${y}; ${y - 400}; ${y}`} dur={`${dur}s`} repeatCount="indefinite" />
          <animate attributeName="cx" values={`${x}; ${x + 50}; ${x}`} dur={`${dur * 1.2}s`} repeatCount="indefinite" />
        </circle>
      );
    });
  }, []);

  const midLayer = (
    <motion.g style={{ y: midScrollY, x: mouseMidX }}>
      {floatingHearts}
    </motion.g>
  );

  const floatingLaces = useMemo(() => {
    return [...Array(6)].map((_, i) => {
      const yStart = Math.random() * 1500 - 250;
      const angle = Math.random() * 40 - 20; 
      const dur = Math.random() * 30 + 30; 
      const dir = Math.random() > 0.5 ? 1 : -1;
      
      return (
        <g key={`lace-${i}`} opacity="0.4">
          <animateTransform 
            attributeName="transform" 
            type="translate" 
            values={`${-1000 * dir},${yStart}; ${1500 * dir},${yStart - 300}`} 
            dur={`${dur}s`} 
            repeatCount="indefinite" 
          />
          <g transform={`rotate(${angle})`}>
            <rect x="-2000" y="0" width="5000" height="2" fill="#ff4d4d" />
            <rect x="-2000" y="2" width="5000" height="2" fill="#ff9e4d" />
            <rect x="-2000" y="4" width="5000" height="2" fill="#ffe74d" />
            <rect x="-2000" y="6" width="5000" height="2" fill="#4dff5b" />
            <rect x="-2000" y="8" width="5000" height="2" fill="#4d8cff" />
            <rect x="-2000" y="10" width="5000" height="2" fill="#b64dff" />
          </g>
        </g>
      );
    });
  }, []);

  const fgLayer = (
    <motion.g style={{ y: fgScrollY, x: mouseFgX }}>
      {floatingLaces}
    </motion.g>
  );

  return <WindowFrame timePhase={timePhase} skyColor={skyColor} bgLayer={bgLayer} midLayer={midLayer} fgLayer={fgLayer} weatherLayer={null} frameY={frameScrollY} mouseFrameX={mouseFrameX} mouseFrameY={mouseFrameY} />;
});

export const ClassActress = React.memo(() => {
  const { scrollY } = useScroll();
  const bgScrollY = useTransform(scrollY, [0, 3000], [0, 80]);
  const midScrollY = useTransform(scrollY, [0, 3000], [0, 200]);
  const fgScrollY = useTransform(scrollY, [0, 3000], [0, 350]);
  const frameScrollY = useTransform(scrollY, [0, 3000], [0, -100]);

  const { smoothX, smoothY } = useMouseParallax();
  const mouseBgX = useTransform(smoothX, [-1, 1], [-2, 2]);
  const mouseBgY = useTransform(smoothY, [-1, 1], [-2, 2]);
  const mouseMidX = useTransform(smoothX, [-1, 1], [-5, 5]);
  const mouseMidY = useTransform(smoothY, [-1, 1], [-5, 5]);
  const mouseFgX = useTransform(smoothX, [-1, 1], [-10, 10]);
  const mouseFgY = useTransform(smoothY, [-1, 1], [-10, 10]);
  const mouseFrameX = useTransform(smoothX, [-1, 1], [12, -12]);
  const mouseFrameY = useTransform(smoothY, [-1, 1], [12, -12]);

  const timePhase = 'night';
  const skyColor = "#050510";

  const stars = useMemo(() => {
    return [...Array(150)].map((_, i) => (
      <circle key={i} cx={Math.random() * 1200 - 100} cy={Math.random() * 1200 - 100} r={Math.random() * 1.5 + 0.5} fill="#ffffff" opacity={Math.random() * 0.5 + 0.3}>
        <animate attributeName="opacity" values={`${Math.random() * 0.3 + 0.1}; ${Math.random() * 0.5 + 0.5}; ${Math.random() * 0.3 + 0.1}`} dur={`${Math.random() * 4 + 2}s`} repeatCount="indefinite" />
      </circle>
    ));
  }, []);

  const eyes = useMemo(() => {
    return [...Array(10)].map((_, i) => {
      const x = Math.random() * 1000;
      const y = Math.random() * 800;
      return (
        <g key={`eye-${i}`} transform={`translate(${x}, ${y}) scale(${Math.random() * 0.5 + 0.5})`} opacity="0.6">
          <path d="M0,0 Q25,-20 50,0 Q25,20 0,0" fill="none" stroke="#ffffff" strokeWidth="2" />
          <circle cx="25" cy="0" r="8" fill="#ffffff" />
          <circle cx="25" cy="0" r="4" fill="#050510" />
        </g>
      );
    });
  }, []);

  const hearts = useMemo(() => {
    return [...Array(15)].map((_, i) => {
      const x = Math.random() * 1200 - 100;
      const y = Math.random() * 1200 - 100;
      return (
        <path key={`heart-${i}`} d="M0,5 C0,5 0,0 5,0 C10,0 10,5 10,5 C10,5 10,0 15,0 C20,0 20,5 20,5 C20,15 10,25 10,25 C10,25 0,15 0,5 Z" fill="#ff4d4d" opacity="0.5" transform={`translate(${x}, ${y}) scale(${Math.random() * 1 + 0.5}) rotate(${Math.random() * 40 - 20})`}>
           <animateTransform attributeName="transform" type="translate" from={`${x} ${y}`} to={`${x} ${y - 200}`} dur={`${Math.random() * 15 + 10}s`} repeatCount="indefinite" />
        </path>
      );
    });
  }, []);

  const albumCovers = useMemo(() => {
    return [...Array(8)].map((_, i) => {
      const x = Math.random() * 1000 - 100;
      const y = Math.random() * 1000 - 100;
      const rotation = Math.random() * 360;
      const scale = Math.random() * 0.5 + 0.5;
      return (
        <g key={`album-${i}`} transform={`translate(${x}, ${y}) rotate(${rotation}) scale(${scale})`} opacity="0.4">
          <image href="/class-actress.jpg" x="-100" y="-100" width="200" height="200" preserveAspectRatio="xMidYMid slice" />
        </g>
      );
    });
  }, []);

  const bgLayer = (
    <motion.g style={{ y: bgScrollY, x: mouseBgX }}>
      {stars}
      {albumCovers.slice(0, 4)}
    </motion.g>
  );

  const midLayer = (
    <motion.g style={{ y: midScrollY, x: mouseMidX }}>
      {eyes}
      {hearts.slice(0, 7)}
      {albumCovers.slice(4, 6)}
    </motion.g>
  );

  const fgLayer = (
    <motion.g style={{ y: fgScrollY, x: mouseFgX }}>
      {hearts.slice(7)}
      {albumCovers.slice(6)}
    </motion.g>
  );

  return <WindowFrame timePhase={timePhase} skyColor={skyColor} bgLayer={bgLayer} midLayer={midLayer} fgLayer={fgLayer} weatherLayer={null} frameY={frameScrollY} mouseFrameX={mouseFrameX} mouseFrameY={mouseFrameY} />;
});
