const fs = require('fs');
let css = fs.readFileSync('src/components/games/GamesView.css', 'utf8');

// Replace .games-wall background and width logic
css = css.replace(
  /\.games-wall\s*\{[\s\S]*?align-items:\s*center;\s*justify-content:\s*center;\s*\}/,
  \.games-wall {
  min-height: 100vh;
  position: relative;
  /* Normal flow to respect .container */
  display: flex;
  align-items: center;
  justify-content: center;
}\
);

css = css.replace(
  /:root\.dark\s*\.games-wall\s*\{[\s\S]*?\}/,
  \/* Removed dark mode background override because backgrounds are dynamically themed */\
);

css = css.replace(
  /@keyframes\s*y2kBackground\s*\{[\s\S]*?\}/,
  \\
);

const newBgCSS = \
/* DYNAMIC FULL BLEED BACKGROUND */
.games-fullbleed-bg {
  position: absolute;
  top: 0; left: 50%;
  width: 100vw;
  height: 100vh;
  min-height: 100vh;
  transform: translateX(-50%);
  z-index: -2;
  overflow: hidden;
}

.games-bg-wave, .games-bg-wave-2 {
  position: absolute;
  top: -50%; left: -50%;
  width: 200%; height: 200%;
  background: var(--active-bg);
  background-size: 300% 300%;
  animation: bgWaveFlow 20s infinite alternate ease-in-out;
  transition: background 1s ease;
}

.games-bg-wave-2 {
  background: radial-gradient(circle at center, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 60%);
  mix-blend-mode: overlay;
  animation: bgWaveFlow 15s infinite alternate-reverse ease-in-out;
}

@keyframes bgWaveFlow {
  0% { transform: translate(0, 0) scale(1) rotate(0deg); background-position: 0% 0%; }
  50% { transform: translate(-2%, 2%) scale(1.05) rotate(2deg); background-position: 100% 100%; }
  100% { transform: translate(2%, -2%) scale(1.1) rotate(-2deg); background-position: 0% 50%; }
}

.theme-cycler-btn {
  position: absolute;
  top: 2rem;
  right: 2rem;
  padding: 0.8rem 1.5rem;
  background: rgba(255,255,255,0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.4);
  border-radius: 50px;
  color: #fff;
  font-family: 'Inter', sans-serif;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  z-index: 100;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
}

.theme-cycler-btn:hover {
  background: rgba(255,255,255,0.4);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255,255,255,0.4);
}
\;

css = css + '\n' + newBgCSS;

fs.writeFileSync('src/components/games/GamesView.css', css, 'utf8');
