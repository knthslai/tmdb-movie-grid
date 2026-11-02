# Discover movies

A small React app that fetches movies from TMDB's `/discover/movie` endpoint and shows them as a grid of cards.

## Run it

```bash
cp .env.example .env.local   # paste the TMDB v3 API key from the assignment email
npm i
npm start                    # opens http://localhost:5173
```

Other scripts: `npm test`, `npm run typecheck`, `npm run lint`, `npm run build`.

## Stack

Vite, React 19, TypeScript, Tailwind CSS v4 (with tw-animate-css for enter animations), TanStack Query, [@lorenzopant/tmdb](https://www.npmjs.com/package/@lorenzopant/tmdb) (typed TMDB client), Vitest.

## Decisions

- **Filter: genre, plus a vote floor.** Every request sends `vote_count.gte` (50, or 200 for "Top rated") so obscure movies with a handful of votes don't crowd the page. Picking genres adds `with_genres`. Several genres are joined with `|` ("any of"), not `,` ("all of"), so results can match some of the picks.
- **Sort: TMDB first, then the client.** TMDB sorts the whole catalog by the chosen option (`sort_by`) and returns page 1. The client then re-sorts that page with `sortMovies` (`src/lib/sortMovies.ts`): movies matching more of the selected genres come first, and ties are ordered by the chosen property (popularity, rating or release date). With 0 or 1 genre it is a plain sort by that property.
- **Sort guards.** "Top rated" uses the higher vote floor, otherwise it fills up with single 10/10 votes. "Newest" caps the release date at today, otherwise it shows unreleased movies with no poster.
- **State in the URL.** Genres and sort live in the query string (`?genres=28,12&sort=vote_average.desc`), so a view can be linked and survives a reload. Invalid values fall back to the defaults.
- **TanStack Query for fetching.** It caches each filter and sort combination and keeps the previous results on screen (dimmed) while the next request loads, so the grid doesn't flash empty.
- **Typed TMDB client.** `@lorenzopant/tmdb` gives typed params and responses and accepts a v3 API key. All TMDB access goes through `src/api/tmdb.ts`, so swapping the package only touches one file.
- **Cards.** Fixed-width cards in a wrapping flex layout, so cards keep the poster's 2:3 shape at any screen width. Hover or keyboard focus lifts the card and shows the overview. Each card shows the release year and rating (or "No rating" when there are no votes).
- **Tests on the logic, not the markup.** Vitest covers the request params, the sort and the URL parsing, which are pure functions.

## Trade-offs and limitations

- Only the first page (20 movies) is loaded, as the brief allows. The client sort ranks within that page, not the whole catalog.
- The API key is read from a Vite env var, so it ends up in the browser bundle. That's fine locally; a public deploy would need a small server proxy that holds the key.
- No pagination, loading skeleton or end-to-end tests yet.

## What I'd do next

1. Size cards by rating (bigger cards for higher-rated movies).
2. A second layout option, such as a list view.
3. Infinite scroll or a "Load more" button.
4. A loading skeleton in place of the "Loading…" text.
5. A server proxy for the API key, then deploy.

## Project notes

Work is split into tickets: GitHub issues, each with a spec in [specs/](specs/README.md).
