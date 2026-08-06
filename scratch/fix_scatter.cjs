const fs = require('fs');

const path = 'c:/Users/sarah/Downloads/poem-page/src/components/IndexScatter.jsx';
let code = fs.readFileSync(path, 'utf8');

// Replace drag physics on all elements
code = code.replace(/drag whileDrag=\{\{ scale: 1\.05, cursor: 'grabbing' \}\}/g, 
  "drag dragConstraints={{ left: -30, right: 30, top: -30, bottom: 30 }} dragElastic={0.4} whileDrag={{ scale: 1.05, cursor: 'grabbing', filter: 'drop-shadow(0 15px 25px rgba(0,0,0,0.4))' }}");

// Specifically for PolaroidScatter which uses scale: 1.1 and zIndex: 100
code = code.replace(/drag whileDrag=\{\{ scale: 1\.1, zIndex: 100, cursor: 'grabbing' \}\}/g, 
  "drag dragConstraints={{ left: -30, right: 30, top: -30, bottom: 30 }} dragElastic={0.4} whileDrag={{ scale: 1.1, zIndex: 100, cursor: 'grabbing', filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.5))' }}");

// Replace transform: rotate with initial={{ rotate }} to prevent reset
// For scribbles
code = code.replace(/initial=\{\{ opacity: 0 \}\} animate=\{\{ opacity: 1 \}\} transition=\{\{ duration: 1\.5, delay: 0\.5 \+ Math\.random\(\) \}\}\n\s+drag/g,
  "initial={{ opacity: 0, rotate }} animate={{ opacity: 1, rotate }} transition={{ duration: 1.5, delay: 0.5 + Math.random() }}\n          drag");
code = code.replace(/transform: `rotate\(\$\{rotate\}deg\)`,\s*/g, ""); // removes it from scribbles, paperClips, washitapes, indexCards, postIts, tickets, PolaroidScatter

// For paperClips
code = code.replace(/initial=\{\{ opacity: 0 \}\} animate=\{\{ opacity: 1 \}\} transition=\{\{ duration: 1\.5, delay: 0\.8 \}\}\n\s+drag/g,
  "initial={{ opacity: 0, rotate }} animate={{ opacity: 1, rotate }} transition={{ duration: 1.5, delay: 0.8 }}\n          drag");

// For washitapes
code = code.replace(/initial=\{\{ opacity: 0 \}\} animate=\{\{ opacity: 1 \}\} transition=\{\{ duration: 1, delay: 0\.2 \}\}\n\s+drag/g,
  "initial={{ opacity: 0, rotate }} animate={{ opacity: 1, rotate }} transition={{ duration: 1, delay: 0.2 }}\n          drag");

// For indexCards
code = code.replace(/initial=\{\{ opacity: 0, scale: 0\.9 \}\} animate=\{\{ opacity: 1, scale: 1 \}\} transition=\{\{ duration: 1\.5, delay: 0\.3 \}\}\n\s+drag/g,
  "initial={{ opacity: 0, scale: 0.9, rotate }} animate={{ opacity: 1, scale: 1, rotate }} transition={{ duration: 1.5, delay: 0.3 }}\n          drag");

// For postIts
code = code.replace(/initial=\{\{ opacity: 0, scale: 0\.9 \}\} animate=\{\{ opacity: 1, scale: 1 \}\} transition=\{\{ duration: 1\.5, delay: 0\.4 \}\}\n\s+drag/g,
  "initial={{ opacity: 0, scale: 0.9, rotate }} animate={{ opacity: 1, scale: 1, rotate }} transition={{ duration: 1.5, delay: 0.4 }}\n          drag");

// For tickets
code = code.replace(/initial=\{\{ opacity: 0, scale: 0\.9 \}\} animate=\{\{ opacity: 1, scale: 1 \}\} transition=\{\{ duration: 1\.5, delay: 0\.6 \}\}\n\s+drag/g,
  "initial={{ opacity: 0, scale: 0.9, rotate }} animate={{ opacity: 1, scale: 1, rotate }} transition={{ duration: 1.5, delay: 0.6 }}\n          drag");

// For PolaroidScatter
code = code.replace(/initial=\{\{ opacity: 0, y: 50 \}\} animate=\{\{ opacity: 1, y: 0 \}\} transition=\{\{ duration: 1\.2, delay: 0\.2 \+ Math\.random\(\) \* 0\.5 \}\}\n\s+drag/g,
  "initial={{ opacity: 0, y: 50, rotate }} animate={{ opacity: 1, y: 0, rotate }} transition={{ duration: 1.2, delay: 0.2 + Math.random() * 0.5 }}\n      drag");


fs.writeFileSync(path, code);
console.log('Done modifying IndexScatter.jsx');
