import { describe, expect, it } from 'vitest'
import { sortMovies } from './sortMovies'

const movie = (id: number, genre_ids: number[], extra: { popularity?: number; vote_average?: number; release_date?: string } = {}) => ({
  id,
  genre_ids,
  popularity: 0,
  vote_average: 0,
  release_date: '',
  ...extra,
})

describe('sortMovies', () => {
  it('puts movies matching more selected genres first', () => {
    const movies = [movie(1, [28]), movie(2, [28, 12, 16]), movie(3, [28, 12])]
    expect(sortMovies(movies, [28, 12, 16], 'popularity.desc').map((m) => m.id)).toEqual([2, 3, 1])
  })

  it('breaks genre ties by the chosen property', () => {
    const movies = [movie(1, [28], { vote_average: 6 }), movie(2, [12], { vote_average: 8 }), movie(3, [28, 12])]
    expect(sortMovies(movies, [28, 12], 'vote_average.desc').map((m) => m.id)).toEqual([3, 2, 1])
  })

  it('sorts by the chosen property when no genres are selected', () => {
    const movies = [
      movie(1, [], { release_date: '2020-05-01' }),
      movie(2, [], { release_date: '' }),
      movie(3, [], { release_date: '2024-01-15' }),
    ]
    expect(sortMovies(movies, [], 'primary_release_date.desc').map((m) => m.id)).toEqual([3, 1, 2])
  })

  it('does not mutate the input array', () => {
    const movies = [movie(1, [28], { popularity: 1 }), movie(2, [28], { popularity: 9 })]
    const copy = [...movies]
    sortMovies(movies, [], 'popularity.desc')
    expect(movies).toEqual(copy)
  })
})
