import { useRef } from 'react'
import type { Movie } from '../api/tmdb'
import { MovieCard } from './MovieCard'

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

// A horizontally scrolling row of cards. Trackpads, touch and shift+wheel scroll it natively;
// the arrow buttons move by most of the visible width. Snap keeps a card lined up on the left edge.
export function MovieRow({ title, movies }: { title: string; movies: Movie[] }) {
  const scroller = useRef<HTMLUListElement>(null)

  const scrollByPage = (direction: 1 | -1) => {
    const el = scroller.current
    if (!el) return
    el.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
  }

  return (
    <section aria-label={title}>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{title}</h2>
        <div className="flex gap-2">
          {([-1, 1] as const).map((direction) => (
            <button
              key={direction}
              type="button"
              aria-label={`Scroll ${title} ${direction < 0 ? 'left' : 'right'}`}
              onClick={() => scrollByPage(direction)}
              className="flex size-8 items-center justify-center rounded-full border border-border bg-surface text-lg leading-none hover:bg-surface-raised"
            >
              {direction < 0 ? '‹' : '›'}
            </button>
          ))}
        </div>
      </div>

      {/* Vertical padding leaves room for the hover scale, which overflow-x would otherwise clip. */}
      <ul
        ref={scroller}
        className="-mx-6 flex snap-x snap-mandatory scroll-px-6 gap-4 overflow-x-auto px-6 py-4 [scrollbar-width:none]"
      >
        {movies.map((movie) => (
          <li key={movie.id} className="shrink-0 snap-start">
            <MovieCard movie={movie} />
          </li>
        ))}
      </ul>
    </section>
  )
}
