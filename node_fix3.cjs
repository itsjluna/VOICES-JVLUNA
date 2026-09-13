const fs = require('fs');
let jsx = fs.readFileSync('src/components/games/GamesView.jsx', 'utf8');

// 1. Move aero-bubbles inside games-fullbleed-bg
const bubblesRegex = /<div className="aero-bubbles">[\s\S]*?<\/div>\s*<\/div>/;
const bubblesMatch = jsx.match(bubblesRegex);

if (bubblesMatch) {
  let bubblesCode = bubblesMatch[0];
  // Remove one </div> from the end of bubblesCode because that's the end of aero-bubbles
  bubblesCode = bubblesCode.substring(0, bubblesCode.lastIndexOf('</div>'));
  
  // Remove bubbles from old location
  jsx = jsx.replace(bubblesRegex, '');
  
  // Add bubbles to fullbleed bg
  jsx = jsx.replace(
    '<div className="games-fullbleed-bg"></div>',
    \<div className="games-fullbleed-bg">
          \
        </div>\
  );
}

// 2. Replace genre tag emoji
jsx = jsx.replace(
  /<div className="games-genre-tag">[\s\S]*?<\/div>/,
  \<div className="games-genre-tag">
                  <FaGamepad style={{ marginRight: '0.5rem', fontSize: '1.1em', verticalAlign: 'text-bottom' }} />
                  {language === 'EN' ? 'Stealth Collectathon Parody' : 'Parodia de Sigilo y Recolección'}
                </div>\
);

fs.writeFileSync('src/components/games/GamesView.jsx', jsx, 'utf8');
