const fs = require('fs');
let jsx = fs.readFileSync('src/components/games/GamesView.jsx', 'utf8');

// 1. Clean imports
jsx = jsx.replace('FaTimes, FaPlay, FaSlidersH, FaCopy, FaTint', 'FaTimes, FaPlay, FaTint');

// 2. Add GRAPHICS array
const graphicsArr = \
const GRAPHICS = [
  { src: 'y2kstar.png', style: { top: '20%', left: '30%', width: '80px', animationDelay: '0s' } },
  { src: 'y2kheart.png', style: { top: '10%', right: '35%', width: '90px', animationDelay: '1s' } },
  { src: 'y2ksphere.png', style: { bottom: '20%', left: '25%', width: '120px', animationDelay: '2s' } },
  { src: 'y2kflower.png', style: { bottom: '30%', right: '20%', width: '100px', animationDelay: '0.5s' } },
  { src: 'y2kstar2.png', style: { top: '40%', right: '5%', width: '70px', animationDelay: '1.5s' } },
  { src: 'y2keart.png', style: { bottom: '15%', right: '40%', width: '85px', animationDelay: '2.5s' } },
  { src: 'y2kclover.png', style: { top: '60%', left: '15%', width: '95px', animationDelay: '0.2s' } },
  { src: 'y2kflag.png', style: { top: '5%', left: '50%', width: '110px', animationDelay: '1.2s' } },
  { src: 'y2kshine.png', style: { bottom: '5%', left: '45%', width: '60px', animationDelay: '0.8s' } }
];
\;
jsx = jsx.replace('const THEMES = [', graphicsArr + '\nconst THEMES = [');

// 3. Add state
jsx = jsx.replace('const [themeIdx, setThemeIdx] = useState(0);', 'const [themeIdx, setThemeIdx] = useState(0);\n  const [imacImageFailed, setImacImageFailed] = useState(false);');

// 4. Replace graphics div
const oldGraphics = \<div className="games-graphics">
          <img src="/games/graphics/y2kstar.png" className="graphic-img" style={{ top: '20%', left: '30%', width: '80px', animationDelay: '0s' }} />
          <img src="/games/graphics/y2kheart.png" className="graphic-img" style={{ top: '10%', right: '35%', width: '90px', animationDelay: '1s' }} />
          <img src="/games/graphics/y2ksphere.png" className="graphic-img" style={{ bottom: '20%', left: '25%', width: '120px', animationDelay: '2s' }} />
          <img src="/games/graphics/y2kflower.png" className="graphic-img" style={{ bottom: '30%', right: '20%', width: '100px', animationDelay: '0.5s' }} />
          <img src="/games/graphics/y2kstar2.png" className="graphic-img" style={{ top: '40%', right: '5%', width: '70px', animationDelay: '1.5s' }} />
          <img src="/games/graphics/y2keart.png" className="graphic-img" style={{ bottom: '15%', right: '40%', width: '85px', animationDelay: '2.5s' }} />
          <img src="/games/graphics/y2kclover.png" className="graphic-img" style={{ top: '60%', left: '15%', width: '95px', animationDelay: '0.2s' }} />
          <img src="/games/graphics/y2kflag.png" className="graphic-img" style={{ top: '5%', left: '50%', width: '110px', animationDelay: '1.2s' }} />
          <img src="/games/graphics/y2kshine.png" className="graphic-img" style={{ bottom: '5%', left: '45%', width: '60px', animationDelay: '0.8s' }} />
        </div>\;
const newGraphics = \<div className="games-graphics">
          {GRAPHICS.map((g, i) => (
            <img key={i} src={\/games/graphics/\\} className="graphic-img" style={g.style} />
          ))}
        </div>\;
jsx = jsx.replace(oldGraphics, newGraphics);

// 5. Replace text encoding
jsx = jsx.replace(/pequeA.a/g, 'pequeña');
jsx = jsx.replace(/dueA.o/g, 'dueño');

// 6. Replace image state
const oldImg = \<div className="imac-image-placeholder">
                <img 
                  src="/games/imacg3.png" 
                  alt="iMac G3" 
                  className="imac-image"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.classList.add('missing-img');
                  }}
                />
              </div>\;
const newImg = \<div className={\imac-image-placeholder \\}>
                <img 
                  src="/games/imacg3.png" 
                  alt="iMac G3" 
                  className="imac-image"
                  style={{ display: imacImageFailed ? 'none' : 'block' }}
                  onError={() => setImacImageFailed(true)}
                />
              </div>\;
jsx = jsx.replace(oldImg, newImg);

// 7. Remove virtual controllers
const vStart = '{/* Virtual Controllers for Mobile */}';
const vEnd = '              </div>';
// Actually, it's easier to use a regex to strip from {/* Virtual to the last </div> before </motion.div>
const vRegex = /\{\/\* Virtual Controllers for Mobile \*\/\}[\s\S]*?<\/div>\s*<\/div>/;
jsx = jsx.replace(vRegex, '');

fs.writeFileSync('src/components/games/GamesView.jsx', jsx);
