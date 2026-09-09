# Canvas Studio — Product Overview

Canvas Studio presents UI designs and posters in three interactive viewing modes. See the root README for embedding and image configuration, and VALIDATION.md for acceptance evidence.

| Component | Content | Navigation | Context |
| --- | --- | --- | --- |
| CanvasViewer | Multiple images, configurable columns | 2D dot map, hover and lock | Optional focused-image caption |
| PanoramaViewer | One wide image | Continuous finite scrollbar | Caption below the image |
| SliderViewer | Multiple images | Chips, continuous dragging and snapping | Selected-image caption |

The viewers share ImageFrame, GlassPanel, Caption and Lightbox in `src/components/Shared.jsx`, time-based damping and reduced-motion detection in `src/hooks/useMotion.js`, and scoped presentation styles in `src/viewers.css`. Position math is separated into `src/lib/navigation.js`.

Each viewer has a transparent background and accepts `theme="light"` or `theme="dark"`. Theme controls belong to the demo host only. The application runs entirely in the browser and uses local example assets.

Technology: React/React DOM 19.2.6, Vite 8.0.16, @vitejs/plugin-react 6.0.2, JavaScript/JSX, CSS transforms and backdrop-filter, requestAnimationFrame, ResizeObserver, Pointer Events, native scrolling and dialog, Web Animations for captions, Node's built-in test runner and ESLint. React and React DOM are the only runtime dependencies.
