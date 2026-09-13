import fs from 'fs';
let cssContent = fs.readFileSync('src/components/games/GamesView.css', 'utf8');

cssContent = cssContent.replace(
  /width: 39\.6%;\s*height: 39\.2%;\s*transform: perspective\(155vw\)[\s\S]*?;/,
  \width: 45.4%;
  height: 47.7%;
  transform: perspective(39vw) translate3d(-84.8%, -68.7%, 0px) rotateX(2.5deg) rotateY(-15.2deg) rotateZ(14.3deg) scale(1, 1) skew(7.1deg, 2deg);\
);

const devIndex = cssContent.indexOf('/* DEV CONTROLS */');
if (devIndex !== -1) {
  cssContent = cssContent.substring(0, devIndex);
}

fs.writeFileSync('src/components/games/GamesView.css', cssContent, 'utf8');
