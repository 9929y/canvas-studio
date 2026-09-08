import React from 'react';
import { createRoot } from 'react-dom/client';
import { CanvasViewer } from '../src/components/CanvasViewer';
import { PanoramaViewer } from '../src/components/PanoramaViewer';
import { SliderViewer } from '../src/components/SliderViewer';
import { studies, workflow } from '../src/demoData';
import '../src/index.css';

// A content-only capture surface. Each frame is exactly 1440 CSS pixels wide.
createRoot(document.getElementById('root')).render(<React.StrictMode>
  {['canvas', 'panorama', 'slider'].flatMap(mode => ['light', 'dark'].map(theme =>
    <div key={`${mode}-${theme}`} data-export={`${mode}-${theme}`} style={{ width: 1440, padding: '48px', background: theme === 'light' ? '#f3f3f0' : '#151615' }}>
      {mode === 'canvas' ? <CanvasViewer columns={3} items={studies.slice(0, 9)} theme={theme} /> : mode === 'panorama' ? <PanoramaViewer item={workflow} theme={theme} /> : <SliderViewer items={studies.slice(0, 6)} theme={theme} />}
    </div>
  ))}
</React.StrictMode>);

// Rasterize SVG artwork in the browser so Figma preserves locally rendered fonts.
setTimeout(async () => {
  await Promise.all([...document.images].map(async image => {
    await image.decode();
    const canvas = document.createElement('canvas');
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    canvas.getContext('2d').drawImage(image, 0, 0);
    image.src = canvas.toDataURL('image/png');
    await image.decode();
  }));
}, 300);
