// Runtime performance / diagnostics flags.
//
// Usage (works on any device, persists in localStorage until cleared):
//   ?perf=lite      -> disable heavy decorative layers (scatter, weather, season backgrounds,
//                      vent debris, backdrop-filter, CSS filters). Diagnostic for main-thread/GPU load.
//   ?perf=normal    -> back to default rendering
//   ?tapdebug=1     -> show on-screen tap latency / jank overlay
//   ?tapdebug=0     -> hide overlay

function readFlag(param, storageKey) {
  if (typeof window === 'undefined') return null;
  try {
    const params = new URLSearchParams(window.location.search);
    if (params.has(param)) {
      const value = params.get(param);
      localStorage.setItem(storageKey, value);
      return value;
    }
    return localStorage.getItem(storageKey);
  } catch {
    return null;
  }
}

const perfMode = readFlag('perf', 'perf_mode');
const tapDebug = readFlag('tapdebug', 'tap_debug');

export const PERF_LITE = perfMode === 'lite';
export const TAP_DEBUG = tapDebug === '1';

export const IS_TOUCH =
  typeof window !== 'undefined' &&
  window.matchMedia('(hover: none), (pointer: coarse)').matches;

if (typeof document !== 'undefined' && PERF_LITE) {
  document.documentElement.classList.add('perf-lite');
}
