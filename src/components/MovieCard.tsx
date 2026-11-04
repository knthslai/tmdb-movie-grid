import { posterUrl, type Movie } from '../api/tmdb'
import { useGetMovies } from '../api/useDiscoverMovies'

// Poster-first card. Hover or keyboard focus scales the card up and fades the overview in over the poster.
export function MovieCard({ movie }: { movie: Movie }) {
  const src = posterUrl(movie.poster_path)
  const year = movie.release_date.slice(0, 4) // "" when TMDB has no date
  const rated = movie.vote_count > 0
  const { data } = useGetMovies(movie.id)
  console.log(data?.runtime)
  return (
    <article
      tabIndex={0}
      className="group relative w-40 overflow-hidden rounded-card bg-surface sm:w-44 motion-safe:transition-transform motion-safe:duration-200 ease-reveal hover:z-10 hover:scale-105 focus-visible:z-10 focus-visible:scale-105"
    >
      <div className="relative aspect-poster">
        {src ? (
          <img
            src={src}
            alt={`${movie.title} poster`}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-surface-raised p-4 text-center text-sm text-muted">
            No poster
          </div>
        )}

        {movie.overview && (
          <div className="absolute inset-0 flex items-end bg-bg/90 p-3 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 motion-safe:transition-opacity motion-safe:duration-200 ease-reveal">
            <p className="line-clamp-[9] text-xs leading-relaxed">
              {movie.overview}
            </p>
          </div>
        )}
      </div>

      <div className="p-3">
        <h2
          className="line-clamp-2 min-h-10 text-sm font-medium"
          title={movie.title}
        >
          {movie.title}
        </h2>
        <p className="mt-1 flex items-center justify-between text-xs text-muted">
          <span>{data?.runtime}</span>
          <span>{year || '—'}</span>
          {rated ? (
            <span className="font-medium text-accent">
              ★ {movie.vote_average.toFixed(1)}
            </span>
          ) : (
            <span>No rating</span>
          )}
        </p>
      </div>
    </article>
  )
}
