import fs from 'fs';
let content = fs.readFileSync('src/components/games/GamesView.jsx', 'utf8');

// Remove showControls state
content = content.replace(/const \[showControls, setShowControls\] = useState\(false\);\s*/, '');
content = content.replace(/import \{ FaTimes, FaPlay, FaSlidersH, FaCopy \} from 'react-icons\/fa';/, "import { FaTimes, FaPlay } from 'react-icons/fa';");

// Remove handleT and copyConfig
content = content.replace(/const handleT =[\s\S]*?alert\('Transform config copied! Send it over when you nail it.'\);\s*\};\s*/, '');

// Remove the <AnimatePresence> block that contains showControls
const jsxToRemoveStart = content.indexOf('<AnimatePresence>\n        {showControls && (');
if (jsxToRemoveStart !== -1) {
  const nextAnimatePresence = content.indexOf('<AnimatePresence>\n        {isModalOpen && (', jsxToRemoveStart + 1);
  if (nextAnimatePresence !== -1) {
    content = content.substring(0, jsxToRemoveStart) + content.substring(nextAnimatePresence);
  }
}

fs.writeFileSync('src/components/games/GamesView.jsx', content, 'utf8');
