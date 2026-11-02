import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { discoverMovies, fetchGenres, toDiscoverParams, type DiscoverParams } from './tmdb'

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

// Genre names rarely change, so fetch them once per session.
export function useGenres() {
  return useQuery({
    queryKey: ['genres'],
    queryFn: fetchGenres,
    staleTime: Infinity,
  })
}
