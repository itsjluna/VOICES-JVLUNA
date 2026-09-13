const fs = require('fs');
let css = fs.readFileSync('src/components/games/GamesView.css', 'utf8');

const oldModal = \/* GAME MODAL */
.game-modal-overlay {
  position: fixed;
  top: 0; left: 0; width: 100vw; height: 100vh;
  background: rgba(0,0,0,0.9);
  backdrop-filter: blur(10px);
  z-index: 9999999;
  display: flex;
  justify-content: center;
  align-items: center;
}
.game-modal-content {
  width: 90%;
  max-width: 1200px;
  height: 80vh;
  background: #000;
  border-radius: 20px;
  position: relative;
  box-shadow: 0 0 50px rgba(18, 216, 250, 0.3);
  border: 1px solid rgba(255,255,255,0.1);
  overflow: hidden;
}
.game-iframe {
  width: 100%;
  height: 100%;
  border: none;
}
.game-modal-close {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(255,255,255,0.2);
  border: none;
  border-radius: 50%;
  width: 40px; height: 40px;
  display: flex; justify-content: center; align-items: center;
  color: #fff;
  cursor: pointer;
  z-index: 10;
  transition: background 0.3s;
}
.game-modal-close:hover {
  background: rgba(255,255,255,0.4);
}\;

const newModal = \/* GAME MODAL */
.game-modal-overlay {
  position: fixed;
  top: 0; left: 0; width: 100vw; height: 100vh;
  background: rgba(0,0,0,0.9);
  backdrop-filter: blur(10px);
  z-index: 9999999;
  display: flex;
  justify-content: center;
  align-items: center;
}
.game-modal-content {
  width: 90%;
  max-width: 1200px;
  aspect-ratio: 16 / 9;
  max-height: 90vh;
  background: #000;
  border-radius: 20px;
  position: relative;
  box-shadow: 0 0 50px var(--theme-p1, rgba(18, 216, 250, 0.3));
  border: 1px solid var(--theme-p2, rgba(255,255,255,0.1));
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.game-iframe-wrapper {
  flex: 1;
  width: 100%;
  height: 100%;
}
.game-iframe {
  width: 100%;
  height: 100%;
  border: none;
}
.game-modal-close {
  position: absolute;
  top: 20px;
  right: 20px;
  background: linear-gradient(135deg, var(--theme-p1), var(--theme-p2));
  border: 2px solid #fff;
  border-radius: 50%;
  width: 45px; height: 45px;
  display: flex; justify-content: center; align-items: center;
  color: #fff;
  font-size: 1.2rem;
  cursor: pointer;
  z-index: 10;
  box-shadow: 0 4px 10px rgba(0,0,0,0.3);
  transition: transform 0.2s, box-shadow 0.2s;
}
.game-modal-close:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 15px rgba(0,0,0,0.5);
}

.mobile-virtual-controllers {
  display: none;
}

@media (max-width: 900px) {
  .game-modal-content {
    width: 100vw;
    height: 100vh;
    max-width: none;
    max-height: none;
    aspect-ratio: auto;
    border-radius: 0;
    justify-content: space-between;
  }
  .game-iframe-wrapper {
    flex: none;
    width: 100vw;
    height: auto;
    aspect-ratio: 16 / 9;
    margin-top: 5rem;
  }
  .game-modal-close {
    top: 1rem;
    right: 1rem;
  }
  
  .mobile-virtual-controllers {
    display: flex;
    flex: 1;
    justify-content: space-between;
    align-items: center;
    padding: 2rem;
    background: linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%);
  }

  /* D-PAD */
  .d-pad {
    position: relative;
    width: 120px; height: 120px;
    background: rgba(255,255,255,0.05);
    border-radius: 50%;
    box-shadow: inset 0 0 20px rgba(0,0,0,0.5), 0 5px 15px rgba(0,0,0,0.5);
  }
  .d-pad-btn {
    position: absolute;
    background: #333;
    border-radius: 5px;
    border: 1px solid #555;
  }
  .d-pad-btn.up { top: 10px; left: 40px; width: 40px; height: 35px; border-radius: 10px 10px 5px 5px; }
  .d-pad-btn.down { bottom: 10px; left: 40px; width: 40px; height: 35px; border-radius: 5px 5px 10px 10px; }
  .d-pad-btn.left { top: 40px; left: 10px; width: 35px; height: 40px; border-radius: 10px 5px 5px 10px; }
  .d-pad-btn.right { top: 40px; right: 10px; width: 35px; height: 40px; border-radius: 5px 10px 10px 5px; }
  .d-pad-center {
    position: absolute;
    top: 40px; left: 40px; width: 40px; height: 40px;
    background: #222;
  }

  /* ACTION BUTTONS */
  .action-buttons {
    position: relative;
    width: 140px; height: 140px;
  }
  .action-btn {
    position: absolute;
    width: 45px; height: 45px;
    border-radius: 50%;
    background: #333;
    color: #fff;
    font-weight: bold;
    display: flex; justify-content: center; align-items: center;
    box-shadow: 0 4px 10px rgba(0,0,0,0.5), inset 0 2px 5px rgba(255,255,255,0.2);
    border: 2px solid #111;
  }
  .action-btn.y { top: 0; left: 47.5px; background: var(--theme-p1); color: #000; text-shadow: none; }
  .action-btn.x { top: 47.5px; left: 0; background: var(--theme-p2); color: #000; text-shadow: none;}
  .action-btn.b { top: 47.5px; right: 0; }
  .action-btn.a { bottom: 0; left: 47.5px; background: #fff; color: #000; text-shadow: none;}
}
\;

css = css.replace(oldModal, newModal);
fs.writeFileSync('src/components/games/GamesView.css', css, 'utf8');
