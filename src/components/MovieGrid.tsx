import type { Movie } from '../api/tmdb'
import { MovieCard } from './MovieCard'

// Fixed-width card columns, as many as fit, centered so the leftover space is split evenly.
// One or two per row on a phone, many on desktop.
export function MovieGrid({ movies }: { movies: Movie[] }) {
  return (
    <ul className="grid grid-cols-[repeat(auto-fill,10rem)] justify-center gap-4 sm:grid-cols-[repeat(auto-fill,11rem)]">
      {movies.map((movie) => (
        <li key={movie.id}>
          <MovieCard movie={movie} />
        </li>
      ))}
    </ul>
  )
}
