// T03 — Data hook with loading, error and empty states
// Issue: https://github.com/knthslai/tmdb-movie-grid/issues/4 · Spec: specs/T03-data-hook.md
// Empty stub with TODO tags, created by Claude Code. The code is mine to write.

// TODO(T03): fetch function: build the URL (T02), call fetch, return typed JSON
// TODO(T03): throw a readable error when `!response.ok` (fetch doesn't throw on 4xx/5xx)
// TODO(T03): throw a clear error when VITE_TMDB_API_KEY is missing
// TODO(T03): useQuery hook; every param goes in the query key
// TODO(T03): pass `signal` to fetch so outdated requests are cancelled
// TODO(T03): decide the retry policy for 4xx and the staleTime
//
// Own it. Be ready to explain:
// - what the query key does, and what breaks if a param is missing from it
// - what the user sees when filters change quickly on a slow network
// - where pagination would plug in
