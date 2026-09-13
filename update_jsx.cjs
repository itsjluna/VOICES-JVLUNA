const fs = require('fs');
let jsx = fs.readFileSync('src/components/games/GamesView.jsx', 'utf8');

const newThemes = \const THEMES = [
  { id: 'underwater', name: 'Underwater', icon: FaTint, c1: '#0f2027', c2: '#203a43', c3: '#2c5364', c4: '#00b4db', p1: '#00b4db', p2: '#0f2027' },
  { id: 'blossom', name: 'Blossom', icon: FaSeedling, c1: '#fbc2eb', c2: '#a6c1ee', c3: '#ff9a9e', c4: '#fecfef', p1: '#fbc2eb', p2: '#ff9a9e' },
  { id: 'spring', name: 'Spring Bloom', icon: FaSun, c1: '#56ab2f', c2: '#a8e063', c3: '#d4fc79', c4: '#96e6a1', p1: '#56ab2f', p2: '#96e6a1' },
  { id: 'skydive', name: 'Skydive', icon: FaCloud, c1: '#66a6ff', c2: '#89f7fe', c3: '#a1c4fd', c4: '#c2e9fb', p1: '#66a6ff', p2: '#89f7fe' },
  { id: 'girlypop', name: 'Girlypop', icon: FaHeart, c1: '#ff0844', c2: '#ffb199', c3: '#fbc2eb', c4: '#a6c1ee', p1: '#ff0844', p2: '#ffb199' }
];\;

jsx = jsx.replace(/const THEMES = \[[\s\S]*?\];/, newThemes);

const oldStyle = \        style={{ \n          '--active-bg': activeTheme.bg,\n          '--theme-p1': activeTheme.p1,\n          '--theme-p2': activeTheme.p2\n        }}\;
const newStyle = \        style={{ 
          '--theme-c1': activeTheme.c1,
          '--theme-c2': activeTheme.c2,
          '--theme-c3': activeTheme.c3,
          '--theme-c4': activeTheme.c4,
          '--theme-p1': activeTheme.p1,
          '--theme-p2': activeTheme.p2
        }}\;

jsx = jsx.replace(oldStyle, newStyle);

const oldFullBleed = \<div className="games-fullbleed-bg">\;
const newFullBleed = \<div className="games-fullbleed-bg">
          <div className="mesh-orb orb-1"></div>
          <div className="mesh-orb orb-2"></div>
          <div className="mesh-orb orb-3"></div>
          <div className="aurora-ray ray-1"></div>
          <div className="aurora-ray ray-2"></div>\;

jsx = jsx.replace(oldFullBleed, newFullBleed);

fs.writeFileSync('src/components/games/GamesView.jsx', jsx);
