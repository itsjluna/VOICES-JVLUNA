import fs from 'fs';
let content = fs.readFileSync('src/components/games/GamesView.jsx', 'utf8');

// 1. Update ResizeObserver to use style.setProperty('--s')
content = content.replace(
  /const \[scaleFactor, setScaleFactor\] = useState\(1\);[\s\S]*?observer\.observe\(wrapperRef\.current\);/,
  \useEffect(() => {
    if (!wrapperRef.current) return;
    const observer = new ResizeObserver(entries => {
      for (let entry of entries) {
        wrapperRef.current.style.setProperty('--s', entry.contentRect.width / 568);
      }
    });
    observer.observe(wrapperRef.current);\
);

// 2. Remove imac-scaler wrapper
content = content.replace(
  /<div className="imac-scaler" style=\{\{ position: 'absolute', top: '50%', left: '50%', width: 0, height: 0, transform: \scale\(\\\\)\ \}\}>\s*<div className="imac-screen" style=\{crtStyle\}>/,
  \<div className="imac-screen" style={crtStyle}>\
);

content = content.replace(
  /<\/div>\s*<\/div>\s*<\/motion\.div>/,
  \</div>
            </motion.div>\
);

// 3. Update crtStyle to use CSS variable calc
content = content.replace(
  /const crtStyle = \{[\s\S]*?\};/,
  \const crtStyle = {
    width: \\\calc(\\\px * var(--s, 1))\\\,
    height: \\\calc(\\\px * var(--s, 1))\\\,
    borderRadius: \\\\\\% / \\\%\\\,
    transform: \\\perspective(calc(\\\px * var(--s, 1))) translate3d(calc(\\\px * var(--s, 1)), calc(\\\px * var(--s, 1)), calc(\\\px * var(--s, 1))) rotateX(\\\deg) rotateY(\\\deg) rotateZ(\\\deg) scale(\\\, \\\) skew(\\\deg, \\\deg)\\\
  };\
);

fs.writeFileSync('src/components/games/GamesView.jsx', content, 'utf8');
