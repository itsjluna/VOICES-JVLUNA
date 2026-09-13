import fs from 'fs';
let content = fs.readFileSync('src/components/games/GamesView.jsx', 'utf8');

const devToolsJSX = \
      <AnimatePresence>
        {showControls && (
          <motion.div 
            className="dev-controls"
            initial={{ opacity: 0, x: 200 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 200 }}
            drag
          >
            <div className="dev-header">
              <h4>Screen Calibration</h4>
              <button onClick={() => setShowControls(false)}><FaTimes /></button>
            </div>
            
            <div className="dev-slider">
              <label>Width: \px</label>
              <input type="range" min="100" max="800" value={t.w} onChange={e => handleT('w', e.target.value)} />
            </div>
            <div className="dev-slider">
              <label>Height: \px</label>
              <input type="range" min="100" max="800" value={t.h} onChange={e => handleT('h', e.target.value)} />
            </div>
            <div className="dev-slider">
              <label>Trans X: \px</label>
              <input type="range" min="-500" max="500" value={t.x} onChange={e => handleT('x', e.target.value)} />
            </div>
            <div className="dev-slider">
              <label>Trans Y: \px</label>
              <input type="range" min="-500" max="500" value={t.y} onChange={e => handleT('y', e.target.value)} />
            </div>
            <div className="dev-slider">
              <label>Rotate X: \°</label>
              <input type="range" min="-90" max="90" step="0.1" value={t.rx} onChange={e => handleT('rx', e.target.value)} />
            </div>
            <div className="dev-slider">
              <label>Rotate Y: \°</label>
              <input type="range" min="-90" max="90" step="0.1" value={t.ry} onChange={e => handleT('ry', e.target.value)} />
            </div>
            <div className="dev-slider">
              <label>Rotate Z: \°</label>
              <input type="range" min="-180" max="180" step="0.1" value={t.rz} onChange={e => handleT('rz', e.target.value)} />
            </div>
            <div className="dev-slider">
              <label>Skew X: \°</label>
              <input type="range" min="-90" max="90" step="0.1" value={t.skx} onChange={e => handleT('skx', e.target.value)} />
            </div>
            <div className="dev-slider">
              <label>Skew Y: \°</label>
              <input type="range" min="-90" max="90" step="0.1" value={t.sky} onChange={e => handleT('sky', e.target.value)} />
            </div>
            <div className="dev-slider">
              <label>Scale X: \</label>
              <input type="range" min="0.1" max="3" step="0.01" value={t.sx} onChange={e => handleT('sx', e.target.value)} />
            </div>
            <div className="dev-slider">
              <label>Scale Y: \</label>
              <input type="range" min="0.1" max="3" step="0.01" value={t.sy} onChange={e => handleT('sy', e.target.value)} />
            </div>
            
            <button className="dev-copy-btn" onClick={copyConfig}>
              <FaCopy /> Copy Config
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      {!showControls && (
        <button className="dev-toggle-btn" onClick={() => setShowControls(true)}>
          <FaSlidersH /> Calibrate CRT
        </button>
      )}

      <AnimatePresence>\;

content = content.replace('<AnimatePresence>', devToolsJSX);

// Replace the hardcoded .imac-screen with style={crtStyle}
content = content.replace(/<div className="imac-screen">/, '<div className="imac-screen" style={crtStyle}>');

fs.writeFileSync('src/components/games/GamesView.jsx', content, 'utf8');
