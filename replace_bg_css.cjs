const fs = require('fs');
let css = fs.readFileSync('src/components/games/GamesView.css', 'utf8');

const bgIndex = css.indexOf('/* DYNAMIC FULL BLEED BACKGROUND */');
if (bgIndex !== -1) {
  css = css.substring(0, bgIndex);
}

const newBgCSS = \
/* DYNAMIC FULL BLEED BACKGROUND - XMB MORPHING WAVES */
.games-fullbleed-bg {
  position: absolute;
  top: 0; left: 50%;
  width: 100vw;
  height: 100%;
  min-height: 100vh;
  transform: translateX(-50%);
  z-index: -2;
  overflow: hidden;
  background: var(--active-bg);
  background-size: 200% 200%;
  animation: bgPan 20s infinite alternate ease-in-out;
  transition: background 1.5s ease;
}

@keyframes bgPan {
  0% { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
}

.games-bg-base {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: radial-gradient(circle at 50% 50%, rgba(255,255,255,0.15) 0%, rgba(0,0,0,0.1) 100%);
  z-index: 0;
}

/* XMB RIBBONS */
.xmb-wave {
  position: absolute;
  top: 50%; left: 50%;
  width: 150vw; height: 150vw;
  margin-top: -75vw; margin-left: -75vw;
  border-radius: 40% 60% 50% 50% / 40% 50% 60% 50%;
  transform-origin: center;
  mix-blend-mode: overlay;
  z-index: 1;
}

.xmb-wave-1 {
  background: linear-gradient(135deg, rgba(255,255,255,0.5), rgba(255,255,255,0));
  animation: morphWave1 18s infinite linear;
}

.xmb-wave-2 {
  background: linear-gradient(45deg, rgba(255,255,255,0.3), rgba(255,255,255,0.05));
  animation: morphWave2 24s infinite linear reverse;
  width: 180vw; height: 180vw;
  margin-top: -90vw; margin-left: -90vw;
}

.xmb-wave-3 {
  background: linear-gradient(to right, rgba(255,255,255,0.4), transparent);
  animation: morphWave3 20s infinite linear;
  width: 120vw; height: 120vw;
  margin-top: -60vw; margin-left: -60vw;
  border-radius: 60% 40% 30% 70% / 50% 60% 40% 50%;
}

.xmb-wave-4 {
  background: linear-gradient(to bottom, rgba(255,255,255,0.2), rgba(0,0,0,0.1));
  animation: morphWave4 30s infinite linear reverse;
  width: 200vw; height: 200vw;
  margin-top: -100vw; margin-left: -100vw;
}

@keyframes morphWave1 {
  0% { transform: rotate(0deg) scale(1) skew(0deg); border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%; }
  50% { transform: rotate(180deg) scale(1.1) skew(10deg); border-radius: 60% 40% 30% 70% / 50% 60% 50% 40%; }
  100% { transform: rotate(360deg) scale(1) skew(0deg); border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%; }
}

@keyframes morphWave2 {
  0% { transform: rotate(0deg) scale(1.2) translateY(5%); border-radius: 50% 50% 50% 50% / 50% 50% 50% 50%; }
  50% { transform: rotate(180deg) scale(0.9) translateY(-5%); border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%; }
  100% { transform: rotate(360deg) scale(1.2) translateY(5%); border-radius: 50% 50% 50% 50% / 50% 50% 50% 50%; }
}

@keyframes morphWave3 {
  0% { transform: rotate(0deg) scale(0.8) scaleX(1); border-radius: 60% 40% 30% 70% / 50% 60% 40% 50%; }
  50% { transform: rotate(180deg) scale(1) scaleX(1.5); border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%; }
  100% { transform: rotate(360deg) scale(0.8) scaleX(1); border-radius: 60% 40% 30% 70% / 50% 60% 40% 50%; }
}

@keyframes morphWave4 {
  0% { transform: rotate(0deg) scale(1); }
  50% { transform: rotate(180deg) scale(1.05); }
  100% { transform: rotate(360deg) scale(1); }
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

css = css + newBgCSS;

fs.writeFileSync('src/components/games/GamesView.css', css, 'utf8');
