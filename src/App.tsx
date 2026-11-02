import { useDiscoverMovies, useGenres } from './api/useDiscoverMovies'
import { Controls } from './components/Controls'
import { MovieGrid } from './components/MovieGrid'
import { sortByGenreMatches } from './lib/sortMovies'
import { useViewState } from './lib/urlState'

export default function App() {
  const [view, setView] = useViewState()
  const genres = useGenres()
  // Filter and server sort go to TMDB; the genre-match ranking happens here on the client.
  const movies = useDiscoverMovies({ genreIds: view.genreIds, sortBy: view.sortBy })
  const ranked = movies.data ? sortByGenreMatches(movies.data.results, view.genreIds) : []

  return (
    <main className="mx-auto max-w-6xl p-6">
      <h1 className="text-2xl font-semibold">Discover movies</h1>

      <section className="mt-6">
        <Controls genres={genres.data ?? []} value={view} onChange={setView} />
      </section>

      <section className={`mt-8 ${movies.isPlaceholderData ? 'opacity-60' : ''}`} aria-busy={movies.isFetching}>
        {movies.isPending ? (
          <p className="text-muted">Loading…</p>
        ) : movies.isError ? (
          <div className="flex items-center gap-3">
            <p className="text-danger">{movies.error.message}</p>
            <button
              type="button"
              onClick={() => movies.refetch()}
              className="rounded-card border border-border bg-surface px-3 py-1 text-sm hover:bg-surface-raised"
            >
              Retry
            </button>
          </div>
        ) : ranked.length === 0 ? (
          <p className="text-muted">No movies match these genres.</p>
        ) : (
          <MovieGrid movies={ranked} />
        )}
      </section>
    </main>
  )
}
