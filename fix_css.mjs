import fs from 'fs';
let css = fs.readFileSync('src/components/games/GamesView.css', 'utf8');

const devIndex = css.indexOf('/* DEV CONTROLS */');
if (devIndex !== -1) {
  css = css.substring(0, devIndex);
}

// Ensure the mobile block wasn't already added
const mobileIndex = css.indexOf('/* MOBILE CRT OVERRIDES */');
if (mobileIndex !== -1) {
  css = css.substring(0, mobileIndex);
}

const mobileBlock = \

/* MOBILE CRT OVERRIDES */
@media (max-width: 768px) {
  .imac-screen {
    border-radius: 14% / 0%;
    width: 46.1%;
    height: 47.7%;
    transform: perspective(95vw) translate3d(-82.6%, -68.7%, 0px) rotateX(-0.1deg) rotateY(-15.2deg) rotateZ(14.3deg) scale(1, 1) skew(7.1deg, 2deg);
  }
}
\;

css += mobileBlock;
fs.writeFileSync('src/components/games/GamesView.css', css, 'utf8');
