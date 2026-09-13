import fs from 'fs';
let content = fs.readFileSync('src/components/games/GamesView.jsx', 'utf8');

const base64 = fs.readFileSync('barrel_b64.txt', 'utf8').trim();

const svgMarkup = \
      {/* SVG CRT Barrel Distortion Filter */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <filter id="crt-bulge" x="0" y="0" width="100%" height="100%" filterUnits="objectBoundingBox" primitiveUnits="objectBoundingBox">
          <feImage href="data:image/png;base64,\" preserveAspectRatio="none" result="map" width="1" height="1" />
          <feDisplacementMap in="SourceGraphic" in2="map" scale="0.04" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
      
      <div className="games-wall">\;

content = content.replace('<div className="games-wall">', svgMarkup);

// Add filter to crtStyle
content = content.replace(
  /borderRadius: \\\\\\$\\{t.brX\\}% \\/ \\\$\\{t.brY\\}%\\\,/,
  "borderRadius: \\% / \%\,\n    filter: 'url(#crt-bulge)',"
);

fs.writeFileSync('src/components/games/GamesView.jsx', content, 'utf8');
