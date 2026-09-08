// Actual painted bounds of an object-fit: contain image, excluding letterboxing.
export function imageBounds(element) {
  const image = element?.matches?.('img') ? element : element?.querySelector('img');
  if (!image) return null;
  const box = image.getBoundingClientRect();
  const ratio = (image.naturalWidth || image.width) / (image.naturalHeight || image.height);
  if (!ratio || !box.width || !box.height) return null;
  const width = Math.min(box.width, box.height * ratio);
  const height = width / ratio;
  return { left: box.left + (box.width - width) / 2, top: box.top + (box.height - height) / 2, width, height };
}
export function imageTransform(from, to) {
  if (!from || !to) return 'scale(.96)';
  return `translate(${from.left + from.width / 2 - to.left - to.width / 2}px, ${from.top + from.height / 2 - to.top - to.height / 2}px) scale(${from.width / to.width}, ${from.height / to.height})`;
}
