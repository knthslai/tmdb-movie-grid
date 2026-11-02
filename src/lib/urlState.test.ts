import { describe, expect, it } from 'vitest'
import { parseViewState, toSearch } from './urlState'

describe('URL state', () => {
  it('uses defaults for an empty URL', () => {
    expect(parseViewState('')).toEqual({ genreIds: [], sortBy: 'popularity.desc' })
  })

  it('reads genres and sort', () => {
    expect(parseViewState('?genres=28,12&sort=vote_average.desc')).toEqual({
      genreIds: [28, 12],
      sortBy: 'vote_average.desc',
    })
  })

  it('ignores invalid values', () => {
    expect(parseViewState('?genres=28,abc,-1,&sort=nope')).toEqual({ genreIds: [28], sortBy: 'popularity.desc' })
  })

  it('round-trips, leaving defaults out of the URL', () => {
    const state = { genreIds: [28, 12], sortBy: 'primary_release_date.desc' as const }
    expect(parseViewState(toSearch(state))).toEqual(state)
    expect(toSearch({ genreIds: [], sortBy: 'popularity.desc' })).toBe('')
  })
})
