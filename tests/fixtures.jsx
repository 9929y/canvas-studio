import React from 'react';
import { createRoot } from 'react-dom/client';
import { CanvasViewer } from '../src/components/CanvasViewer';
import { PanoramaViewer } from '../src/components/PanoramaViewer';
import { SliderViewer } from '../src/components/SliderViewer';
import { studies, workflow } from '../src/demoData';
import '../src/index.css';
const params = new URLSearchParams(location.search);
if (params.get('motion') === 'reduced') {
  const original = window.matchMedia.bind(window);
  window.matchMedia = (query) => query === '(prefers-reduced-motion: reduce)' ? { matches: true, addEventListener() {}, removeEventListener() {} } : original(query);
}
const scenario = params.get('case');
const theme = params.get('theme') || 'light';
const broken = { ...studies[0], id: 'broken', src: '/demo/does-not-exist.png' };
const portrait = { ...studies[0], id: 'portrait', src: '/demo/portrait.svg', width: 600, height: 1000, title: 'Portrait study' };
const items = scenario === 'empty' ? [] : scenario === 'single' ? [studies[0]] : scenario === 'broken' ? [broken] : scenario === 'mixed' ? [portrait, studies[0], workflow] : studies;
const item = scenario === 'empty' ? undefined : scenario === 'fit' ? portrait : scenario === 'broken' ? broken : workflow;
const mode = params.get('mode') || 'canvas';
createRoot(document.getElementById('root')).render(<React.StrictMode><main style={{ background: theme === 'dark' ? '#000' : '#fff', padding: 20 }}>
  {mode === 'canvas' ? <CanvasViewer items={items} theme={theme} /> : mode === 'panorama' ? <PanoramaViewer item={item} theme={theme} /> : <SliderViewer items={items} theme={theme} />}
  <p>Page scroll continuation fixture</p><div style={{ height: 500 }} />
</main></React.StrictMode>);
