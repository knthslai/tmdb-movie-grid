import type { Movie } from '../api/tmdb'
import { MovieCard } from './MovieCard'

// Fixed-width cards in a wrapping row: one or two per row on a phone, many on desktop.
export function MovieGrid({ movies }: { movies: Movie[] }) {
  return (
    <ul className="flex flex-wrap justify-center gap-4 sm:justify-start">
      {movies.map((movie) => (
        <li key={movie.id}>
          <MovieCard movie={movie} />
        </li>
      ))}
    </ul>
  )
}
