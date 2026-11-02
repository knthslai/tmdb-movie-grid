# T02 — TMDB types and discover URL builder

Issue: [#3](https://github.com/knthslai/tmdb-movie-grid/issues/3) · File: `src/api/tmdb.ts`

## Why it matters

Every later card depends on this file. In the review, "add a second filter" will start here. Keep it small, typed, and free of React.

## Background

- Docs: [Discover movie](https://developer.themoviedb.org/reference/discover-movie), [Images](https://developer.themoviedb.org/docs/image-basics), [Genres](https://developer.themoviedb.org/reference/genre-movie-list).
- Base URL: `https://api.themoviedb.org/3`. A v3 key goes in the `api_key` query param.
- Response: `{ page, results, total_pages, total_results }`. Each result has `id`, `title`, `overview`, `poster_path` (can be `null`), `backdrop_path`, `release_date` (string, can be `""`), `vote_average`, `vote_count`, `popularity`, `genre_ids`, `original_language`, `original_title`, `adult`, `video`.
- `with_genres` takes ids. A comma means AND, a pipe means OR.
- `sort_by` values look like `popularity.desc`, `vote_average.desc`, `primary_release_date.desc`.
- Poster URL = `https://image.tmdb.org/t/p/` + size + `poster_path`. Sizes include `w185`, `w342`, `w500`, `original`.
- On error TMDB returns a non-2xx status with `{ status_code, status_message, success: false }`. A bad key gives 401.

## Steps

1. **Types first.** Write a `Movie` type with only the fields the UI needs, plus a `DiscoverResponse`. Checkpoint: is `poster_path` nullable? Is `release_date` a `string`, not a `Date`?
2. **Params type.** Write the params my filter and sort need, all optional except what I decide is required. Checkpoint: could I add a second filter by adding one field?
3. **URL builder.** A function from params (and the key) to a URL string. Use `URL` and `URLSearchParams` rather than string concatenation. Skip params that are `undefined`. Checkpoint: log a few URLs in the console and paste one into the browser.
4. **Poster URL helper.** Takes a path and a size; returns a URL or `null`.
5. **Run** `npm run typecheck` and `npm run lint`.

## Edge cases

- Param set to `0` or `''`: is that "unset"? Decide on purpose.
- `poster_path: null`.
- The key is missing because `.env.local` wasn't created.

## Decisions I make (no AI answer)

- Where the API key is read: inside the builder, or passed in? (Passing it in makes the builder easier to test.)
- Hardcode the genre list, or fetch `/genre/movie/list`?

