# T02 — TMDB client, types and discover params

Issue: [#3](https://github.com/knthslai/tmdb-movie-grid/issues/3) · Files: `src/api/tmdb.ts`, `src/api/tmdb.test-d.ts`

## Why it matters

Every later card depends on this file. In the review, "add a second filter" will start here. The package does the HTTP and URL work; this file is where my app's rules sit on top of it: which fields the UI uses, how my genre picks become a TMDB param, and what a missing poster means.

## Background

- Package: [@lorenzopant/tmdb](https://www.npmjs.com/package/@lorenzopant/tmdb) 2.2.0. No runtime dependencies. Docs: [tmdb.lorenzopant.dev](https://tmdb.lorenzopant.dev).
- Client: `new TMDB(key, options)`. A v3 key (not a JWT) is sent as the `api_key` query param, so it ends up in the browser bundle and in every request URL.
- Discover: `tmdb.discover.movie(params)` (singular `movie`; the package README says `movies`, the types say `movie`). Params type `DiscoverMovieParams`, result `PaginatedResponse<MovieResultItem>`.
- Genres: `tmdb.genres.movie_list()` returns `GenresResponse` with `Genre` items (`id`, `name`).
- Posters: `tmdb.images.poster(path, size)` takes a **string** path and returns a URL.
- **Nulls become `undefined`.** The package converts every `null` in a response to `undefined`, so `poster_path` is typed `poster_path?: string`. TMDB itself sends `null`.
- `with_genres` is typed as `number | string`. A comma means AND and a pipe means OR ([TMDB docs](https://developer.themoviedb.org/reference/discover-movie)), so joining several ids is my job.
- `sort_by` is a union of 14 values; TMDB's default is `popularity.desc` (from TMDB's [OpenAPI spec](https://developer.themoviedb.org/openapi/tmdb-api.json)).
- Errors throw `TMDBError` with `http_status_code`, `tmdb_status_code` and `message`. A status of `-1` means the package itself failed, not TMDB.
- Type tests: Vitest checks files named `*.test-d.ts` with the TypeScript compiler, not by running them. Use [`expectTypeOf`](https://vitest.dev/guide/testing-types) and run `npm run test:types`.

## Steps

1. **Client.** Create one `TMDB` instance in this file. Decide what happens when `VITE_TMDB_API_KEY` is missing (see Decisions). Checkpoint: what does the package's own cache do, and is it on?
2. **My `Movie` type.** Build it from `MovieResultItem` with `Pick` (only the fields the UI uses). Checkpoint: hover it in the editor. Is `poster_path` optional? Is `release_date` a `string`?
3. **My params type.** The fields my filter and sort need: a list of genre ids, sort, page. Checkpoint: could I add a second filter by adding one field?
4. **Genre param.** A pure function from my genre id list to the `with_genres` value: `undefined` for an empty list, joined with the separator I chose in T01. Checkpoint: same ids in a different order, same output?
5. **Poster helper.** Wrap `tmdb.images.poster` so a missing path returns `null` (or `undefined`, my choice) instead of a broken URL.
6. **Type tests** in `src/api/tmdb.test-d.ts` (see below), then run `npm run test:types`, `npm run typecheck` and `npm run lint`.

## Type tests (`tmdb.test-d.ts`)

The point: the package's types are someone else's claims about TMDB. These tests pin the claims my code relies on, so a package upgrade that changes them fails loudly.

- `Movie` has exactly the fields I picked, and no more.
- `poster_path` on `Movie` accepts `undefined`, and my poster helper's return type includes my "no poster" value.
- `release_date` is a `string`, not a `Date`.
- My params type rejects a sort value TMDB doesn't support (use `// @ts-expect-error` with a value outside TMDB's sort union, not merely an app-hidden sort).
- My genre-param function returns `string | undefined`.

Also run one real request in the browser console and compare it with `Movie`: find a movie whose poster is missing and see what the field is.

## Edge cases

- No genres selected.
- One genre id that is `0`.
- `poster_path` missing.
- Key missing because `.env.local` wasn't created.

## Decisions I make (no AI answer)

- Where the key is read: here at import, or passed in? What does the app show when it's missing?
- Package cache and request deduplication: on or off, given TanStack Query (T03) also caches?
- `null` or `undefined` for "no poster" in my own types.
- Hardcode the genre list, or fetch it with `tmdb.genres.movie_list()`?

