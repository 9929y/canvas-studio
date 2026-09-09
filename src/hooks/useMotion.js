import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
const query = '(prefers-reduced-motion: reduce)';
const subscribe = (notify) => { const media = window.matchMedia(query); media.addEventListener('change', notify); return () => media.removeEventListener('change', notify); };
export function useReducedMotion() {
  return useSyncExternalStore(subscribe, () => window.matchMedia(query).matches, () => false);
}
// Time-based damping: same motion at different refresh rates; stop at rest.
export function useMotion(initial = 0) {
  const reduced = useReducedMotion();
  const [value, setValue] = useState(initial);
  const current = useRef(initial);
  const frame = useRef(0);
  useEffect(() => () => cancelAnimationFrame(frame.current), []);
  const move = useCallback((target, immediate = false, onComplete) => {
    cancelAnimationFrame(frame.current);
    if (immediate || reduced) { current.current = target; setValue(target); onComplete?.(); return; }
    let last = performance.now();
    const tick = (now) => {
      const dt = Math.min(64, now - last); last = now;
      current.current += (target - current.current) * (1 - Math.exp(-dt / 95));
      if (Math.abs(target - current.current) < 0.001) { current.current = target; setValue(target); onComplete?.(); return; }
      setValue(current.current); frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
  }, [reduced]);
  return [value, move];
}
