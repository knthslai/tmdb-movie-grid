import { afterEach, describe, expect, it, vi } from 'vitest'
import { MIN_VOTES, TOP_RATED_MIN_VOTES, posterUrl, toDiscoverParams, toSearchParams, toWithGenres } from './tmdb'

describe('toWithGenres', () => {
  it('returns undefined for no genres', () => {
    expect(toWithGenres([])).toBeUndefined()
  })

  it('joins several ids with | (any of the genres)', () => {
    expect(toWithGenres([12, 28])).toBe('12|28')
  })

  it('gives the same value for the same ids in any order, without duplicates', () => {
    expect(toWithGenres([28, 12, 28])).toBe(toWithGenres([12, 28]))
  })
})

describe('toDiscoverParams', () => {
  it('defaults to popular movies, page 1, no genre filter', () => {
    expect(toDiscoverParams({})).toMatchObject({ sort_by: 'popularity.desc', page: 1, with_genres: undefined })
  })

  it('always sends a vote floor, higher for top rated', () => {
    expect(toDiscoverParams({})['vote_count.gte']).toBe(MIN_VOTES)
    expect(toDiscoverParams({ sortBy: 'vote_average.desc' })['vote_count.gte']).toBe(TOP_RATED_MIN_VOTES)
  })
})

describe('toSearchParams', () => {
  it('trims the query and defaults to page 1 without adult titles', () => {
    expect(toSearchParams('  alien ')).toEqual({ query: 'alien', page: 1, include_adult: false })
  })
})

describe('posterUrl', () => {
  it('returns undefined when poster_path is missing', () => {
    expect(posterUrl(undefined)).toBeUndefined()
  })

  it('builds a URL that contains the path', () => {
    expect(posterUrl('/abc.jpg')).toContain('/abc.jpg')
  })
})

describe('without an API key', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.resetModules()
  })

  it('imports fine and rejects each request with a clear message', async () => {
    vi.stubEnv('VITE_TMDB_API_KEY', '')
    vi.resetModules()
    const api = await import('./tmdb')

    await expect(api.discoverMovies()).rejects.toThrow('Missing VITE_TMDB_API_KEY')
    await expect(api.searchMovies('alien')).rejects.toThrow('Missing VITE_TMDB_API_KEY')
    expect(api.posterUrl('/abc.jpg')).toBe('https://image.tmdb.org/t/p/w342/abc.jpg')
  })
})
