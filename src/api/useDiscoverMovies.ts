import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { discoverMovies, fetchGenres, searchMovies, toDiscoverParams, toSearchParams, type DiscoverParams } from './tmdb'

// The query key is the cache key, so every param must be in it. Using the mapped TMDB params
// means the same genres in a different order share one cache entry.
// keepPreviousData keeps the current grid on screen while the next filter loads.
export function useDiscoverMovies(params: DiscoverParams = {}) {
  return useQuery({
    queryKey: ['discover', toDiscoverParams(params)],
    queryFn: () => discoverMovies(params),
    placeholderData: keepPreviousData,
  })
}

// Title search. Disabled for an empty query, so nothing is fetched until the user types.
export function useSearchMovies(query: string) {
  return useQuery({
    queryKey: ['search', toSearchParams(query)],
    queryFn: () => searchMovies(query),
    enabled: query.trim() !== '',
    placeholderData: keepPreviousData,
  })
}

// Genre names rarely change, so fetch them once per session.
export function useGenres() {
  return useQuery({
    queryKey: ['genres'],
    queryFn: fetchGenres,
    staleTime: Infinity,
  })
}
