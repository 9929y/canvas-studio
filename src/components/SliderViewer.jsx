import { imageBounds } from '../lib/imageGeometry';
import { useRef, useState } from 'react';
import { Caption, GlassPanel, ImageFrame, Lightbox } from './Shared';
import { useMotion, useReducedMotion } from '../hooks/useMotion';
import { clamp, sliderPosition, snapSlide } from '../lib/navigation';

export function SliderViewer({ items = [], theme = 'light' }) {
  const [position, move] = useMotion(0);
  const [selected, setSelected] = useState(0);
  const [detail, setDetail] = useState(null);
  const [hovered, setHovered] = useState(null);
  const target = useRef(0);
  const drag = useRef(null), track = useRef(null), buttons = useRef([]);
  const reduced = useReducedMotion();
  const active = clamp(selected, 0, Math.max(0, items.length - 1));
  const updateSelection = (index) => {
    const next = snapSlide(index, items.length);
    target.current = next;
    setSelected(next);
    return next;
  };
  const select = (index) => { move(updateSelection(index)); };
  const fromPointer = (clientX) => { const rect = track.current.getBoundingClientRect(); return sliderPosition(clientX - rect.left, rect.width, items.length); };
  const start = (event) => {
    if (event.button !== 0) return;
    drag.current = { start: event.clientX, value: position, moved: false };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const dragMove = (event) => {
    if (!drag.current) return;
    if (Math.abs(event.clientX - drag.current.start) > 3) drag.current.moved = true;
    if (drag.current.moved) {
      drag.current.value = fromPointer(event.clientX);
      updateSelection(drag.current.value);
      move(drag.current.value, true);
    }
  };
  const finish = (event) => {
    if (!drag.current) return;
    const index = drag.current.moved ? snapSlide(drag.current.value, items.length) : snapSlide(fromPointer(event.clientX), items.length);
    drag.current = null; select(index); buttons.current[index]?.focus({ preventScroll: true });
  };
  const cancel = () => { if (drag.current) { drag.current = null; select(active); } };
  const keyboard = (event) => {
    const index = { ArrowLeft: target.current - 1, ArrowRight: target.current + 1, Home: 0, End: items.length - 1 }[event.key];
    if (index === undefined) return;
    event.preventDefault(); const next = snapSlide(index, items.length); select(next); buttons.current[next]?.focus();
  };
  return <section className="viewer slider-viewer" data-theme={theme} aria-label="Slider image viewer">
    <div className="slider-stage">
      {!items.length && <ImageFrame />}
      {items.map((item, index) => {
        const distance = index - position;
        return <button key={item.id} className="slider-card" aria-label={`Enlarge image ${index + 1}`} tabIndex={index === active ? 0 : -1} onClick={(event) => setDetail({ item, origin: imageBounds(event.currentTarget) })} style={{
          left: `calc(50% + ${distance} * var(--slide-step))`, zIndex: Math.round(100 - Math.abs(distance) * 10), transform: `translate(-50%, -50%) scale(${1 - Math.min(Math.abs(distance), 1) * .12}) ${reduced ? '' : `rotateY(${clamp(distance * -8, -12, 12)}deg)`}`,
          visibility: Math.abs(distance) < 1.8 ? 'visible' : 'hidden', pointerEvents: index === active ? 'auto' : 'none',
        }}><ImageFrame item={item} /></button>;
      })}
    </div>
    <Caption item={items[active]} />
    {!!items.length && <GlassPanel className="linear-dock chips-dock"><div className="chip-track" ref={track} role="group" aria-label="Choose image" onPointerDown={start} onPointerMove={dragMove} onPointerUp={finish} onPointerCancel={cancel} onLostPointerCapture={cancel} onPointerLeave={() => setHovered(null)} onKeyDown={keyboard}>
      {items.map((item, index) => <button key={item.id} ref={(el) => { buttons.current[index] = el; }} className={`chip-target ${index === active ? 'is-active' : ''} ${hovered !== null && Math.abs(hovered - index) === 1 ? 'is-neighbor' : ''}`} aria-label={`Show image ${index + 1}`} aria-pressed={index === active} tabIndex={index === active ? 0 : -1} onPointerEnter={() => setHovered(index)} onClick={(event) => { if (event.detail === 0) select(index); }}>
        <span className="chip" />
      </button>)}
      <span className="chip-indicator" style={{ width: `${100 / items.length}%`, left: `${position / items.length * 100}%` }} />
    </div></GlassPanel>}
    {detail && <Lightbox item={detail.item} origin={detail.origin} theme={theme} onClose={() => setDetail(null)} />}
  </section>;
}
