export const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
export function gridPosition(index, columns) {
  return { x: index % columns, y: Math.floor(index / columns) };
}
export function gridStep(index, key, columns, count) {
  if (!count) return 0;
  const steps = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -columns, ArrowDown: columns };
  return clamp(key === 'Home' ? 0 : key === 'End' ? count - 1 : index + (steps[key] || 0), 0, count - 1);
}
export function scrollMetrics(viewport, content) {
  return { max: Math.max(0, content - viewport), ratio: content > 0 ? Math.min(1, viewport / content) : 1 };
}
export function trackToScroll(pointer, track, thumb, max) {
  return track > thumb ? clamp(pointer / (track - thumb), 0, 1) * max : 0;
}
export function sliderPosition(pointer, width, count) {
  return width > 0 ? clamp(pointer / width * count - 0.5, 0, Math.max(0, count - 1)) : 0;
}
export function snapSlide(position, count) {
  return clamp(Math.round(position), 0, Math.max(0, count - 1));
}
