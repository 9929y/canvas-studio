import { canvasOverview } from '../lib/canvasLayout';
import { imageBounds } from '../lib/imageGeometry';
import { useLayoutEffect, useRef, useState } from 'react';
import { Caption, GlassPanel, ImageFrame, Lightbox } from './Shared';
import { useMotion, useReducedMotion } from '../hooks/useMotion';
import { clamp, gridPosition, gridStep } from '../lib/navigation';

export function CanvasViewer({ items = [], columns = 3, theme = 'light' }) {
  const cols = Math.max(1, Math.floor(columns) || 1);
  const [selected, setSelected] = useState(null);
  const [locked, setLocked] = useState(null);
  const [hover, setHover] = useState(null);
  const [detail, setDetail] = useState(null);
  const rows = Math.max(1, Math.ceil(items.length / cols));
  const [zoom, moveZoom] = useMotion(0);
  const [x, moveX] = useMotion((cols - 1) / 2);
  const [y, moveY] = useMotion((rows - 1) / 2);
  const reduced = useReducedMotion();
  const dots = useRef([]), stage = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  useLayoutEffect(() => {
    const observer = new ResizeObserver(([entry]) => setSize({ width: entry.contentRect.width, height: entry.contentRect.height }));
    observer.observe(stage.current);
    return () => observer.disconnect();
  }, []);
  const gallery = canvasOverview(items, cols, size.width, size.height);
  const active = selected === null ? -1 : clamp(selected, 0, Math.max(0, items.length - 1));
  const focus = (index) => {
    setSelected(index); moveZoom(1);
    const point = gridPosition(index, cols); moveX(point.x); moveY(point.y);
  };
  const overview = () => {
    setSelected(null); setLocked(null); setHover(null); moveZoom(0);
    moveX((cols - 1) / 2); moveY((rows - 1) / 2);
  };
  const toggle = (index) => { if (locked === index) overview(); else { focus(index); setLocked(index); } };
  const navigate = (event, index) => {
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const next = gridStep(index, event.key, cols, items.length);
    if (locked !== null) setLocked(next);
    focus(next); dots.current[next]?.focus();
  };
  return <section className="viewer canvas-viewer" data-theme={theme} data-overview={active === -1} aria-label="Canvas image viewer" onKeyDown={(event) => { if (event.key === 'Escape' && !detail) { event.preventDefault(); overview(); dots.current[0]?.focus(); } }}>
    <div className="canvas-context canvas-context-spacer" aria-hidden="true"><div className="caption"><div><h2>{items[active]?.title || ''}</h2><p>{items[active]?.description || ''}</p></div></div></div>
    <div className="canvas-stage" ref={stage}>
      {!items.length && <ImageFrame />}
      {items.map((item, index) => {
        const point = gridPosition(index, cols);
        const dx = point.x - x, dy = point.y - y;
        const distance = Math.hypot(dx, dy);
        const visible = zoom < .99 || distance < 2.3;
        const overviewRect = gallery[index];
        const aspect = item.width > 0 && item.height > 0 ? item.width / item.height : 1;
        const focusHeight = Math.min(size.height, Math.min(size.width * .94, 960) / aspect);
        const scale = 1 - zoom + Math.exp(-distance * .7) * zoom;
        return <button key={item.id} className="canvas-card" aria-label={`${active === -1 ? 'Focus' : 'Enlarge'} image ${index + 1}`} tabIndex={active === -1 || index === active ? 0 : -1} onClick={(event) => { if (active === -1) { focus(index); setLocked(index); } else setDetail({ item, origin: imageBounds(event.currentTarget) }); }} style={{
          left: overviewRect.x * (1 - zoom) + (size.width / 2 + dx * size.width * .52) * zoom,
          top: overviewRect.y * (1 - zoom) + (size.height / 2 + dy * size.height * .78) * zoom,
          width: overviewRect.width * (1 - zoom) + focusHeight * aspect * zoom,
          height: overviewRect.height * (1 - zoom) + focusHeight * zoom,
          transform: `translate(-50%, -50%) scale(${scale}) ${reduced ? '' : `rotateY(${dx * -9 * zoom}deg) rotateX(${dy * 7 * zoom}deg)`}`,
          zIndex: Math.round(100 - distance * 10), visibility: visible ? 'visible' : 'hidden', pointerEvents: active === -1 || index === active ? 'auto' : 'none',
        }}><ImageFrame item={item} /></button>;
      })}
    </div>
    <div className="canvas-context"><Caption item={items[active]} /></div>
    {!!items.length && <GlassPanel className="map-dock"><div className="dot-map" role="group" aria-label="Image map" style={{ gridTemplateColumns: `repeat(${cols}, 14px)` }} onPointerLeave={() => { setHover(null); if (locked === null) overview(); }}>
      {items.map((item, index) => {
        const point = gridPosition(index, cols);
        const dx = hover ? point.x - hover.x : 0, dy = hover ? point.y - hover.y : 0;
        const dist = Math.hypot(dx, dy);
        const repel = hover && locked === null && !reduced ? Math.max(0, 1.8 - dist) * 3 : 0;
        return <button key={item.id} ref={(el) => { dots.current[index] = el; }} className={`dot-target ${index === active ? 'is-active' : ''} ${index === locked ? 'is-locked' : ''}`} aria-label={`View image ${index + 1}`} aria-pressed={index === locked} tabIndex={index === (active === -1 ? 0 : active) ? 0 : -1}
          onPointerEnter={() => { setHover(point); if (locked === null) focus(index); }}
          onClick={() => toggle(index)} onKeyDown={(event) => navigate(event, index)}>
          <span className="map-dot" style={{ transform: `translate(${dist ? dx / dist * repel : 0}px, ${dist ? dy / dist * repel : 0}px)` }} />
        </button>;
      })}
    </div></GlassPanel>}
    {detail && <Lightbox item={detail.item} origin={detail.origin} theme={theme} showCaption={false} onClose={() => setDetail(null)} />}
  </section>;
}
