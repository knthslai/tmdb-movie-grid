# T11 — Load tests for the core features

Files: `src/App.test.tsx` · Run: `npm test`

## Goal

Prove the page loads as expected without a network or an API key. The tests render the whole `<App />` in jsdom with React Testing Library and replace the three TMDB calls in `src/api/tmdb.ts` (`discoverMovies`, `searchMovies`, `fetchGenres`) with fakes. Everything else (query hooks, URL state, client sort, components) is the real code.

## Cases

1. **First load.** "Loading…" shows, then the New releases row (newest first), the genre chips and a grid of cards.
2. **Genre filter.** Clicking a genre refetches discover with that genre and puts `?genres=` in the URL.
3. **Sort.** Clicking "Top rated" refetches with `vote_average.desc` and puts `?sort=` in the URL.
4. **Title search.** Typing a title sends one search request after the debounce, the grid shows the results and the URL gets `?q=`.
5. **Search with a genre.** Search results are filtered by the selected genre on the client.
6. **No results.** A search with no matches shows "No movies found for “…”."
7. **Shared link.** Opening `/?q=alien&genres=27` loads that search and genre straight away.
8. **Error and retry.** A failed request shows the error and a Retry button; Retry loads the grid.

## Setup notes

- `// @vitest-environment jsdom` at the top of the file, so the pure-logic tests keep running in Node.
- A fresh `QueryClient` per test with `retry: false`, so errors show at once and no cache leaks between tests.
- jsdom has no `matchMedia`, so the tests stub it. The row's auto-scroll still runs; cleanup cancels its animation frame.
- Reset the URL before each test: the view state is read from `window.location`.
