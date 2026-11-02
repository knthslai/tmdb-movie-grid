import { describe, expect, it } from 'vitest'
import { sortByGenreMatches } from './sortMovies'

const movie = (id: number, genre_ids: number[]) => ({ id, genre_ids })

describe('sortByGenreMatches', () => {
  it('puts movies matching more selected genres first', () => {
    const movies = [movie(1, [28]), movie(2, [28, 12, 16]), movie(3, [28, 12])]
    expect(sortByGenreMatches(movies, [28, 12, 16]).map((m) => m.id)).toEqual([2, 3, 1])
  })

  it('keeps the server order for ties', () => {
    const movies = [movie(1, [28]), movie(2, [12]), movie(3, [28, 12])]
    expect(sortByGenreMatches(movies, [28, 12]).map((m) => m.id)).toEqual([3, 1, 2])
  })

  it('does not mutate the input array', () => {
    const movies = [movie(1, [28]), movie(2, [28, 12])]
    const copy = [...movies]
    sortByGenreMatches(movies, [28, 12])
    expect(movies).toEqual(copy)
  })

  it('returns the list unchanged with fewer than two genres', () => {
    const movies = [movie(1, [28]), movie(2, [12])]
    expect(sortByGenreMatches(movies, [])).toBe(movies)
    expect(sortByGenreMatches(movies, [12])).toBe(movies)
  })
})
