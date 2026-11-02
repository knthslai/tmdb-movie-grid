# T03 — Data hook with loading, error and empty states

Issue: [#4](https://github.com/knthslai/tmdb-movie-grid/issues/4) · File: `src/api/useDiscoverMovies.ts`

## Why it matters

This is where server state lives. Reviewers will ask what happens when filters change quickly, when the request fails, and how pagination would fit.

## Background

- [`useQuery`](https://tanstack.com/query/latest/docs/framework/react/reference/useQuery) takes `queryKey` and `queryFn`, and returns `data`, `isPending`, `isError`, `error`, `refetch`, `isFetching`, and more.
- The **query key is the cache key.** Every input that changes the request must be in it.
- `fetch` does not throw on 404 or 401; it only rejects on network failure. Check `response.ok` yourself.
- `queryFn` receives `{ signal }`. Passing it to `fetch` cancels outdated requests.
- `placeholderData: keepPreviousData` keeps showing the old results while new ones load.

## Steps

1. **Fetch function** (plain async function, no React): build the URL with T02, call `fetch`, throw a readable `Error` when `!response.ok` (include `status_message` if present), and return typed JSON.
2. **Missing key.** If `import.meta.env.VITE_TMDB_API_KEY` is empty, throw a clear error before fetching. Checkpoint: rename `.env.local` temporarily, restart, and see the message.
3. **Hook.** Wrap the fetch function in `useQuery`. Put the params object in the key.
4. **Try it.** Temporarily render `data?.results.length` and the error message in `App.tsx`. Open DevTools → Network and change a param: does a new request fire?
5. **Retries.** Notice that failed requests retry 3 times by default. Decide whether a 401 should retry.

## Edge cases

- 401 bad key, 429 rate limit, offline.
- Fast param changes: an old response arriving after a new one.
- Empty `results` array: this is a success, not an error.

## Decisions I make

- Retry policy for 4xx errors.
- `staleTime`: how fresh does discover data need to be?

