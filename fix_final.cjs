const fs = require('fs');
let jsx = fs.readFileSync('src/components/games/GamesView.jsx', 'utf8');

// Remove virtual controllers
const vRegex = /\{\/\* Virtual Controllers for Mobile \*\/\}[\s\S]*?<\/div>\s*<\/div>/;
jsx = jsx.replace(vRegex, '');

// Fix encoding
jsx = jsx.replace(/pequeA.a/g, 'pequeña');
jsx = jsx.replace(/dueA.o/g, 'dueño');
jsx = jsx.replace(/RecolecciA3n/g, 'Recolección');

fs.writeFileSync('src/components/games/GamesView.jsx', jsx);
