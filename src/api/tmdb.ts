// T02 — TMDB client, types and discover params
// Issue: https://github.com/knthslai/tmdb-movie-grid/issues/3 · Spec: specs/T02-tmdb-api.md
// Empty stub with TODO tags, created by Claude Code. The code is mine to write.
// HTTP, URLs and response types come from @lorenzopant/tmdb; this file holds my app's rules on top.

// TODO(T02): one TMDB client from VITE_TMDB_API_KEY; decide package cache/dedup given TanStack Query
// TODO(T02): `Movie` = Pick of `MovieResultItem` with only the fields the UI uses (`poster_path` is optional)
// TODO(T02): params type for my filter and sort: genre id list, sort, page
// TODO(T02): pure fn from genre ids to `with_genres`: undefined when empty, stable order, my separator
// TODO(T02): poster helper: missing path -> my "no poster" value, else `tmdb.images.poster(path, size)`
//
// Own it. Be ready to explain:
// - why the package turns TMDB's null into undefined, and what that changed in my types
// - how a second filter flows through this file
// - where the API key ends up (bundle, request URL) and how to keep it secret
