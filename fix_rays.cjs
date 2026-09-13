const fs = require('fs');
let jsx = fs.readFileSync('src/components/games/GamesView.jsx', 'utf8');

// Update themes
const newThemes = \const THEMES = [
  { id: 'underwater', name: 'Underwater', icon: FaTint, c1: '#0f2027', c2: '#203a43', c3: '#2c5364', c4: '#00b4db', p1: '#00b4db', p2: '#0f2027' },
  { id: 'blossom', name: 'Blossom', icon: FaSeedling, c1: '#fbc2eb', c2: '#a6c1ee', c3: '#ff9a9e', c4: '#fecfef', p1: '#fbc2eb', p2: '#ff9a9e' },
  { id: 'spring', name: 'Spring Bloom', icon: FaSun, c1: '#56ab2f', c2: '#a8e063', c3: '#d4fc79', c4: '#96e6a1', p1: '#56ab2f', p2: '#96e6a1' },
  { id: 'skydive', name: 'Skydive', icon: FaCloud, c1: '#66a6ff', c2: '#89f7fe', c3: '#a1c4fd', c4: '#c2e9fb', p1: '#66a6ff', p2: '#89f7fe' },
  { id: 'girlypop', name: 'Girlypop', icon: FaHeart, c1: '#ff0844', c2: '#ffb199', c3: '#fbc2eb', c4: '#a6c1ee', p1: '#ff0844', p2: '#ffb199' }
];\;
jsx = jsx.replace(/const THEMES = \[[\s\S]*?\];/, newThemes);

// Add rapidRays useMemo
const rapidRays = \  // Generate randomized razor-thin light rays
  const rapidRays = React.useMemo(() => {
    return Array.from({ length: 6 }).map(() => ({
      top: \\\\\\%\\\,
      duration: \\\\\\s\\\,
      delay: \\\\\\s\\\,
      rotate: \\\\\\deg\\\,
      opacity: Math.random() * 0.5 + 0.3
    }));
  }, []);

  const cycleTheme = () => {\;
jsx = jsx.replace(/  const cycleTheme = \(\) => \{/, rapidRays);

// Replace styles
jsx = jsx.replace(
  /'--active-bg': activeTheme.bg,/,
  \'--theme-c1': activeTheme.c1,\n          '--theme-c2': activeTheme.c2,\n          '--theme-c3': activeTheme.c3,\n          '--theme-c4': activeTheme.c4,\
);

// Add divs
const divs = \<div className="games-fullbleed-bg">
          <div className="mesh-orb orb-1"></div>
          <div className="mesh-orb orb-2"></div>
          <div className="mesh-orb orb-3"></div>
          <div className="aurora-ray ray-1"></div>
          <div className="aurora-ray ray-2"></div>
          <div className="aurora-ray ray-4"></div>

          {rapidRays.map((ray, i) => (
            <div 
              key={\\\ay-\\\\\\}
              className="aurora-ray sharp-ray"
              style={{
                top: ray.top,
                animationDuration: ray.duration,
                animationDelay: ray.delay,
                '--ray-rot': ray.rotate,
                '--ray-op': ray.opacity
              }}
            />
          ))}\;
jsx = jsx.replace(/<div className="games-fullbleed-bg">/, divs);

fs.writeFileSync('src/components/games/GamesView.jsx', jsx);
