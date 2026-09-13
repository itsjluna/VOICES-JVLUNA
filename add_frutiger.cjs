const fs = require('fs');
let css = fs.readFileSync('src/components/games/GamesView.css', 'utf8');

const aeroCss = \
/* ========================================= */
/* FRUTIGER AERO BUTTON BASE                 */
/* ========================================= */
.frutiger-button {
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.4);
  box-shadow: 
    inset 0 -8px 15px rgba(0,0,0,0.3),
    inset 0 2px 4px rgba(255,255,255,0.8),
    0 4px 10px rgba(0,0,0,0.3);
}
.frutiger-button::before {
  content: "";
  position: absolute;
  top: 1px;
  left: 3%;
  right: 3%;
  height: 48%;
  background: linear-gradient(to bottom, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.0) 100%);
  border-radius: 100px 100px 200px 200px / 100px 100px 60px 60px;
  pointer-events: none;
}
.frutiger-button.circle::before {
  left: 12%;
  right: 12%;
  height: 45%;
  border-radius: 50% 50% 50% 50% / 50% 50% 40% 40%;
}
\;

fs.appendFileSync('src/components/games/GamesView.css', aeroCss, 'utf8');
