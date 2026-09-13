const fs = require('fs');
let jsx = fs.readFileSync('src/components/games/GamesView.jsx', 'utf8');

jsx = jsx.replace(/JAM-DOG es una [\s\S]*?Metal Gear\."\}/, 'JAM-DOG es una pequeña demo de prueba de concepto del genero collectathon sobre un perro que tiene que recolectar los ingredientes para hacer un sandwich de mantequilla de mani y mermelada sin que su dueño lo note, inspirado y siendo una parodia de las mecanicas de sigilo de Metal Gear."}');
jsx = jsx.replace(/Parodia de Sigilo y RecolecciA3n/g, 'Parodia de Sigilo y Recolección');

fs.writeFileSync('src/components/games/GamesView.jsx', jsx);
