// Runtime performance utilities.
// Clean up any stale diagnostic flags from previous performance tests.
if (typeof window !== 'undefined') {
  try {
    localStorage.removeItem('perf_mode');
    localStorage.removeItem('tap_debug');
  } catch (e) {}

  if (typeof document !== 'undefined') {
    document.documentElement.classList.remove('perf-lite');
  }
}

export const PERF_LITE = false;

export const IS_TOUCH =
  typeof window !== 'undefined' &&
  window.matchMedia('(hover: none), (pointer: coarse)').matches;
