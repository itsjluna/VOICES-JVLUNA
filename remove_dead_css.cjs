const fs = require('fs');
const lines = fs.readFileSync('src/components/games/GamesView.css', 'utf8').split('\n');
const newLines = [];
let i = 0;
while (i < lines.length) {
  if (lines[i].includes('.mobile-virtual-controllers {')) {
    i += 3; // skip .mobile-virtual-controllers { display: none; }
    continue;
  }
  if (lines[i].includes('@media (max-width: 900px) {') && lines[i+1].includes('.game-modal-content {')) {
    // This is the media query for the dead mobile modal. Skip until its closing brace.
    let braceCount = 1;
    i++;
    while (braceCount > 0 && i < lines.length) {
      if (lines[i].includes('{')) braceCount++;
      if (lines[i].includes('}')) braceCount--;
      i++;
    }
    continue;
  }
  newLines.push(lines[i]);
  i++;
}
fs.writeFileSync('src/components/games/GamesView.css', newLines.join('\n'));
