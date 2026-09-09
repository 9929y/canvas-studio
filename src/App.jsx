import { useState } from 'react';
import { CanvasViewer } from './components/CanvasViewer';
import { PanoramaViewer } from './components/PanoramaViewer';
import { SliderViewer } from './components/SliderViewer';
import { studies, posterStudies, workflow } from './demoData';
const modes = ['canvas', 'panorama', 'slider'];
const backgrounds = { light: ['#ffffff', '#f3f3f0'], dark: ['#000000', '#151615'] };
export default function App() {
  const [mode, setMode] = useState('canvas');
  const [theme, setTheme] = useState('light');
  const [background, setBackground] = useState(1);
  const [artwork, setArtwork] = useState('ui');
  const [layout, setLayout] = useState('3x3');
  const [columns, rows] = layout.split('x').map(Number);
  return <main className={`demo-shell theme-${theme}`} style={{ backgroundColor: backgrounds[theme][background] }}>
    <header className="demo-header"><span className="wordmark">canvas<span> / studies</span></span><span className="edition">INTERACTION EXPLORATIONS — 01</span></header>
    <div className="demo-toolbar"><nav aria-label="Experiments">{modes.map((name, i) => <button key={name} className={`demo-tab ${mode === name ? 'active' : ''}`} aria-pressed={mode === name} onClick={() => setMode(name)}>{`0${i + 1}`} <span>{name[0].toUpperCase() + name.slice(1)}</span></button>)}</nav>
      <div className="demo-options">{mode === 'canvas' && <select aria-label="Artwork layout preview" value={artwork} onChange={event => setArtwork(event.target.value)}><option value="ui">UI studies</option><option value="posters">Posters</option><option value="mixed">Mixed</option></select>}
        {mode === 'canvas' && <select aria-label="Canvas layout" value={layout} onChange={(event) => setLayout(event.target.value)}><option value="3x3">3 × 3</option><option value="3x12">3 × 12</option><option value="3x6">3 × 6</option><option value="4x6">4 × 6</option></select>}
        <button className="background-toggle" aria-label="Toggle solid preview background" onClick={() => setBackground(1 - background)}><span style={{ background: backgrounds[theme][1 - background] }} /></button>
        <button className="theme-toggle" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} aria-label="Toggle preview theme">{theme === 'light' ? '◐' : '◑'} <span>{theme === 'light' ? 'Light' : 'Dark'}</span></button>
      </div>
    </div>
    {mode === 'canvas' && <CanvasViewer key={`${layout}-${artwork}`} items={(artwork === 'ui' ? studies : artwork === 'posters' ? posterStudies : studies.map((item, i) => i % 2 ? posterStudies[i] : item)).slice(0, columns * rows)} columns={columns} theme={theme} />}
    {mode === 'panorama' && <PanoramaViewer item={workflow} theme={theme} />}
    {mode === 'slider' && <SliderViewer items={studies.slice(0, 6)} theme={theme} />}
    <footer className="demo-footer"><span>SPATIAL STUDIES</span><span>{mode === 'canvas' ? 'Select to focus · Escape for overview' : mode === 'panorama' ? 'Scroll to explore · Drag to move' : 'Drag to explore · Release to settle'}</span><span>0{modes.indexOf(mode) + 1} / 03</span></footer>
  </main>;
}
