import fs from 'fs';
let content = fs.readFileSync('src/components/games/GamesView.css', 'utf8');

const devIndex = content.indexOf('/* DEV CONTROLS */');
if (devIndex !== -1) {
  content = content.substring(0, devIndex);
}

fs.writeFileSync('src/components/games/GamesView.css', content, 'utf8');
