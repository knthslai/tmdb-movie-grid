import {
  useDiscoverMovies,
  useGenres,
  useSearchMovies,
} from './api/useDiscoverMovies'
// REVIEW(searchby.4): imports for actor state and types
import { useState } from 'react'
import type { Actor } from './api/tmdb'
// REVIEW(searchby.5): imports for the actor components
import { ActorBlurb, ActorSearch } from './components/ActorSearch'
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
  // REVIEW(searchby.4): selected actor state
  const [actor, setActor] = useState<Actor | null>(null)
  const discover = useDiscoverMovies({
    genreIds: view.genreIds,
    sortBy: view.sortBy,
    // REVIEW(searchby.4): an actor filters discover to their movies
    actorId: actor?.id,
  })
  const search = useSearchMovies(query)
  // REVIEW(searchby.4): an actor selection takes priority over title search
  const searchActive = searching && !actor
  const movies = searchActive ? search : discover
  const results = movies.data
    ? searchActive
      ? filterByGenres(movies.data.results, view.genreIds)
      : movies.data.results
    : []
  const ranked = sortMovies(results, view.genreIds, view.sortBy)
  // TODO: add a search by actor feature with dropdown of actors fuzzy name match after selecting show hero of image and description and their movies
  //   DONE(searchby.1): ☑ Add actor type, people search and with_cast param → src/api/tmdb.ts:72
  //   STEP(searchby.2): ☐ Add profile URL helper and person bio fetch → src/api/tmdb.ts:149
  //   STEP(searchby.3): ☐ Add people search and bio query hooks → src/api/useDiscoverMovies.ts:44
  //   STEP(searchby.4): ☐ Track selected actor and filter discover by it → src/App.tsx:6
  //   STEP(searchby.5): ☐ Render actor dropdown, hero blurb and movies heading → src/App.tsx:9
  return (
    <main className="mx-auto max-w-6xl p-6">
      <header className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 flex-1 flex-wrap gap-2">
          <SearchBox
            value={view.query}
            onChange={(query) => setView({ ...view, query })}
          />
          {/* REVIEW(searchby.5): actor dropdown search next to title search */}
          <ActorSearch onSelect={setActor} />
        </div>
        <h1 className="shrink-0 text-2xl font-semibold">Discover movies</h1>
      </header>

      {/* REVIEW(searchby.5): hero with photo and bio for the selected actor */}
      {actor && <ActorBlurb actor={actor} onClear={() => setActor(null)} />}

      {newest.data && (
        <div className="mt-6">
          <MovieRow title="New releases" movies={newest.data.results} />
        </div>
      )}
      {/* REVIEW(searchby.5): label the grid as the actor's movies */}
      {actor && (
        <h2 className="mt-6 text-lg font-semibold">Movies with {actor.name}</h2>
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
