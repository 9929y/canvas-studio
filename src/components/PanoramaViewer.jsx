import { useEffect, useId, useRef, useState } from 'react';
import { Caption, GlassPanel, ImageFrame } from './Shared';
import { useReducedMotion } from '../hooks/useMotion';
import { useHorizontalScroll } from '../hooks/useHorizontalScroll';
import { scrollMetrics, trackToScroll } from '../lib/navigation';

export function PanoramaViewer({ item, theme = 'light' }) {
  const viewport = useRef(null), track = useRef(null), content = useRef(null), drag = useRef(null);
  const [metrics, setMetrics] = useState({ max: 0, ratio: 1, position: 0 });
  const reduced = useReducedMotion();
  const id = useId();
  useHorizontalScroll(viewport);
  const update = () => {
    const el = viewport.current;
    if (el) setMetrics({ ...scrollMetrics(el.clientWidth, el.scrollWidth), position: el.scrollLeft });
  };
  useEffect(() => {
    const observer = new ResizeObserver(update);
    if (viewport.current) observer.observe(viewport.current);
    if (content.current) observer.observe(content.current);
    return () => observer.disconnect();
  }, [item]);
  const scroll = (left, smooth = false) => viewport.current?.scrollTo({ left, behavior: smooth && !reduced ? 'smooth' : 'instant' });
  const point = (clientX, offset, smooth = false) => {
    const rect = track.current.getBoundingClientRect();
    scroll(trackToScroll(clientX - rect.left - offset, rect.width, rect.width * metrics.ratio, metrics.max), smooth);
  };
  const start = (event) => {
    if (!metrics.max || event.button !== 0) return;
    event.preventDefault(); event.currentTarget.focus();
    const rect = track.current.getBoundingClientRect();
    const width = rect.width * metrics.ratio;
    const left = metrics.max ? metrics.position / metrics.max * (rect.width - width) : 0;
    const onThumb = event.target.closest('.scroll-thumb');
    const offset = onThumb ? event.clientX - rect.left - left : width / 2;
    drag.current = { offset, x: event.clientX };
    event.currentTarget.setPointerCapture(event.pointerId);
    if (!onThumb) point(event.clientX, offset, true);
  };
  const keyboard = (event) => {
    const amount = { ArrowLeft: -80, ArrowRight: 80, PageUp: -viewport.current.clientWidth * .8, PageDown: viewport.current.clientWidth * .8 }[event.key];
    if (amount === undefined && !['Home', 'End'].includes(event.key)) return;
    event.preventDefault(); scroll(event.key === 'Home' ? 0 : event.key === 'End' ? metrics.max : metrics.position + amount, true);
  };
  return <section className="viewer panorama-viewer" data-theme={theme} aria-label="Panorama image viewer">
    <div className="panorama-window" id={id} ref={viewport} onScroll={update} tabIndex={0} aria-label="Scrollable workflow image">
      <div className="panorama-content" ref={content}><ImageFrame item={item} onLoad={update} /></div>
    </div>
    <Caption item={item} />
    <GlassPanel className="linear-dock"><div className={`scroll-track ${!metrics.max ? 'is-disabled' : ''}`} ref={track} role="scrollbar" tabIndex={metrics.max ? 0 : -1} aria-label="Workflow position" aria-controls={id} aria-orientation="horizontal" aria-valuemin={0} aria-valuemax={Math.round(metrics.max)} aria-valuenow={Math.round(metrics.position)} aria-disabled={!metrics.max}
      onKeyDown={keyboard} onPointerDown={start} onPointerMove={(event) => { if (drag.current && Math.abs(event.clientX - drag.current.x) > 2) point(event.clientX, drag.current.offset); }} onPointerUp={() => { drag.current = null; }} onPointerCancel={() => { drag.current = null; }} onLostPointerCapture={() => { drag.current = null; }}>
      <span className="scroll-rail" /><span className="scroll-thumb" style={{ width: `${metrics.ratio * 100}%`, left: `${metrics.max ? metrics.position / metrics.max * (1 - metrics.ratio) * 100 : 0}%` }}><i /><i /><i /></span>
    </div></GlassPanel>
  </section>;
}
