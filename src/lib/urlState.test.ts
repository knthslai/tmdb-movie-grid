import { describe, expect, it } from 'vitest'
import { parseViewState, toSearch } from './urlState'

describe('URL state', () => {
  it('uses defaults for an empty URL', () => {
    expect(parseViewState('')).toEqual({ query: '', genreIds: [], sortBy: 'popularity.desc' })
  })

  it('reads the search, genres and sort', () => {
    expect(parseViewState('?q=alien&genres=28,12&sort=vote_average.desc')).toEqual({
      query: 'alien',
      genreIds: [28, 12],
      sortBy: 'vote_average.desc',
    })
  })

  it('ignores invalid values', () => {
    expect(parseViewState('?genres=28,abc,-1,&sort=nope')).toEqual({ query: '', genreIds: [28], sortBy: 'popularity.desc' })
  })

  it('round-trips, leaving defaults out of the URL', () => {
    const state = { query: 'star wars', genreIds: [28, 12], sortBy: 'primary_release_date.desc' as const }
    expect(parseViewState(toSearch(state))).toEqual(state)
    expect(toSearch({ query: '', genreIds: [], sortBy: 'popularity.desc' })).toBe('')
    expect(toSearch({ query: '   ', genreIds: [], sortBy: 'popularity.desc' })).toBe('')
  })
})
