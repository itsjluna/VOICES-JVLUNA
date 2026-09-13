import fs from 'fs';
let content = fs.readFileSync('src/components/games/GamesView.jsx', 'utf8');
content = content.replace(/Parodia de Sigilo y RecolecciA3n/, 'Parodia de Sigilo y Recolección');
content = content.replace(/'JAM-DOG es una.*?universitario\.'/s, "'JAM-DOG es una pequeña demo prueba de concepto de un juego del género collectathon sobre un perro que tiene que recolectar los ingredientes para hacer un sándwich de mantequilla de maní y mermelada sin que su dueño lo note, inspirado y siendo una parodia de las mecánicas de sigilo de Metal Gear, hecho como proyecto universitario.'");
fs.writeFileSync('src/components/games/GamesView.jsx', content, 'utf8');
