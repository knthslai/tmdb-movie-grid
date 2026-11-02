// @vitest-environment jsdom
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'
import { discoverMovies, fetchGenres, searchMovies, type DiscoverResult, type Movie } from './api/tmdb'

// Only the network calls are faked; hooks, URL state, sorting and components are the real code.
vi.mock('./api/tmdb', async (importOriginal) => ({
  ...(await importOriginal<typeof import('./api/tmdb')>()),
  discoverMovies: vi.fn(),
  searchMovies: vi.fn(),
  fetchGenres: vi.fn(),
}))

const ACTION = 28
const HORROR = 27

const movie = (id: number, title: string, genre_ids: number[] = [ACTION]): Movie => ({
  id,
  title,
  genre_ids,
  overview: `${title} overview`,
  poster_path: undefined,
  release_date: '2024-05-01',
  vote_average: 7,
  vote_count: 100,
  popularity: 100 - id,
})

const page = (results: Movie[]): DiscoverResult => ({
  page: 1,
  results,
  total_pages: 1,
  total_results: results.length,
})

const NEWEST = [movie(1, 'Brand New One'), movie(2, 'Brand New Two')]
const POPULAR = [movie(3, 'Popular Action'), movie(4, 'Popular Horror', [HORROR])]
const ALIENS = [movie(5, 'Alien', [HORROR]), movie(6, 'Alien Action')]

const renderApp = () => {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={client}>
      <App />
    </QueryClientProvider>,
  )
}

// The grid is the list inside the Browse section; the New releases row has its own section.
const grid = () => within(screen.getByRole('region', { name: 'Browse' }))
const gridTitles = () => grid().getAllByRole('article').map((card) => within(card).getByRole('heading').textContent)

beforeEach(() => {
  window.history.replaceState(null, '', '/')
  // jsdom has no matchMedia. Reporting reduced motion keeps the New releases row still.
  window.matchMedia = vi.fn().mockReturnValue({ matches: true }) as unknown as typeof window.matchMedia
  vi.mocked(fetchGenres).mockResolvedValue([
    { id: ACTION, name: 'Action' },
    { id: HORROR, name: 'Horror' },
  ])
  vi.mocked(discoverMovies).mockImplementation(async (params = {}) =>
    page(params.sortBy === 'primary_release_date.desc' ? NEWEST : POPULAR),
  )
  vi.mocked(searchMovies).mockImplementation(async (query) => page(query === 'alien' ? ALIENS : []))
})

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})

describe('App loads', () => {
  it('shows the New releases row, the genre chips and the grid', async () => {
    renderApp()
    expect(screen.getByText('Loading…')).toBeTruthy()

    const row = within(await screen.findByRole('region', { name: 'New releases' }))
    expect(row.getAllByText('Brand New One').length).toBeGreaterThan(0)
    expect(await screen.findByRole('button', { name: 'Action' })).toBeTruthy()
    await waitFor(() => expect(gridTitles()).toEqual(['Popular Action', 'Popular Horror']))

    expect(discoverMovies).toHaveBeenCalledWith({ sortBy: 'primary_release_date.desc' })
    expect(discoverMovies).toHaveBeenCalledWith({ genreIds: [], sortBy: 'popularity.desc' })
    expect(searchMovies).not.toHaveBeenCalled()
  })

  it('refetches with a genre and keeps it in the URL', async () => {
    renderApp()
    fireEvent.click(await screen.findByRole('button', { name: 'Horror' }))

    await waitFor(() =>
      expect(discoverMovies).toHaveBeenCalledWith({ genreIds: [HORROR], sortBy: 'popularity.desc' }),
    )
    expect(window.location.search).toBe(`?genres=${HORROR}`)
  })

  it('refetches with a sort and keeps it in the URL', async () => {
    renderApp()
    fireEvent.click(await screen.findByRole('button', { name: 'Top rated' }))

    await waitFor(() =>
      expect(discoverMovies).toHaveBeenCalledWith({ genreIds: [], sortBy: 'vote_average.desc' }),
    )
    expect(window.location.search).toBe('?sort=vote_average.desc')
  })

  it('searches by title after a pause in typing', async () => {
    renderApp()
    const box = screen.getByRole('searchbox', { name: 'Search movies by title' })
    fireEvent.change(box, { target: { value: 'ali' } })
    fireEvent.change(box, { target: { value: 'alien' } })

    await waitFor(() => expect(gridTitles()).toEqual(['Alien', 'Alien Action']))
    expect(searchMovies).toHaveBeenCalledTimes(1)
    expect(searchMovies).toHaveBeenCalledWith('alien')
    expect(window.location.search).toBe('?q=alien')
  })

  it('filters search results by the selected genre', async () => {
    renderApp()
    fireEvent.click(await screen.findByRole('button', { name: 'Horror' }))
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'alien' } })

    await waitFor(() => expect(gridTitles()).toEqual(['Alien']))
  })

  it('says so when a search has no results', async () => {
    renderApp()
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'zzz' } })

    expect(await screen.findByText('No movies found for “zzz”.')).toBeTruthy()
  })

  it('loads the view from a shared link', async () => {
    window.history.replaceState(null, '', `/?q=alien&genres=${HORROR}`)
    renderApp()

    expect((screen.getByRole('searchbox') as HTMLInputElement).value).toBe('alien')
    await waitFor(() => expect(gridTitles()).toEqual(['Alien']))
    expect(screen.getByRole('button', { name: 'Horror' }).getAttribute('aria-pressed')).toBe('true')
  })

  it('shows the error with a Retry button that loads the grid', async () => {
    vi.mocked(discoverMovies).mockImplementation(async (params = {}) => {
      if (params.sortBy === 'primary_release_date.desc') return page(NEWEST)
      throw new Error('TMDB is down')
    })
    renderApp()
    const retry = await screen.findByRole('button', { name: 'Retry' })
    expect(screen.getByText('TMDB is down')).toBeTruthy()

    vi.mocked(discoverMovies).mockImplementation(async () => page(POPULAR))
    fireEvent.click(retry)
    await waitFor(() => expect(gridTitles()).toEqual(['Popular Action', 'Popular Horror']))
  })
})
