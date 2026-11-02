import { describe, expect, it } from 'vitest'
import { MIN_VOTES, TOP_RATED_MIN_VOTES, posterUrl, toDiscoverParams, toWithGenres } from './tmdb'

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

describe('posterUrl', () => {
  it('returns undefined when poster_path is missing', () => {
    expect(posterUrl(undefined)).toBeUndefined()
  })

  it('builds a URL that contains the path', () => {
    expect(posterUrl('/abc.jpg')).toContain('/abc.jpg')
  })
})
