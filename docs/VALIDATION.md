# Acceptance Results

Date: 2026-09-08. Browser: Codex in-app Chromium. Sources: local running Vite app and development-only fixture page. The example art is temporary; final artwork still needs content-specific visual review.

| Requirement | Evidence |
| --- | --- |
| 3×12, 3×6, 4×6 navigation | Browser confirms 36/18/24 dots; End reaches image 36/18/24. Node tests cover Home/End and clamped vertical bounds. |
| Hover and lock | Pointer traversed from outside the map to the final dot: selection remained image 1 while locked; after unlocking, the same gesture selected image 36. |
| Canvas single-image detail | Browser opened image 1, closed with Escape, confirmed dialog removal and retained selection. Canvas detail has no caption. |
| Continuous long image | Browser wheel moved the viewport to 720px without scrolling the page; End reached 751px, exactly its measured maximum. |
| Scrollbar synchronization | Browser confirmed aria position equals scrollLeft. Dragging the thumb from right to left returned to zero. |
| Scroll boundary handoff | At the 751px maximum, a further downward wheel gesture moved the parent page to 411px and left the image at 751px. |
| Long-image detail return | Opened and closed detail at the right endpoint; original viewport remained at 751px. |
| Resize | Panorama fixture at 1024×768 measured a 984px viewport and 2089px content (47.1039% thumb); at 1440×900 it measured 1080px and 2800px (38.5714% thumb). |
| Fitting image | Portrait fixture measured 204×340 at natural ratio 600:1000; no overflow and scrollbar disabled. |
| Slider selection | Clicking chip 4 selected image 4 and its corresponding caption. |
| Slider drag / bounds | Dragging from chip 4 across to chip 6 selected image 6; indicator reached 83.3333%. Right arrow at the last image did not wrap. |
| Empty/single/error | All three fixtures rendered empty and missing-image states. Canvas and Slider single-image fixtures rendered one control. |
| Mixed aspect ratios | Portrait, landscape and wide image fixtures retained native dimensions and object-fit: contain. |
| Reduced motion | Fixture enabled the system-query result. Canvas and Slider transforms contained no rotation; direct selection immediately reached the requested index. |
| Theme materials | Browser checked light gray, white, dark gray and black host backgrounds. Shared glass uses translucent fills; images retain their original color. |
| Local assets | Original SVG fixtures have no remote resources; production app no longer includes templates, backend APIs or iframes. |

Automated checks: `npm test`, `npm run lint`, `npm run build`. Browser console was checked for unexpected errors during normal demo operation. Missing-image fixtures deliberately produce failed asset requests.

Fixture URLs are development tooling, not production routes. A reduced-motion test shim applies only on the fixture page and does not change the user's settings. Native mobile gestures and actual case-study page integration are intentionally deferred.

## Slim controls refinement

Slider and Panorama docks now measure 34px high (previously 48px), with 8px horizontal padding (previously 20px). Chips are 6px high and use soft hover shadows instead of vertical scaling or a hard outline. The Canvas dot dock also uses tighter side padding and a lighter shadow. Panorama uses translucent directional highlights and a 12px glass thumb; source inspiration: https://developer.apple.com/design/human-interface-guidelines/materials . This is a CSS material interpretation, not Apple's native Liquid Glass implementation.

Browser checks confirmed the new dimensions, light/dark appearance, chip selection, and Panorama dragging to its measured 718px endpoint. Lint and production build passed.


## Image interaction refinement

Canvas and Slider now share the same responsive image stage and 960px maximum card width. A tall Canvas dot map may extend the host page to preserve image readability. Slider captions reserve 62px rather than 88px and the control gap is 2px rather than 18px. Panorama is now browse-only: the former enlargement test above describes the earlier version and is superseded.

Detail opening animates from the painted source-image bounds over 420ms; closing returns over 280ms before unmounting and restoring focus. Reduced motion skips the geometry animation. Image hover is a 2px lift with a soft shadow, without controls or visual overlays. Geometry tests cover letterboxing and center/scale mapping.

## Slider selection synchronization

Slider captions and accessibility selection now update when a selection is requested, independently of the image animation completion. Dragging updates selection to the nearest image continuously. Base chip tracks stay visible beneath the moving glass indicator, including the selected track.

Browser verification: clicking image 4 immediately showed its caption while the indicator was still at 48.4494% (before its 50% destination). ArrowRight immediately selected image 5 and its caption during motion. All six base chips retained nonzero opacity in both checks. Lint, all five unit tests, and the production build passed.

## Bounded responsive portfolio viewers

Verified all three modes at iframe viewports 1440px, 768px, and 390px using `/tests/responsive.html`. In all nine combinations, document width matched viewport width and the navigation remained inside the frame. Slider and Panorama captions ended above their navigation. Slider frame heights were 746.5px, 562.94px, and 414.11px respectively; mobile captions grew to 74.59px to accommodate wrapping. Canvas and Slider use identical stage sizing in each range. The earlier viewport-height sizing behavior is superseded.

Visually inspected the mobile Slider and the live 657px-wide preview. Adjacent images no longer cover the selected image; its stacking order now follows distance from the center. These checks validate browser layout, not native-device gestures or final artwork readability.

## Canvas glass surface

Canvas now adds restrained blue, sage, and warm radial color washes, a translucent surface with backdrop blur, inner edge highlights, lower inset shading, and a soft outer shadow. Dark mode uses lower-intensity color washes and a dimmer rim. The decorative inset edge ignores pointer events; no color or blur filters are applied to the artwork. Browser screenshots were reviewed in both themes at 1072px viewport width. Production build and whitespace checks passed.

## Nine-image Canvas overview

The default demo now starts with a 3 × 3 grid and no active image. Browser checks confirmed nine cards, all within the stage bounds, and a map that crosses the bottom frame edge. Clicking image 5 entered focus and displayed its caption; Escape returned to overview. The image-to-map context area is reserved in both states. Light and dark Figma Canvas frames were updated in place, preserving the other four viewers and retaining the user-added caption hidden for the unselected state. Lint, five unit tests, and production build passed.

## Centered poster-aware app layout

The live app now balances top and bottom context space, centering the gallery against the complete Canvas frame. At the inspected browser width, the nine-poster bounding-box center differed from the Canvas center by less than 0.004px on each axis. Browser review covered Posters, Mixed artwork, poster focus with its matching caption, and Escape back to overview. Two new geometry tests verify bounds and aspect ratios at desktop/tablet/mobile stage sizes and non-overlap for mixed artwork. All seven tests, lint, and production build passed. This refinement changes the running app; the earlier Figma snapshots are not updated in this pass.
