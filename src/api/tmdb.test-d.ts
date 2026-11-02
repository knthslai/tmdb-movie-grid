// T02 — Type tests for the TMDB types this app relies on (checked by the compiler, never run)
// Issue: https://github.com/knthslai/tmdb-movie-grid/issues/3 · Spec: specs/T02-tmdb-api.md
// Run: npm run test:types
import type { MovieResultItem } from '@lorenzopant/tmdb'
import { describe, expectTypeOf, it } from 'vitest'
import { posterUrl, toWithGenres, type DiscoverParams, type Movie } from './tmdb'

type MovieFields = Pick<
  MovieResultItem,
  'id' | 'title' | 'overview' | 'poster_path' | 'release_date' | 'vote_average' | 'vote_count' | 'popularity' | 'genre_ids'
>

describe('TMDB types', () => {
  it('Movie has exactly the fields used by this app', () => {
    expectTypeOf<Movie>().toEqualTypeOf<MovieFields>()
  })

  it('models a missing poster and poster helper fallback', () => {
    expectTypeOf<Movie['poster_path']>().toEqualTypeOf<string | undefined>()
    expectTypeOf(posterUrl).returns.toEqualTypeOf<string | undefined>()
  })

  it('keeps release_date as a string', () => {
    expectTypeOf<Movie['release_date']>().toEqualTypeOf<string>()
  })

  it('rejects sort values outside app-supported TMDB sorts', () => {
    // @ts-expect-error "title.asc" is not one of this app's SortOption values.
    const params: DiscoverParams = { sortBy: 'title.asc' }
    expectTypeOf(params).toEqualTypeOf<DiscoverParams>()
  })

  it('returns an optional genre query value', () => {
    expectTypeOf(toWithGenres).returns.toEqualTypeOf<string | undefined>()
  })
})
