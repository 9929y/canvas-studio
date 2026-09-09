import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { imageBounds, imageTransform } from '../lib/imageGeometry';
import { useReducedMotion } from '../hooks/useMotion';
export function ImageFrame({ item, className = '', ...props }) {
  const [failedSrc, setFailedSrc] = useState(null);
  if (!item) return <div className="media-state" role="status">No images yet</div>;
  if (failedSrc === item.src) return <div className="media-state" role="status">Image unavailable</div>;
  return <img className={`study-image ${className}`} src={item.src} width={item.width} height={item.height} alt={item.alt} draggable="false" onError={() => setFailedSrc(item.src)} {...props} />;
}
export function GlassPanel({ children, className = '', ...props }) {
  return <div className={`glass-panel ${className}`} {...props}>{children}</div>;
}
export function Caption({ item }) {
  const ref = useRef(null);
  const previous = useRef(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const old = previous.current;
    previous.current = node.firstElementChild.cloneNode(true);
    if (!old || reduced) return;
    old.setAttribute('aria-hidden', 'true');
    node.appendChild(old);
    const outgoing = old.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 180, fill: 'forwards' });
    const incoming = node.firstElementChild.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 220 });
    outgoing.onfinish = () => old.remove();
    return () => { outgoing.cancel(); incoming.cancel(); old.remove(); };
  }, [item?.id, reduced]);
  return <div className="caption" ref={ref} aria-live="polite"><div><h2>{item?.title || ''}</h2><p>{item?.description || ''}</p></div></div>;
}
export function Lightbox({ item, origin, theme = 'light', showCaption = true, onClose }) {
  const ref = useRef(null), mediaRef = useRef(null), animation = useRef(null), closing = useRef(false);
  const [isClosing, setIsClosing] = useState(false);
  const reduced = useReducedMotion();
  useLayoutEffect(() => {
    const previous = document.activeElement;
    const dialog = ref.current;
    dialog.showModal();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const image = mediaRef.current.querySelector('img');
    if (image && !reduced) {
      animation.current = image.animate([
        { transform: imageTransform(origin, imageBounds(image)) },
        { transform: 'translate(0, 0) scale(1)' },
      ], { duration: 420, easing: 'cubic-bezier(.22, 1, .36, 1)' });
    }
    return () => { animation.current?.cancel(); document.body.style.overflow = overflow; dialog.close(); previous?.focus({ preventScroll: true }); };
  }, [origin, reduced]);
  const close = () => {
    if (closing.current) return;
    closing.current = true;
    if (reduced) { onClose(); return; }
    setIsClosing(true);
    const image = mediaRef.current.querySelector('img');
    const currentTransform = image ? getComputedStyle(image).transform : 'none';
    animation.current?.cancel();
    // Keep the dialog mounted until the return motion and backdrop fade finish.
    const target = image || ref.current;
    animation.current = target.animate([
      { transform: currentTransform, opacity: 1 },
      { transform: imageTransform(origin, imageBounds(image)), opacity: .25 },
    ], { duration: 280, easing: 'cubic-bezier(.4, 0, .2, 1)', fill: 'forwards' });
    animation.current.onfinish = onClose;
  };
  return <dialog className={`lightbox ${isClosing ? 'is-closing' : ''}`} data-theme={theme} ref={ref} onCancel={(e) => { e.preventDefault(); close(); }} aria-label="Image detail">
    <button className="close-view" onClick={close} autoFocus aria-label="Close image">✕</button>
    <div ref={mediaRef} className="lightbox-media"><ImageFrame item={item} /></div>
    {showCaption && <Caption item={item} />}
  </dialog>;
}
