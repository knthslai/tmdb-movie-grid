# Discover movies

![The app after `npm start`, sorted by Top rated: the title search top left, the New releases row, the genre chips and sort on one line, and the centered movie grid](docs/screenshot.png)

A small React app that fetches movies from TMDB's `/discover/movie` endpoint and shows them as a grid of cards, with genre filters, a sort, title search (`/search/movie`) and a New releases row.

## Run it

```bash
cp .env.example .env.local   # paste the TMDB v3 API key from the assignment email
npm i
npm start                    # opens http://localhost:5173
```

Other scripts: `npm test`, `npm run typecheck`, `npm run lint`, `npm run build`.

### Adding a feature

`npm run gen -- <kind> <name>` writes the boilerplate for a new piece, in the same shape as the existing code. Each generated file typechecks, lints and passes its test as-is, with `TODO(gen)` markers where the real logic goes (`npm run todo` lists them). It never overwrites anything.

| Command | Writes |
|---|---|
| `npm run gen -- api movie-details` | `MovieDetailsParams`, `toMovieDetailsParams` and `fetchMovieDetails` appended to `src/api/tmdb.ts`, plus `src/api/movieDetails.test.ts` |
| `npm run gen -- hook movie-details` | `src/api/useMovieDetails.ts`, a TanStack Query hook for that fetcher |
| `npm run gen -- feature movie-details` | both of the above |
| `npm run gen -- component MovieDetails` | `src/components/MovieDetails.tsx` |
| `npm run gen -- lib rank-by-votes` | `src/lib/rankByVotes.ts` and its test |

## Stack

Vite, React 19, TypeScript, Tailwind CSS v4 (with tw-animate-css for enter animations), TanStack Query, [@lorenzopant/tmdb](https://www.npmjs.com/package/@lorenzopant/tmdb) (typed TMDB client), Vitest.

## Decisions

- **Filter: genre, plus a vote floor.** Every request sends `vote_count.gte` (50, or 200 for "Top rated") so obscure movies with a handful of votes don't crowd the page. Picking genres adds `with_genres`. Several genres are joined with `|` ("any of"), not `,` ("all of"), so results can match some of the picks.
- **Sort: TMDB first, then the client.** TMDB sorts the whole catalog by the chosen option (`sort_by`) and returns page 1. The client then re-sorts that page with `sortMovies` (`src/lib/sortMovies.ts`): movies matching more of the selected genres come first, and ties are ordered by the chosen property (popularity, rating or release date). With 0 or 1 genre it is a plain sort by that property.
- **Sort guards.** "Top rated" uses the higher vote floor, otherwise it fills up with single 10/10 votes. "Newest" caps the release date at today, otherwise it shows unreleased movies with no poster.
- **State in the URL.** Genres and sort live in the query string (`?genres=28,12&sort=vote_average.desc`), so a view can be linked and survives a reload. Invalid values fall back to the defaults.
- **TanStack Query for fetching.** It caches each filter and sort combination and keeps the previous results on screen (dimmed) while the next request loads, so the grid doesn't flash empty.
- **Typed TMDB client.** `@lorenzopant/tmdb` gives typed params and responses and accepts a v3 API key. All TMDB access goes through `src/api/tmdb.ts`, so swapping the package only touches one file.
- **New releases row.** A separate request (newest first, no genre filter) fills a row at the top that drifts slowly to the left and loops back to the start. The cards are rendered twice so the loop has no jump (the copy is hidden from screen readers and keyboard). Hover or focus pauses it. It drifts even with Reduce motion on, since the drift is slow and stops on hover or focus. Trackpad, touch and the arrow buttons still scroll it by hand.
- **Title search.** The search box sits top left. Typing switches the grid from `/discover/movie` to `/search/movie`, which matches titles only and takes no genre or sort params, so the client filters that page by the selected genres and sorts it. The request waits for a 300 ms pause in typing, and the query is kept in the URL (`?q=alien`).
- **Controls on one line.** The genre chips scroll sideways with a visible scrollbar; "All" clears the filter. The sort sits on the right as a segmented control, so all three options are visible and switching is one click. The bar stays pinned to the top while the grid scrolls.
- **Cards.** Fixed-width card columns (CSS grid, `auto-fill`) centered on the page, so cards keep the poster's 2:3 shape at any screen width. Hover or keyboard focus scales the card up and shows the overview. Each card shows the release year and rating (or "No rating" when there are no votes).
- **Tests.** Vitest unit tests cover the pure logic (request params, sort, URL parsing). Load tests (`src/App.test.tsx`) render the whole app in jsdom with only the TMDB calls faked, and check the first load, genre and sort changes, search, a shared link, and error + retry. No network or API key needed.

## Trade-offs and limitations

- Only the first page (20 movies) is loaded, as the brief allows. The client sort ranks within that page, not the whole catalog.
- The API key is read from a Vite env var, so it ends up in the browser bundle. That's fine locally; a public deploy would need a small server proxy that holds the key.
- No pagination or loading skeleton yet. The load tests fake TMDB, so there is no test against the live API.

## What I'd do next

1. Size cards by rating (bigger cards for higher-rated movies).
2. A second layout option, such as a list view.
3. Infinite scroll or a "Load more" button.
4. A loading skeleton in place of the "Loading…" text.
5. Search by other categories, not just titles: people (cast and crew), keywords and collections (TMDB `/search/person`, `/search/keyword`, `/search/collection`).
6. A server proxy for the API key, then deploy.

## Project notes

Work is split into tickets: GitHub issues, each with a spec in [specs/](specs/README.md).

