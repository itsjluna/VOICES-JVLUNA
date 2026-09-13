const fs = require('fs');
let jsx = fs.readFileSync('src/components/games/GamesView.jsx', 'utf8');

const vRegex = /\{\/\* Virtual Controllers for Mobile \*\/\}[\s\S]*?<div className="action-buttons">[\s\S]*?<\/div>\s*<\/div>/;
jsx = jsx.replace(vRegex, '');

fs.writeFileSync('src/components/games/GamesView.jsx', jsx);
