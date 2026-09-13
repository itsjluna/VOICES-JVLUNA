import fs from 'fs';
let css = fs.readFileSync('src/components/games/GamesView.css', 'utf8');

// 1. Font changes
css = css.replace(/font-family:\s*'Courier New', Courier, monospace;/g, "font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;");

// 2. Bubbles transparency
css = css.replace(
  /background:\s*radial-gradient\(circle at 30% 30%,\s*rgba\(255,\s*255,\s*255,\s*0\.8\),\s*rgba\(255,\s*255,\s*255,\s*0\.1\)\s*60%,\s*rgba\(255,\s*255,\s*255,\s*0\.4\)\s*100%\);/,
  "background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.02) 60%, rgba(255, 255, 255, 0.1) 100%);"
);
css = css.replace(
  /box-shadow:\s*inset 0 0 20px rgba\(255,255,255,0\.5\),\s*0 4px 15px rgba\(0,0,0,0\.1\);/,
  "box-shadow: inset 0 0 10px rgba(255,255,255,0.2), 0 4px 10px rgba(0,0,0,0.05);"
);

// 3. Bubbles shape (aspect-ratio)
css = css.replace(
  /border-radius: 50%;/,
  "border-radius: 50%;\n  aspect-ratio: 1 / 1;"
);

// 4. Background texture
css = css.replace(/background: linear-gradient\(120deg, #74ebd5 0%, #9face6 100%\);/, "background: #f0f0f0; /* Temporary flat background */");
css = css.replace(/background: linear-gradient\(120deg, #1b263b 0%, #415a77 100%\);/, "background: #111; /* Temporary flat background */");

// Update CSS fallback to the new Desktop coordinates so the initial render is perfect
css = css.replace(
  /width: 39\.6%;\s*height: 39\.2%;\s*transform: perspective\(155vw\)[\s\S]*?;/,
  \width: 45.4%;
  height: 47.7%;
  transform: perspective(39vw) translate3d(-84.8%, -68.7%, 0px) rotateX(2.5deg) rotateY(-15.2deg) rotateZ(14.3deg) scale(1, 1) skew(7.1deg, 2deg);\
);

fs.writeFileSync('src/components/games/GamesView.css', css, 'utf8');
