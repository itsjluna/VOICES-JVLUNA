const fs = require('fs');
let css = fs.readFileSync('src/components/games/GamesView.css', 'utf8');

const arr = css.split('\n');
// we know the bad block is:
// }
//   top: 0; left: 0; right: 0; bottom: 0;
//   pointer-events: none;
//   z-index: 0;
//   overflow: hidden;
// }

let newCss = [];
let i = 0;
while(i < arr.length) {
  if (arr[i].trim() === '} ' || arr[i].trim() === '}') {
    if (i + 1 < arr.length && arr[i+1].includes('top: 0; left: 0; right: 0; bottom: 0;')) {
      newCss.push('}');
      newCss.push('.crt-static {');
      newCss.push('  position: absolute;');
      newCss.push('  top: -50%; left: -50%; right: -50%; bottom: -50%;');
      newCss.push('  background-image: url("data:image/svg+xml,%3Csvg viewBox=\\'0 0 200 200\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cfilter id=\\'noise\\'%3E%3CfeTurbulence type=\\'fractalNoise\\' baseFrequency=\\'0.8\\' numOctaves=\\'3\\' stitchTiles=\\'stitch\\'/%3E%3C/filter%3E%3Crect width=\\'100%25\\' height=\\'100%25\\' filter=\\'url(%23noise)\\' opacity=\\'0.15\\'/%3E%3C/svg%3E");');
      newCss.push('  animation: staticNoise 0.2s steps(2) infinite;');
      newCss.push('  z-index: 4;');
      newCss.push('  pointer-events: none;');
      newCss.push('  mix-blend-mode: overlay;');
      newCss.push('}');
      newCss.push('/* CLUTTER AND GRAPHICS */');
      newCss.push('.games-clutter, .games-graphics {');
      newCss.push('  position: absolute;');
      newCss.push('  top: 0; left: 0; right: 0; bottom: 0;');
      newCss.push('  pointer-events: none;');
      newCss.push('  z-index: 0;');
      newCss.push('  overflow: hidden;');
      newCss.push('}');
      i += 6;
      continue;
    }
  }
  newCss.push(arr[i]);
  i++;
}

fs.writeFileSync('src/components/games/GamesView.css', newCss.join('\n'), 'utf8');
