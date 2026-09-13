const fs = require('fs');
let jsx = fs.readFileSync('src/components/games/GamesView.jsx', 'utf8');

// Add top level BackButton
jsx = jsx.replace(/<PageWrapper>/, '<PageWrapper className="games-page">\n      <BackButton color="rgba(255,255,255,0.8)" hoverColor="#fff" />');

// Remove wrapped BackButton
jsx = jsx.replace(/<div style=\{\{ position: 'absolute', top: '2rem', left: '2rem', zIndex: 100 \}\}>\s*<BackButton \/>\s*<\/div>/, '');

fs.writeFileSync('src/components/games/GamesView.jsx', jsx);
