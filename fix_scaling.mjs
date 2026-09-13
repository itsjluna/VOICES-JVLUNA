import fs from 'fs';
let content = fs.readFileSync('src/components/games/GamesView.jsx', 'utf8');

// 1. Add useRef and useEffect imports if missing
if (!content.includes('useRef')) {
  content = content.replace('useState', 'useState, useRef, useEffect');
}

// 2. Revert crtStyle
content = content.replace(
  /const crtStyle = \{[\s\S]*?\};/,
  \const crtStyle = {
    width: \\\\\\px\\\,
    height: \\\\\\px\\\,
    borderRadius: \\\\\\% / \\\%\\\,
    transform: \\\perspective(\\\px) translate3d(\\\px, \\\px, \\\px) rotateX(\\\deg) rotateY(\\\deg) rotateZ(\\\deg) scale(\\\, \\\) skew(\\\deg, \\\deg)\\\
  };\
);

// 3. Add ResizeObserver logic inside component
const hookLogic = \
  const wrapperRef = useRef(null);
  const [scaleFactor, setScaleFactor] = useState(1);

  useEffect(() => {
    if (!wrapperRef.current) return;
    const observer = new ResizeObserver(entries => {
      for (let entry of entries) {
        setScaleFactor(entry.contentRect.width / 568);
      }
    });
    observer.observe(wrapperRef.current);
    return () => observer.disconnect();
  }, []);

  const crtStyle\;

content = content.replace('const crtStyle', hookLogic);

// 4. Update the wrapper and add scaler
content = content.replace(
  /<motion\.div \s*className="imac-wrapper"[\s\S]*?>/,
  \<motion.div 
              className="imac-wrapper"
              ref={wrapperRef}
              initial={{ opacity: 0, rotateY: 30, scale: 0.8 }}
              animate={{ opacity: 1, rotateY: 0, scale: 1 }}
              transition={{ duration: 1, type: "spring" }}
            >\
);

content = content.replace(
  /<div className="imac-screen" style=\{crtStyle\}>/,
  \<div className="imac-scaler" style={{ position: 'absolute', top: '50%', left: '50%', width: 0, height: 0, transform: \\\scale(\\\)\\\ }}>
                <div className="imac-screen" style={{ ...crtStyle, top: 0, left: 0 }}>\
);

// Add closing div for scaler
content = content.replace(
  /<\/div>\s*<\/motion\.div>/,
  \</div>
              </div>
            </motion.div>\
);

fs.writeFileSync('src/components/games/GamesView.jsx', content, 'utf8');
