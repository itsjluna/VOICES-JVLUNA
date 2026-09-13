const fs = require('fs');
let jsx = fs.readFileSync('src/components/games/GamesView.jsx', 'utf8');
jsx = jsx.replace(/pequeA.a/g, 'pequeña');
jsx = jsx.replace(/dueA.o/g, 'dueño');
jsx = jsx.replace(/RecolecciA3n/g, 'Recolección');
fs.writeFileSync('src/components/games/GamesView.jsx', jsx);
