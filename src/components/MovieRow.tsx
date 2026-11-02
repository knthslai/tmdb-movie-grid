import { useEffect, useRef, useState } from 'react'
import type { Movie } from '../api/tmdb'
import { MovieCard } from './MovieCard'

const AUTO_SCROLL_PX_PER_SECOND = 30

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

// A horizontally scrolling row of cards that drifts slowly to the left on its own. The list is
// rendered twice so the drift can loop without a jump; the copy is hidden from screen readers and
// keyboard focus. Hover or focus pauses the drift.
// Trackpads, touch and the arrow buttons still scroll it by hand.
export function MovieRow({ title, movies }: { title: string; movies: Movie[] }) {
  const scroller = useRef<HTMLUListElement>(null)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    const el = scroller.current
    // Runs even with reduced motion on: the drift is slow and stops on hover or focus.
    if (!el || paused) return

    // Track the position as a float: scrollLeft rounds, so tiny per-frame steps would be lost.
    let position = el.scrollLeft
    let last = performance.now()
    let frame = requestAnimationFrame(function step(now) {
      if (Math.abs(el.scrollLeft - position) > 1) position = el.scrollLeft // scrolled by hand
      position += ((now - last) / 1000) * AUTO_SCROLL_PX_PER_SECOND
      last = now

      // Distance from the first card to its copy = one full set of cards.
      const items = el.children
      const loopWidth = (items[movies.length] as HTMLElement | undefined)?.offsetLeft ?? 0
      const start = (items[0] as HTMLElement | undefined)?.offsetLeft ?? 0
      if (loopWidth > start && position >= loopWidth - start) position -= loopWidth - start

      el.scrollLeft = position
      frame = requestAnimationFrame(step)
    })
    return () => cancelAnimationFrame(frame)
  }, [paused, movies.length])

  const scrollByPage = (direction: 1 | -1) => {
    const el = scroller.current
    if (!el) return
    el.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
  }

  return (
    <section
      aria-label={title}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setPaused(false)
      }}
    >
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
      <ul ref={scroller} className="-mx-6 flex gap-4 overflow-x-auto px-6 py-4 [scrollbar-width:none]">
        {movies.map((movie) => (
          <li key={movie.id} className="shrink-0">
            <MovieCard movie={movie} />
          </li>
        ))}
        {movies.map((movie) => (
          <li key={`copy-${movie.id}`} className="shrink-0" aria-hidden inert>
            <MovieCard movie={movie} />
          </li>
        ))}
      </ul>
    </section>
  )
}
