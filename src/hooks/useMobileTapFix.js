import { useEffect } from 'react';

/**
 * iOS Safari is notoriously aggressive at dropping `click` events if the user's finger 
 * rolls even 1-2 pixels during a tap, or if the element visually shrinks (`whileTap`).
 * This hook globally monitors pointer events and forces a click if it detects a clean 
 * tap that the browser unfairly swallowed.
 */
export function useMobileTapFix() {
  useEffect(() => {
    // Only apply on touch devices
    const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    if (!isTouch) return;

    let pending = null;

    const onDown = (e) => {
      // Only care about primary touch (prevents multi-touch weirdness)
      if (!e.isPrimary) return;
      pending = { 
        t0: e.timeStamp, 
        y: e.clientY, 
        x: e.clientX,
        moved: false,
        clicked: false
      };
    };

    const onMove = (e) => {
      if (!pending || !e.isPrimary) return;
      // Allow up to 15px of finger roll (jitter tolerance).
      // If it moves more than 15px, the user is genuinely scrolling or swiping.
      if (Math.abs(e.clientY - pending.y) > 15 || Math.abs(e.clientX - pending.x) > 15) {
        pending.moved = true;
      }
    };

    const onUp = (e) => {
      if (!pending || !e.isPrimary || pending.moved) return;
      
      const p = pending;
      const target = e.target;
      
      // Give the browser 150ms to fire the native click event.
      // If it doesn't, we intervene and force it.
      setTimeout(() => {
        if (!p.clicked && target && document.contains(target)) {
          try {
            target.click();
          } catch (err) {}
        }
      }, 150);
    };

    const onClick = (e) => {
      // A native click fired! We don't need to intervene.
      // Note: `isTrusted` is true for browser-generated clicks, false for `target.click()`.
      // We only care that *a* click happened.
      if (pending) {
        pending.clicked = true;
      }
    };

    // Use passive event listeners for performance
    window.addEventListener('pointerdown', onDown, { capture: true, passive: true });
    window.addEventListener('pointermove', onMove, { capture: true, passive: true });
    window.addEventListener('pointerup', onUp, { capture: true, passive: true });
    // Listen for click to know if we need to force it
    window.addEventListener('click', onClick, { capture: true });

    return () => {
      window.removeEventListener('pointerdown', onDown, { capture: true });
      window.removeEventListener('pointermove', onMove, { capture: true });
      window.removeEventListener('pointerup', onUp, { capture: true });
      window.removeEventListener('click', onClick, { capture: true });
    };
  }, []);
}
