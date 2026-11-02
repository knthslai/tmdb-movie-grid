// T03 — Data hook with loading, error and empty states
// Issue: https://github.com/knthslai/tmdb-movie-grid/issues/4 · Spec: specs/T03-data-hook.md
// Empty stub with TODO tags, created by Claude Code. The code is mine to write.

// TODO(T03): query fn: map my T02 params to DiscoverMovieParams, call tmdb.discover.movie
// TODO(T03): make a missing VITE_TMDB_API_KEY show a readable error, not an empty grid
// TODO(T03): useQuery hook; every param goes in the query key (same genres, any order, same key)
// TODO(T03): decide the retry policy for 4xx (TMDBError.http_status_code) and the staleTime
// TODO(T03): genres query for tmdb.genres.movie_list(), if I fetch genres
//
// Own it. Be ready to explain:
// - what the query key does, and what breaks if a param is missing from it
// - what the user sees when filters change quickly, given the package can't cancel requests
// - where pagination would plug in
