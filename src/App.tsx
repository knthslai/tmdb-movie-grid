import { useDiscoverMovies, useGenres, useSearchMovies } from './api/useDiscoverMovies'
import { Controls } from './components/Controls'
import { MovieGrid } from './components/MovieGrid'
import { MovieRow } from './components/MovieRow'
import { SearchBox } from './components/SearchBox'
import { filterByGenres, sortMovies } from './lib/sortMovies'
import { useDebouncedValue } from './lib/useDebouncedValue'
import { useViewState } from './lib/urlState'

export default function App() {
  const [view, setView] = useViewState()
  const genres = useGenres()
  // The top row is its own request: newest movies, no genre filter.
  const newest = useDiscoverMovies({ sortBy: 'primary_release_date.desc' })
  // With a search query the grid shows /search/movie results; otherwise /discover/movie.
  // The query waits for a 300ms pause in typing before it is sent.
  const query = useDebouncedValue(view.query.trim(), 300)
  const searching = query !== ''
  // Discover: TMDB filters and sorts the whole catalog and returns page 1; the client then ranks
  // that page by genre matches, ties broken by the chosen sort. Search: TMDB only matches titles,
  // so the client applies the genre filter as well as the sort.
  const discover = useDiscoverMovies({
    genreIds: view.genreIds,
    sortBy: view.sortBy,
  })
  const search = useSearchMovies(query)
  const movies = searching ? search : discover
  const results = movies.data
    ? searching
      ? filterByGenres(movies.data.results, view.genreIds)
      : movies.data.results
    : []
  const ranked = sortMovies(results, view.genreIds, view.sortBy)

  return (
    <main className="mx-auto max-w-6xl p-6">
      <header className="flex items-center justify-between gap-4">
        <SearchBox value={view.query} onChange={(query) => setView({ ...view, query })} />
        <h1 className="shrink-0 text-2xl font-semibold">Discover movies</h1>
      </header>

      {newest.data && (
        <div className="mt-6">
          <MovieRow title="New releases" movies={newest.data.results} />
        </div>
      )}

      <section aria-label="Browse" className="mt-4">
        <div className="sticky top-0 z-20 -mx-6 border-border bg-bg px-6 py-3">
          <Controls
            genres={genres.data ?? []}
            value={view}
            onChange={setView}
          />
        </div>

        <div
          className={`mt-6 ${movies.isPlaceholderData ? 'opacity-60' : ''}`}
          aria-busy={movies.isFetching}
        >
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
            <p className="text-muted">
              {searching
                ? `No movies found for “${query}”${view.genreIds.length > 0 ? ' in these genres' : ''}.`
                : 'No movies match these genres.'}
            </p>
          ) : (
            <MovieGrid movies={ranked} />
          )}
        </div>
      </section>
    </main>
  )
}
