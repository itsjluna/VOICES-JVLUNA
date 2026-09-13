const fs = require('fs');
let css = fs.readFileSync('src/components/games/GamesView.css', 'utf8');

const newCSS = \
/* CLUTTER AND GRAPHICS */
.games-clutter, .games-graphics {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}
.clutter-img {
  position: absolute;
  opacity: 0.8;
  transition: transform 0.3s ease;
}
.graphic-img {
  position: absolute;
  opacity: 0.6;
  animation: floatGraphic 6s infinite ease-in-out;
}
@keyframes floatGraphic {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(5deg); }
}

/* Adjust z-indexes so things layer properly behind the main iMac */
.aero-bubbles { z-index: 0; }
.aero-light { z-index: 0; }
.games-container { z-index: 10; }
\;

// Insert it before the mobile block
const mobileIndex = css.indexOf('/* MOBILE CRT OVERRIDES */');
if (mobileIndex !== -1) {
  css = css.substring(0, mobileIndex) + newCSS + '\n' + css.substring(mobileIndex);
} else {
  css += newCSS;
}

fs.writeFileSync('src/components/games/GamesView.css', css, 'utf8');
