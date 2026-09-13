import fs from 'fs';
let cssContent = fs.readFileSync('src/components/games/GamesView.css', 'utf8');
const devIndex = cssContent.indexOf('/* DEV CONTROLS */');
if (devIndex !== -1) {
  cssContent = cssContent.substring(0, devIndex);
}
fs.writeFileSync('src/components/games/GamesView.css', cssContent, 'utf8');
