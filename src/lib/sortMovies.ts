import type { Movie, SortOption } from '../api/tmdb'

type SortableMovie = Pick<Movie, 'genre_ids' | 'popularity' | 'vote_average' | 'release_date'>

export function countGenreMatches(movie: Pick<Movie, 'genre_ids'>, selected: Set<number>): number {
  return movie.genre_ids.filter((id) => selected.has(id)).length
}

// The number each sort option orders by, highest first. A missing release date sorts last.
const SORT_VALUE: Record<SortOption, (movie: SortableMovie) => number> = {
  'popularity.desc': (movie) => movie.popularity,
  'vote_average.desc': (movie) => movie.vote_average,
  'primary_release_date.desc': (movie) => Date.parse(movie.release_date) || 0,
}

// Movies that match more of the selected genres come first; ties are ordered by the chosen sort.
// With 0 or 1 genre every movie ties on matches, so this is a plain sort by the chosen property.
// toSorted returns a new array, so the cached query data is never mutated.
export function sortMovies<T extends SortableMovie>(movies: T[], genreIds: number[], sortBy: SortOption): T[] {
  const selected = new Set(genreIds)
  const value = SORT_VALUE[sortBy]
  return movies.toSorted(
    (a, b) => countGenreMatches(b, selected) - countGenreMatches(a, selected) || value(b) - value(a),
  )
}
