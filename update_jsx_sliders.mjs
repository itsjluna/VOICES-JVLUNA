import fs from 'fs';
let content = fs.readFileSync('src/components/games/GamesView.jsx', 'utf8');

// Update state
content = content.replace(
  /skx: 7\.2,\s+sky: -0\.7/,
  "skx: 7.2,\n    sky: -0.7,\n    brX: 25,\n    brY: 15"
);

// Update crtStyle
content = content.replace(
  /height: \\\\px\,/,
  "height: \\px\,\n    borderRadius: \\% / \%\,"
);

// Add sliders
content = content.replace(
  /<div className="dev-slider">\s*<label>Width:/,
  \<div className="dev-slider">
              <label>Curve X: \%</label>
              <input type="range" min="0" max="50" value={t.brX} onChange={e => handleT('brX', e.target.value)} />
            </div>
            <div className="dev-slider">
              <label>Curve Y: \%</label>
              <input type="range" min="0" max="50" value={t.brY} onChange={e => handleT('brY', e.target.value)} />
            </div>
            <div className="dev-slider">
              <label>Width:\
);

fs.writeFileSync('src/components/games/GamesView.jsx', content, 'utf8');
