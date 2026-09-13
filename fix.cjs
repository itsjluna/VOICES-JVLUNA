const fs = require('fs');
const lines = fs.readFileSync('src/components/games/GamesView.jsx', 'utf8').split('\n');
for (let i=0; i<lines.length; i++) {
  if (lines[i].includes('JAM-DOG es una')) {
    lines[i] = '                      : "JAM-DOG es una pequeña demo de prueba de concepto del genero collectathon sobre un perro que tiene que recolectar los ingredientes para hacer un sandwich de mantequilla de mani y mermelada sin que su dueño lo note, inspirado y siendo una parodia de las mecanicas de sigilo de Metal Gear."}';
  }
  if (lines[i].includes('Parodia de Sigilo')) {
    lines[i] = '                  {language === \'EN\' ? \'Stealth Collectathon Parody\' : \'Parodia de Sigilo y Recolección\'}';
  }
}
fs.writeFileSync('src/components/games/GamesView.jsx', lines.join('\n'));
