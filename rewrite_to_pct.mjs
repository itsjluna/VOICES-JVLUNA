import fs from 'fs';
let content = fs.readFileSync('src/components/games/GamesView.jsx', 'utf8');

// 1. Update initial state for %
content = content.replace(
  /const \[t, setT\] = useState\(\{[\s\S]*?\}\);/,
  \const [t, setT] = useState({
    x: -32,
    y: -26,
    z: 0,
    rx: 5.9,
    ry: -16.4,
    rz: 14.5,
    sx: 1,
    sy: 1,
    w: 39.6,
    h: 39.2,
    skx: 6.6,
    sky: 2,
    brX: 13,
    brY: 11,
    p: 155
  });\
);

// 2. Remove ResizeObserver
content = content.replace(/const wrapperRef = useRef\(null\);[\s\S]*?\}, \[\]\);/, '');

// 3. Update crtStyle to use %
content = content.replace(
  /const crtStyle = \{[\s\S]*?\};/,
  \const crtStyle = {
    width: \\\\\\%\\\,
    height: \\\\\\%\\\,
    borderRadius: \\\\\\% / \\\%\\\,
    transform: \\\perspective(\\\vw) translate3d(\\\%, \\\%, \\\px) rotateX(\\\deg) rotateY(\\\deg) rotateZ(\\\deg) scale(\\\, \\\) skew(\\\deg, \\\deg)\\\
  };\
);

// 4. Update the JSX to remove scaler
content = content.replace(
  /<div className="imac-scaler"[\s\S]*?>\s*<div className="imac-screen" style=\{crtStyle\}>/,
  \<div className="imac-screen" style={crtStyle}>\
);
content = content.replace(
  /<\/div>\s*<\/div>\s*<\/motion\.div>/,
  \</div>
            </motion.div>\
);

// 5. Update sliders to be % based
content = content.replace(
  /min="100" max="800" value=\{t\.w\}/,
  'min="10" max="100" step="0.1" value={t.w}'
);
content = content.replace(
  /min="100" max="800" value=\{t\.h\}/,
  'min="10" max="100" step="0.1" value={t.h}'
);
content = content.replace(
  /min="-500" max="500" value=\{t\.x\}/,
  'min="-100" max="100" step="0.1" value={t.x}'
);
content = content.replace(
  /min="-500" max="500" value=\{t\.y\}/,
  'min="-100" max="100" step="0.1" value={t.y}'
);

fs.writeFileSync('src/components/games/GamesView.jsx', content, 'utf8');
