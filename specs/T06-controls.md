# T06 — Filter and sort controls, state in the URL

Issue: [#7](https://github.com/knthslai/tmdb-movie-grid/issues/7) · Files: `src/components/Controls.tsx`, `src/lib/sortMovies.ts`

## Why it matters

This is the "assessed behavior" most likely to be extended live: a new filter, a sort direction, a reset button. A growth team links to filtered views, so URL state is worth explaining.

## Background

- Reading: `new URLSearchParams(window.location.search)`.
- Writing: `history.replaceState` (no new history entry) or `history.pushState` (Back undoes it). Listen to `popstate` if Back should update the UI.
- No router is installed. Options: a small custom hook with `useState` + `history`, or `useSyncExternalStore` subscribed to `popstate`.
- `Array.prototype.toSorted` returns a new array (ES2023, already in `tsconfig.app.json` `lib`). `sort` mutates in place, which would mutate cached query data.
- Sorting strings: `a.localeCompare(b)`. Sorting dates: ISO strings compare correctly as strings, but `""` needs handling.

## Steps

1. **Sort function** in `src/lib/sortMovies.ts`: takes movies and a sort option, returns a new array. Pure, no React. Checkpoint: call it from the console or a quick test.
2. **URL state.** Read the filter and sort from the URL on load, with defaults when missing or invalid. Write back on change. Checkpoint: reload the page, and the controls keep their values.
3. **Controls component.** A `<select>` (or buttons) for the filter and for the sort, with `<label>`s. Controlled by the URL state.
4. **Wire it up.** The filter goes into the hook params (server). The sort is applied to `data.results` (client), unless T01 chose a server sort.
5. **Back button.** Change the filter twice, then press Back. Decide whether that should work, and make it so.

## Edge cases

- `?genre=banana` in the URL: fall back to the default.
- Ties in the sort: is the order stable?
- Movies with no rating or no release date: first or last?

## Decisions I make

- `replaceState` or `pushState`?
- What is derived state here? (The sorted list should be derived, not stored.)
