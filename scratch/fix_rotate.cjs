const fs = require('fs');
let code = fs.readFileSync('src/components/IndexScatter.jsx', 'utf8');

// Move rotate from initial/animate to style
code = code.replace(/initial=\{\{(.*?), rotate \}\} animate=\{\{(.*?), rotate \}\}/g, 'initial={{$1}} animate={{$2}}');
code = code.replace(/initial=\{\{(.*?), rotate: pos\.rotate \}\} animate=\{\{(.*?), rotate: pos\.rotate \}\}/g, 'initial={{$1}} animate={{$2}}');

// For scribbles
code = code.replace(/style=\{\{ position: 'absolute', top: `\$\{top\}%`, left: `\$\{left\}%`, cursor: 'grab', zIndex: 1, opacity: 0\.3, pointerEvents: 'auto', touchAction: 'none' \}\}/g,
  "style={{ position: 'absolute', top: `${top}%`, left: `${left}%`, rotate, cursor: 'grab', zIndex: 1, opacity: 0.3, pointerEvents: 'auto', touchAction: 'none' }}");

// For paperClips
code = code.replace(/style=\{\{ position: 'absolute', top: `\$\{top\}%`, left: `\$\{left\}%`, cursor: 'grab', zIndex: 3, opacity: 0\.8, filter: 'drop-shadow\\(2px 4px 3px rgba\\(0,0,0,0\.3\\)\\)', pointerEvents: 'auto', touchAction: 'none' \}\}/g,
  "style={{ position: 'absolute', top: `${top}%`, left: `${left}%`, rotate, cursor: 'grab', zIndex: 3, opacity: 0.8, filter: 'drop-shadow(2px 4px 3px rgba(0,0,0,0.3))', pointerEvents: 'auto', touchAction: 'none' }}");

// For washitapes
code = code.replace(/style=\{\{ position: 'absolute', top: `\$\{top\}%`, left: `\$\{left\}%`, width: '120px', height: '25px', backgroundColor: bg, zIndex: 5, cursor: 'grab', backdropFilter: 'blur\\(2px\\)', boxShadow: '0 1px 3px rgba\\(0,0,0,0\.05\\)', pointerEvents: 'auto', touchAction: 'none' \}\}/g,
  "style={{ position: 'absolute', top: `${top}%`, left: `${left}%`, width: '120px', height: '25px', backgroundColor: bg, rotate, zIndex: 5, cursor: 'grab', backdropFilter: 'blur(2px)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', pointerEvents: 'auto', touchAction: 'none' }}");

// For indexCards
code = code.replace(/style=\{\{ position: 'absolute', top: `\$\{top\}%`, left: `\$\{left\}%`, width: '200px', height: '140px', backgroundColor: '#fcfcfc', borderTop: '30px solid #e08b8b', boxShadow: '0 4px 15px rgba\\(0,0,0,0\.08\\)', cursor: 'grab', zIndex: 1, backgroundImage: 'repeating-linear-gradient\\(transparent, transparent 19px, #e0e0e0 20px\\)', pointerEvents: 'auto', touchAction: 'none' \}\}/g,
  "style={{ position: 'absolute', top: `${top}%`, left: `${left}%`, width: '200px', height: '140px', backgroundColor: '#fcfcfc', borderTop: '30px solid #e08b8b', boxShadow: '0 4px 15px rgba(0,0,0,0.08)', rotate, cursor: 'grab', zIndex: 1, backgroundImage: 'repeating-linear-gradient(transparent, transparent 19px, #e0e0e0 20px)', pointerEvents: 'auto', touchAction: 'none' }}");

// For postIts
code = code.replace(/style=\{\{ position: 'absolute', top: `\$\{top\}%`, left: `\$\{left\}%`, width: '100px', height: '100px', backgroundColor: bg, boxShadow: '2px 5px 10px rgba\\(0,0,0,0\.15\\)', cursor: 'grab', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '"Reenie Beanie", cursive', fontSize: '1\.2rem', color: 'rgba\\(0,0,0,0\.6\\)', padding: '10px', textAlign: 'center', pointerEvents: 'auto', touchAction: 'none' \}\}/g,
  "style={{ position: 'absolute', top: `${top}%`, left: `${left}%`, width: '100px', height: '100px', backgroundColor: bg, boxShadow: '2px 5px 10px rgba(0,0,0,0.15)', rotate, cursor: 'grab', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '\"Reenie Beanie\", cursive', fontSize: '1.2rem', color: 'rgba(0,0,0,0.6)', padding: '10px', textAlign: 'center', pointerEvents: 'auto', touchAction: 'none' }}");

// For tickets
code = code.replace(/style=\{\{ position: 'absolute', top: `\$\{top\}%`, left: `\$\{left\}%`, width: '160px', height: '60px', backgroundColor: '#fafafa', borderLeft: `8px solid \$\{bg\}`, boxShadow: '0 4px 12px rgba\\(0,0,0,0\.1\\)', cursor: 'grab', zIndex: 2, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 15px', fontFamily: 'monospace', fontSize: '0\.65rem', color: '#555', pointerEvents: 'auto', touchAction: 'none' \}\}/g,
  "style={{ position: 'absolute', top: `${top}%`, left: `${left}%`, width: '160px', height: '60px', backgroundColor: '#fafafa', borderLeft: `8px solid ${bg}`, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', rotate, cursor: 'grab', zIndex: 2, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 15px', fontFamily: 'monospace', fontSize: '0.65rem', color: '#555', pointerEvents: 'auto', touchAction: 'none' }}");

// For PolaroidScatter
code = code.replace(/style=\{\{ \n        position: 'absolute', top: `\$\{top\}%`, left: `\$\{left\}%`, width: '140px', height: '170px', \n        pointerEvents: 'auto', cursor: 'grab', touchAction: 'none',\n        zIndex: 4, perspective: 1000\n      \}\}/g,
  "style={{ position: 'absolute', top: `${top}%`, left: `${left}%`, width: '140px', height: '170px', pointerEvents: 'auto', cursor: 'grab', touchAction: 'none', zIndex: 4, perspective: 1000, rotate }}");

fs.writeFileSync('src/components/IndexScatter.jsx', code);
console.log('Fixed rotate property in style!');
