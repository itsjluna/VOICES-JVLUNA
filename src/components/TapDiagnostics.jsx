import React, { useEffect, useRef, useState } from 'react';

// On-device tap diagnostics. Enable with ?tapdebug=1 (see src/perf.js).
// Shows, per tap:
//   down  = delay between the browser creating pointerdown and JS receiving it (main-thread queueing)
//   click = time from pointerdown to the click event (should be < ~150ms)
//   hit   = the top elements under the finger (reveals invisible overlays absorbing taps)
// Plus global counters: pointercancel (browser stole the gesture), taps with no click,
// long frames (>50ms) and worst frame gap during the last 2s.

const describe = (el) => {
  if (!el || !el.tagName) return '?';
  let s = el.tagName.toLowerCase();
  if (el.id) s += `#${el.id}`;
  if (typeof el.className === 'string' && el.className.trim()) {
    s += '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.');
  }
  const z = getComputedStyle(el).zIndex;
  if (z && z !== 'auto') s += `[z${z}]`;
  return s;
};

export default function TapDiagnostics() {
  const [, force] = useState(0);
  const state = useRef({
    taps: [],
    cancels: 0,
    noClick: 0,
    longFrames: 0,
    worstFrame: 0,
    longTasks: 0,
    pending: null,
  });

  useEffect(() => {
    const s = state.current;
    const rerender = () => force((n) => n + 1);

    const onDown = (e) => {
      const now = performance.now();
      const stack = (document.elementsFromPoint?.(e.clientX, e.clientY) || [])
        .slice(0, 3)
        .map(describe)
        .join(' > ');
      s.pending = {
        t0: e.timeStamp,
        downDelay: Math.round(now - e.timeStamp),
        x: e.clientX,
        y: e.clientY,
        moved: false,
        clicked: false,
        hit: stack,
        target: describe(e.target),
      };
    };

    const onMove = (e) => {
      const p = s.pending;
      if (p && Math.hypot(e.clientX - p.x, e.clientY - p.y) > 10) p.moved = true;
    };

    const onCancel = () => {
      s.cancels += 1;
      rerender();
    };

    const onUp = (e) => {
      const p = s.pending;
      if (!p || p.moved) return;
      
      // Store target to manually trigger click if dropped
      const target = e.target;

      setTimeout(() => {
        if (!p.clicked) {
          s.noClick += 1;
          s.taps = [{ ...p, click: 'FORCED' }, ...s.taps].slice(0, 5);
          if (p === s.pending) s.pending = null;
          rerender();
          
          // The browser dropped the click (likely due to a 2px scroll or scale animation).
          // Force it!
          try {
            target.click();
          } catch (err) {}
        }
      }, 150);
    };

    const onClick = (e) => {
      const p = s.pending;
      if (!p || p.clicked) return;
      p.clicked = true;
      const queue = Math.round(performance.now() - e.timeStamp);
      s.taps = [{ ...p, click: `${Math.round(e.timeStamp - p.t0)}ms (+${queue} queued)` }, ...s.taps].slice(0, 5);
      rerender();
    };

    window.addEventListener('pointerdown', onDown, { capture: true, passive: true });
    window.addEventListener('pointermove', onMove, { capture: true, passive: true });
    window.addEventListener('pointerup', onUp, { capture: true, passive: true });
    window.addEventListener('pointercancel', onCancel, { capture: true, passive: true });
    window.addEventListener('click', onClick, { capture: true });

    // Frame gap monitor (works on Safari, which lacks the Long Tasks API)
    let raf;
    let last = performance.now();
    let windowWorst = 0;
    let windowStart = last;
    const loop = (t) => {
      const gap = t - last;
      last = t;
      if (gap > 50) s.longFrames += 1;
      windowWorst = Math.max(windowWorst, gap);
      if (t - windowStart > 2000) {
        s.worstFrame = Math.round(windowWorst);
        windowWorst = 0;
        windowStart = t;
        rerender();
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    let po;
    try {
      po = new PerformanceObserver((list) => {
        s.longTasks += list.getEntries().length;
      });
      po.observe({ type: 'longtask', buffered: true });
    } catch {
      po = null;
    }

    return () => {
      window.removeEventListener('pointerdown', onDown, { capture: true });
      window.removeEventListener('pointermove', onMove, { capture: true });
      window.removeEventListener('pointerup', onUp, { capture: true });
      window.removeEventListener('pointercancel', onCancel, { capture: true });
      window.removeEventListener('click', onClick, { capture: true });
      cancelAnimationFrame(raf);
      po?.disconnect();
    };
  }, []);

  const s = state.current;
  return (
    <div
      style={{
        position: 'fixed',
        top: 'env(safe-area-inset-top, 50px)',
        left: 4,
        right: 4,
        zIndex: 2147483647,
        pointerEvents: 'none',
        background: 'rgba(0,0,0,0.78)',
        color: '#0f0',
        font: '10px/1.35 monospace',
        padding: '4px 6px',
        borderRadius: 4,
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-all',
      }}
    >
      {`frame worst(2s): ${s.worstFrame}ms | long frames: ${s.longFrames} | longtasks: ${s.longTasks}\n` +
        `pointercancel: ${s.cancels} | taps w/o click: ${s.noClick} | lite: ${document.documentElement.classList.contains('perf-lite')}\n` +
        s.taps
          .map((t) => `- down +${t.downDelay}ms, click ${t.click}\n   hit: ${t.hit}`)
          .join('\n')}
    </div>
  );
}
