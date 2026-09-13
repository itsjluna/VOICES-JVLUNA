import fs from 'fs';
let content = fs.readFileSync('src/components/games/GamesView.jsx', 'utf8');

// 1. Replace the state
content = content.replace(
  /const \[t, setT\] = useState\(\{[\s\S]*?\}\);/,
  \const [t, setT] = useState({
    x: -84.8,
    y: -68.7,
    z: 0,
    rx: 2.5,
    ry: -15.2,
    rz: 14.3,
    sx: 1,
    sy: 1,
    w: 45.4,
    h: 47.7,
    skx: 7.1,
    sky: 2,
    brX: 0,
    brY: 0,
    p: 39
  });\
);

// 2. Remove showControls, handleT, and copyConfig
content = content.replace(/const \[showControls, setShowControls\] = useState\(false\);\s*/, '');
content = content.replace(/import \{ FaTimes, FaPlay, FaSlidersH, FaCopy \} from 'react-icons\/fa';/, "import { FaTimes, FaPlay } from 'react-icons/fa';");
content = content.replace(/const handleT =[\s\S]*?alert\('Transform config copied! Send it over when you nail it.'\);\s*\};\s*/, '');

// 3. Remove the Dev Controls JSX block
const jsxToRemoveStart = content.indexOf('<AnimatePresence>\\n        {showControls && (');
if (jsxToRemoveStart !== -1) {
  const nextAnimatePresence = content.indexOf('<AnimatePresence>\\n        {isModalOpen && (', jsxToRemoveStart + 1);
  if (nextAnimatePresence !== -1) {
    content = content.substring(0, jsxToRemoveStart) + content.substring(nextAnimatePresence);
  }
}

fs.writeFileSync('src/components/games/GamesView.jsx', content, 'utf8');

let cssContent = fs.readFileSync('src/components/games/GamesView.css', 'utf8');

// 4. Update the CSS fallback
cssContent = cssContent.replace(
  /width: 39\.6%;\s*height: 39\.2%;\s*transform: perspective\(155vw\)[\s\S]*?;/,
  \width: 45.4%;
  height: 47.7%;
  transform: perspective(39vw) translate3d(-84.8%, -68.7%, 0px) rotateX(2.5deg) rotateY(-15.2deg) rotateZ(14.3deg) scale(1, 1) skew(7.1deg, 2deg);\
);

// 5. Remove Dev Controls CSS
const devIndex = cssContent.indexOf('/* DEV CONTROLS */');
if (devIndex !== -1) {
  cssContent = cssContent.substring(0, devIndex);
}

fs.writeFileSync('src/components/games/GamesView.css', cssContent, 'utf8');
