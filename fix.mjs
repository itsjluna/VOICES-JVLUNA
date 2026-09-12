import fs from 'fs';
let c = fs.readFileSync('src/components/visuals/VisualsView.jsx', 'utf8');
c = c.replace(/Preparando galer.*?a\.\.\./, 'Preparando galería...');
fs.writeFileSync('src/components/visuals/VisualsView.jsx', c, 'utf8');
