const fs = require('fs');
let css = fs.readFileSync('src/components/games/GamesView.css', 'utf8');

const regex = /\.crt-glare \{\s*position: absolute;\s*top: -10%; left: -10%; right: -10%; bottom: -10%;\s*background: radial-gradient\(circle at 50% 30%, rgba\(255,255,255,0\.2\) 0%, rgba\(255,255,255,0\.05\) 40%, rgba\(0,0,0,0\) 65%\);\s*pointer-events: none;\s*z-index: 3;\s*border-radius: 50%; \/\* Gives a nice curved reflection \*\/\s*\}\s*top: 0; left: 0; right: 0; bottom: 0;\s*pointer-events: none;\s*z-index: 0;\s*overflow: hidden;\s*\}/;

const fix = \.crt-glare {
  position: absolute;
  top: -10%; left: -10%; right: -10%; bottom: -10%;
  background: radial-gradient(circle at 50% 30%, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.05) 40%, rgba(0,0,0,0) 65%);
  pointer-events: none;
  z-index: 3;
  border-radius: 50%;
}

.crt-static {
  position: absolute;
  top: -50%; left: -50%; right: -50%; bottom: -50%;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.15'/%3E%3C/svg%3E");
  animation: staticNoise 0.2s steps(2) infinite;
  z-index: 4;
  pointer-events: none;
  mix-blend-mode: overlay;
}

/* CLUTTER AND GRAPHICS */
.games-clutter, .games-graphics {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}\;

css = css.replace(regex, fix);
fs.writeFileSync('src/components/games/GamesView.css', css, 'utf8');
