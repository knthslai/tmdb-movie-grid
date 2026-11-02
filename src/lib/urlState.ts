import { useCallback, useState } from 'react'
import { DEFAULT_SORT, isSortOption, type SortOption } from '../api/tmdb'

// The filter and sort live in the URL (?genres=28,12&sort=vote_average.desc),
// so a reload or a shared link shows the same view.
export type ViewState = {
  genreIds: number[]
  sortBy: SortOption
}

// Missing or invalid values fall back to defaults instead of breaking the page.
export function parseViewState(search: string): ViewState {
  const params = new URLSearchParams(search)
  const genreIds = (params.get('genres') ?? '')
    .split(',')
    .map(Number)
    .filter((id) => Number.isInteger(id) && id > 0)
  const sort = params.get('sort')
  return { genreIds, sortBy: isSortOption(sort) ? sort : DEFAULT_SORT }
}

// Defaults are left out so the plain URL stays clean.
export function toSearch({ genreIds, sortBy }: ViewState): string {
  const params = new URLSearchParams()
  if (genreIds.length > 0) params.set('genres', genreIds.join(','))
  if (sortBy !== DEFAULT_SORT) params.set('sort', sortBy)
  const search = params.toString()
  return search ? `?${search}` : ''
}

// replaceState (not pushState): changing filters doesn't fill the Back button history.
export function useViewState(): [ViewState, (next: ViewState) => void] {
  const [state, setState] = useState(() => parseViewState(window.location.search))
  const update = useCallback((next: ViewState) => {
    setState(next)
    window.history.replaceState(null, '', window.location.pathname + toSearch(next))
  }, [])
  return [state, update]
}
