# T08 — Transitions and alternate layout (optional)

Issue: [#12](https://github.com/knthslai/tmdb-movie-grid/issues/12)

Only start this if T01–T06 and T09 are done inside the time budget.

## Background

- Tailwind: `transition`, `duration-200`, `ease-out`, and `motion-reduce:transition-none` respect the reduced-motion setting.
- Animate `opacity` and `transform`; they're cheap. Avoid animating `height`.
- A grid/list toggle is one more piece of URL state, like T06.

## Steps

1. Add hover/focus transitions to the card's overview reveal.
2. Add a layout toggle (`?layout=list`) that switches the grid classes.
3. Turn on "Reduce motion" in macOS settings and check that transitions stop.
