# Canvas Studio

A portfolio image viewer for UI studies, posters, and visual case studies. Built with React 19 and Vite 8, with Canvas, Panorama, and Slider modes, responsive layouts, and light/dark glass surfaces.

## Run locally

```bash
npm ci
npm run dev
```

Open http://127.0.0.1:5173. Use the three experiment tabs to compare the viewers. The background swatch switches between white/light gray or black/dark gray; the theme button is a demo-only preview control. Themes do not follow operating system preferences.

```bash
npm test
npm run lint
npm run build
npm run preview
```

Validated with Node 24.20.0. `npm run build` produces a static site in `dist/`.

## Add your work

Put image files in `public/` and edit `src/demoData.js`. The included SVG studies and posters are layout samples. Canvas starts with nine images; larger demo layouts repeat samples to exercise navigation.

```js
const image = {
  id: 'checkout-flow',
  src: '/work/checkout-flow.webp',
  width: 4200,
  height: 780,
  alt: 'Checkout flow from product selection to confirmation',
  title: 'A simpler checkout',       // optional
  description: 'From selection to confirmation.', // optional, keep short
};
```

IDs must be unique within a viewer. Use correct source dimensions. Images preserve their aspect ratio; supporting text is rendered separately.

## Embed a viewer

Import the viewer and its stylesheet into a React host. Give the parent the actual case-study background. Set `theme` per instance; the component itself remains transparent.

```jsx
import { CanvasViewer } from './src/components/CanvasViewer';
import { PanoramaViewer } from './src/components/PanoramaViewer';
import { SliderViewer } from './src/components/SliderViewer';
import './src/viewers.css';

<CanvasViewer items={images} columns={3} theme="light" />
<PanoramaViewer item={wideWorkflow} theme="dark" />
<SliderViewer items={images} theme="light" />
```

Theme defaults to `light`. Canvas defaults to three columns. Change the React `key` when replacing the collection or its layout to start a new browsing session. Host styles can override `.viewer` height; allow enough height for a tall dot map. Demo controls and page styles are separate from `viewers.css`.

### Canvas

- Hover dots to focus an image. Click once to lock; click the locked dot again to unlock.
- Arrow keys move through the map; Home/End reach its endpoints; Enter/Space toggle locking. Deliberate keyboard navigation moves an existing lock with the selection.
- Canvas begins with an unselected 3 × 3 overview. Select an image to focus it and show its optional caption; click the focused image to enlarge it. Escape returns to the overview.

### Panorama

- A single image scrolls continuously with finite bounds. It never changes images or snaps to pages.
- Use a horizontal trackpad gesture, a normal vertical wheel over the image, or the glass scrollbar. Vertical wheel input returns to the host page at the endpoints.
- Dragging the thumb is immediate; clicking the track moves smoothly. The thumb reflects the visible fraction of the image and recalculates on resize.
- Focus the scrollbar and use Left/Right, Page Up/Down or Home/End. Fitting images disable the scrollbar.

### Slider

- Drag across chips to move continuously. Release to snap to the nearest image; click a chip to select it.
- Hover only changes the control's appearance. Left/Right and Home/End navigate without wrapping.
- Only the selected image has a caption. Slider text updates immediately on selection and follows the nearest image while dragging, using a short crossfade in a reserved region. The glass indicator moves over persistent chip tracks.

Click a Canvas or Slider image to open a native modal dialog with a source-position zoom transition. Panorama is browse-only and has no enlargement action. Escape or the close button returns to the same position and restores focus. There are no next/previous controls in the modal; Panorama images remain horizontally scrollable in their inline viewport. Reduced-motion preferences disable spatial tilts, dot repulsion and animated positioning.

## Validation

`tests/navigation.test.js` covers scroll mapping, fitting images, chip centers, snapping and rectangular grid bounds. `tests/viewers.html` is a development-only acceptance fixture, omitted from the production build entry. Parameters include `mode=canvas|panorama|slider`, `case=empty|single|broken|mixed|fit`, `theme=light|dark`, and `motion=reduced`. The reduced-motion fixture substitutes matchMedia for that test page only.

See [acceptance results](docs/VALIDATION.md). Native-device gesture testing and integration into an existing portfolio page remain follow-up work.

## Responsive portfolio frames

All three viewers include a subtle rounded frame and size their image stage from the available container width, rather than the browser height. They can be embedded directly in a case-study column without a full-screen wrapper. The frame remains transparent and inherits the selected light/dark material tokens.

The responsive ranges follow the current YYP `src/styles/case-study.css`: desktop above 877px, tablet 561–877px, and mobile up to 560px. Viewer rules use container queries, so a narrow desktop column receives the same treatment as a small screen.

- Desktop: large images, restrained spatial depth, bounded adjacent previews.
- Tablet: images occupy 88% of the stage; wider slide separation prevents overlap.
- Mobile: images occupy 94% of the stage, with a full-width slide step and no perspective projection. Slider order stays left to right and its control stays horizontal. Captions wrap naturally above the control; touch targets are taller.
- Canvas retains its two-dimensional map. Panorama retains a horizontally scrollable image at a readable fixed mobile height. All navigation remains inside each frame.

A full desktop UI screenshot still contains small text on a phone. For detailed reading, provide mobile-specific artwork or focused crops; Canvas and Slider also retain image enlargement.

Development-only viewport review: `/tests/responsive.html` provides 1440px, 768px, and 390px iframe previews with layout measurements and mode switches. It is not included in the production build.

## Canvas overview and focus

Canvas defaults to a 3 × 3 overview with no selected image. All nine images are visible and selectable. Selecting an image locks its focus; selecting its map dot again or pressing Escape returns to the overview. Hovering a map dot previews focus until the pointer leaves the map, unless a selection is locked. A focused image can still open the detail view.

The context area reserves space below the images for optional titles and descriptions. The glass map straddles the bottom edge of the Canvas frame; keep the component's bottom margin when embedding it so the floating control clears the next section.

## Poster-aware Canvas layout

The gallery is centered in the entire glass frame, with equal context space above and below. Its cell proportions follow the median artwork aspect ratio; each image fits inside its cell without cropping. Gaps scale with container size, and the gallery remains a centered three-row composition for nine images.

The demo's artwork selector offers UI studies, portrait Posters, and Mixed artwork. These are temporary local layout samples; the production viewer uses each item's `width` and `height` metadata. Focus and detail preserve the selected artwork's aspect ratio.
