# Drills (D1–D7)

Issues: [label:drill](https://github.com/knthslai/tmdb-movie-grid/issues?q=is%3Aissue+label%3Adrill)

Practice for the live extension. AI is off during the drill: close the agent panel and don't use edit predictions. Docs are allowed. Each drill is timeboxed to 20 minutes on a throwaway branch (`git switch -c drill/d1`).

Claude's role in drills is **before and after only**:
- **Before:** ask me the "answer before coding" questions on the issue, one at a time, and tell me if my plan has a gap. No solutions.
- **After:** review my diff with questions, and quiz me on why it works. Note weak spots as new Human cards.

## D1 — Load more / pagination

- TMDB `page` param, 1–500. `total_pages` is in the response.
- Two shapes: replace the page (`page` state in the query key) or append (`useInfiniteQuery` with `getNextPageParam`).
- Gotcha: reset to page 1 when the filter changes.

## D2 — Debounced title search

- `/search/movie?query=...` ignores discover filters and sorts.
- Debounce: `setTimeout` in an effect, cleared on the next change. Or a `useDebouncedValue` hook.
- Gotcha: an empty query should go back to discover, not search for `""`.

## D3 — Second filter combined with the first

- Touches: params type → genre/param mapping → URL state → controls → query key → a new test.
- Practice saying the order out loud before touching code.

## D4 — Favourites in localStorage

- State: a `Set` of ids, or an array. Persist with `JSON.stringify`.
- Wrap `localStorage` access in `try/catch` (private mode and quota errors).
- "Favourites only" view: derived from loaded results, or fetched by id?

## D5 — Details modal

- `/movie/{id}` returns runtime, genres (names), tagline, and more.
- The native `<dialog>` element with `showModal()` handles Escape and focus trapping.
- Separate query key: `['movie', id]`.

## D6 — Failure modes and growth

- No key, bad key, offline, and slow 3G with fast filter changes.
- "10,000 results": pagination, virtualization, server-side sort, caching.

## D7 — Walkthrough rehearsal

- Ten minutes out loud: architecture, one decision, one bug, one suggestion, one extension.
- Record a voice memo and listen back once.
