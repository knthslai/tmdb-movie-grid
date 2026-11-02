import type { Movie } from '../api/tmdb'

export function countGenreMatches(movie: Pick<Movie, 'genre_ids'>, selected: Set<number>): number {
  return movie.genre_ids.filter((id) => selected.has(id)).length
}

// Movies that match more of the selected genres come first.
// toSorted returns a new array (the cached query data is never mutated) and is stable,
// so movies with the same match count keep TMDB's order, i.e. the chosen server sort.
export function sortByGenreMatches<T extends Pick<Movie, 'genre_ids'>>(movies: T[], genreIds: number[]): T[] {
  if (genreIds.length < 2) return movies // with 0 or 1 genre every movie ties
  const selected = new Set(genreIds)
  return movies.toSorted((a, b) => countGenreMatches(b, selected) - countGenreMatches(a, selected))
}
