// TMDB client, types and discover params.
// @lorenzopant/tmdb does the HTTP, URL building and response types.
// This file is the one place the app talks to it, so the rest of the app never imports the package.
import {
  IMAGE_SECURE_BASE_URL,
  TMDB,
  type DiscoverMovieParams,
  type DiscoverMovieSortBy,
  type Genre,
  type MovieDetails,
  type MovieResultItem,
  type PaginatedResponse,
  type PersonDetails,
  type PersonResultItem,
  type PosterSize,
  type SearchMoviesParams,
} from '@lorenzopant/tmdb'

const apiKey = import.meta.env.VITE_TMDB_API_KEY

// One client for the whole app, created on first use. `new TMDB(undefined)` throws, so creating it
// at import time crashed the app (and every test that imports this file) when the key was missing.
// A v3 key (not a JWT) is sent as the `api_key` query param.
// The package's own cache is off by default; TanStack Query does the caching instead.
let client: TMDB | undefined
function tmdb(): TMDB {
  if (!apiKey) {
    throw new Error(
      'Missing VITE_TMDB_API_KEY. Add it to .env.local and restart the dev server.',
    )
  }
  return (client ??= new TMDB(apiKey))
}

// The fields the UI uses. The package turns TMDB's `null` into `undefined`,
// so a movie without a poster has `poster_path: undefined`.
export type Movie = Pick<
  MovieResultItem,
  | 'id'
  | 'title'
  | 'overview'
  | 'poster_path'
  | 'release_date'
  | 'vote_average'
  | 'vote_count'
  | 'popularity'
  | 'genre_ids'
>

export type { Genre }

// The sorts offered in the UI. TMDB supports more; these are the useful ones.
export const SORT_OPTIONS = [
  { value: 'popularity.desc', label: 'Most popular' },
  { value: 'vote_average.desc', label: 'Top rated' },
  { value: 'primary_release_date.desc', label: 'Newest' },
] as const satisfies readonly { value: DiscoverMovieSortBy; label: string }[]

export type SortOption = (typeof SORT_OPTIONS)[number]['value']
export const DEFAULT_SORT: SortOption = 'popularity.desc'

export function isSortOption(value: string | null): value is SortOption {
  return SORT_OPTIONS.some((option) => option.value === value)
}

// What the app asks for. Add a field here and map it in `toDiscoverParams`.
export type DiscoverParams = {
  genreIds?: number[]
  sortBy?: SortOption
  page?: number
  movie?: Movie
  actorId?: number
}

export type DiscoverResult = PaginatedResponse<Movie>

// Genre ids -> `with_genres`. `|` means "any of these genres" (`,` would mean "all of them"),
// so results can match some of the picks and the client sort can rank by how many.
// Sorted and de-duplicated, so the same picks in any order give the same value (and cache key).
export function toWithGenres(genreIds: number[]): string | undefined {
  if (genreIds.length === 0) return undefined
  return [...new Set(genreIds)].sort((a, b) => a - b).join('|')
}

const today = () => new Date().toISOString().slice(0, 10)

// Always sent, so every request is filtered: hides obscure movies with too few votes to judge.
export const MIN_VOTES = 50
// "Top rated" needs a higher floor, or it fills up with movies that have one 10/10 vote.
export const TOP_RATED_MIN_VOTES = 200

// App params -> the package's param names. Undefined values are left off the URL by the package.
export function toDiscoverParams({
  genreIds = [],
  sortBy = DEFAULT_SORT,
  page = 1,
  actorId,
}: DiscoverParams): DiscoverMovieParams {
  return {
    with_genres: toWithGenres(genreIds),
    with_cast: actorId,
    sort_by: sortBy,
    page,
    include_adult: false,
    'vote_count.gte':
      sortBy === 'vote_average.desc' ? TOP_RATED_MIN_VOTES : MIN_VOTES,
    // Without a date cap, "newest" is unreleased movies with no poster or overview yet.
    'primary_release_date.lte':
      sortBy === 'primary_release_date.desc' ? today() : undefined,
  }
}

// One page of /discover/movie. Throws on a missing key or a failed request,
// so the query lands in its error state instead of showing an empty grid.
export async function discoverMovies(
  params: DiscoverParams = {},
): Promise<DiscoverResult> {
  return tmdb().discover.movie(toDiscoverParams(params))
}

// /search/movie matches titles only and takes no genre or sort params,
// so the client filters and sorts the results (see `filterByGenres` and `sortMovies`).
export function toSearchParams(query: string, page = 1): SearchMoviesParams {
  return { query: query.trim(), page, include_adult: false }
}

// One page of /search/movie for a title query.
export async function searchMovies(
  query: string,
  page = 1,
): Promise<DiscoverResult> {
  return tmdb().search.movies(toSearchParams(query, page))
}

export async function fetchGenres(): Promise<Genre[]> {
  const { genres } = await tmdb().genres.movie_list()
  return genres
}

// Full poster URL, or undefined when TMDB has no poster (the card shows a placeholder).
// Built by hand so rendering a card never needs the client (or the key).
export function posterUrl(
  path: string | undefined,
  size: PosterSize = 'w342',
): string | undefined {
  return path ? `${IMAGE_SECURE_BASE_URL}${size}${path}` : undefined
}

// REVIEW(searchby.2): actor type, people search, bio lookup and profile image URL
export type Actor = Pick<PersonResultItem, 'id' | 'name' | 'profile_path'>

// TMDB's person search already matches names loosely (partial and misspelled names).
// Only people known for acting are kept, and the most popular come first.
export async function searchPeople(query: string): Promise<Actor[]> {
  const { results } = await tmdb().search.person({
    query: query.trim(),
    include_adult: false,
  })
  return results
    .filter((person) => person.known_for_department === 'Acting')
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 8)
    .map(({ id, name, profile_path }) => ({ id, name, profile_path }))
}

export async function getPersonBio(person_id: number): Promise<PersonDetails> {
  return tmdb().people.details({ person_id })
}

export function profileUrl(
  path: string | undefined,
  size: 'w92' | 'w185' = 'w185',
): string | undefined {
  return path ? `${IMAGE_SECURE_BASE_URL}${size}${path}` : undefined
}

export async function getMovie(movie_id: number): Promise<MovieDetails> {
  return tmdb().movies.details({ movie_id: Number(movie_id) })
}
