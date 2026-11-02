# T05 — Responsive grid and page states

Issue: [#6](https://github.com/knthslai/tmdb-movie-grid/issues/6) · Files: `src/components/MovieGrid.tsx`, `src/App.tsx`

## Background

- `grid-template-columns: repeat(auto-fill, minmax(12rem, 1fr))` gives as many columns as fit, with no media queries. In Tailwind: an arbitrary value like `grid-cols-[repeat(auto-fill,minmax(12rem,1fr))]`.
- `auto-fill` keeps empty tracks; `auto-fit` collapses them, so a few cards stretch wider. [MDN: repeat()](https://developer.mozilla.org/en-US/docs/Web/CSS/repeat).
- The hook from T03 gives `isPending`, `isError`, `error`, `refetch`, and `data`.

## Steps

1. **Grid component.** Takes a list of movies and renders `MovieCard`s, keyed by `movie.id`. Question: why not key by index?
2. **Wire it up.** In `App.tsx`, call the hook and pass `data.results` to the grid.
3. **States, in this order:** loading, error with a Retry button that calls `refetch`, empty ("No movies match"), success. Checkpoint: force each state. Use a bad key for error, a filter with no results for empty, and DevTools network throttling for loading.
4. **Resize.** Drag the window from phone width to wide. Count the columns.

## Decisions I make

- Spinner, text, or skeleton cards for loading?
- When refetching with old data on screen (`isFetching`), show anything?
