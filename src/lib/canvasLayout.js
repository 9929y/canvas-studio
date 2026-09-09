// Keep a compact gallery centered independently of the artwork aspect ratios.
export function canvasOverview(items, columns, width, height) {
  const cols = Math.max(1, columns);
  const rows = Math.max(1, Math.ceil(items.length / cols));
  const ratios = items.map(item => item.width > 0 && item.height > 0 ? item.width / item.height : 1).sort((a, b) => a - b);
  const ratio = Math.max(.7, Math.min(1.6, ratios[Math.floor(ratios.length / 2)] || 1));
  const gap = Math.min(24, width * .025, height * .04);
  const cellHeight = Math.max(1, Math.min((height * .88 - gap * (rows - 1)) / rows, (width * .88 - gap * (cols - 1)) / cols / ratio));
  const cellWidth = cellHeight * ratio;
  const gridWidth = cols * cellWidth + (cols - 1) * gap;
  const gridHeight = rows * cellHeight + (rows - 1) * gap;
  return items.map((item, index) => {
    const aspect = item.width > 0 && item.height > 0 ? item.width / item.height : 1;
    const h = Math.min(cellHeight, cellWidth / aspect);
    return {
      x: (width - gridWidth) / 2 + (index % cols) * (cellWidth + gap) + cellWidth / 2,
      y: (height - gridHeight) / 2 + Math.floor(index / cols) * (cellHeight + gap) + cellHeight / 2,
      width: h * aspect, height: h,
    };
  });
}
