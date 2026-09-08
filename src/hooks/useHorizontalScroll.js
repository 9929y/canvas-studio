import { useEffect } from 'react';
// Preserve native horizontal input and release vertical wheel input at either edge.
export function useHorizontalScroll(ref) {
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const wheel = (event) => {
      if (event.ctrlKey || event.shiftKey || Math.abs(event.deltaX) >= Math.abs(event.deltaY)) return;
      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? node.clientWidth : 1;
      const delta = event.deltaY * unit;
      const max = node.scrollWidth - node.clientWidth;
      if (max <= 0 || (delta < 0 && node.scrollLeft <= 0) || (delta > 0 && node.scrollLeft >= max - 1)) return;
      event.preventDefault(); node.scrollLeft += delta;
    };
    node.addEventListener('wheel', wheel, { passive: false });
    return () => node.removeEventListener('wheel', wheel);
  }, [ref]);
}
