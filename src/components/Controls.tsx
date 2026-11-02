import { SORT_OPTIONS, type Genre } from '../api/tmdb'
import type { ViewState } from '../lib/urlState'

type Props = {
  genres: Genre[]
  value: ViewState
  onChange: (next: ViewState) => void
}

const chip = (active: boolean) =>
  `shrink-0 rounded-full border px-3 py-1 text-sm motion-safe:transition-colors motion-safe:duration-150 ease-reveal ${
    active ? 'border-accent bg-accent text-accent-fg' : 'border-border bg-surface text-fg hover:bg-surface-raised'
  }`

// One line: the genre chips (they scroll sideways with a visible scrollbar; "All" clears the
// filter), and the sort on the right as a segmented control (all three options visible, one click
// to switch).
export function Controls({ genres, value, onChange }: Props) {
  const selected = new Set(value.genreIds)

  const toggleGenre = (id: number) => {
    const genreIds = selected.has(id) ? value.genreIds.filter((g) => g !== id) : [...value.genreIds, id]
    onChange({ ...value, genreIds })
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-start gap-3">
        <div
          role="group"
          aria-label="Genres"
          className="flex min-w-0 grow basis-full gap-2 overflow-x-auto pt-1 pb-2 [scrollbar-color:var(--color-border)_transparent] [scrollbar-width:thin] sm:basis-0"
        >
          <button
            type="button"
            aria-pressed={selected.size === 0}
            onClick={() => onChange({ ...value, genreIds: [] })}
            className={chip(selected.size === 0)}
          >
            All
          </button>
          {genres.map((genre) => (
            <button
              key={genre.id}
              type="button"
              aria-pressed={selected.has(genre.id)}
              onClick={() => toggleGenre(genre.id)}
              className={chip(selected.has(genre.id))}
            >
              {genre.name}
            </button>
          ))}
        </div>

        <div role="group" aria-label="Sort by" className="flex shrink-0 rounded-full border border-border bg-surface p-1">
          {SORT_OPTIONS.map((option) => {
            const active = option.value === value.sortBy
            return (
              <button
                key={option.value}
                type="button"
                aria-pressed={active}
                onClick={() => onChange({ ...value, sortBy: option.value })}
                className={`rounded-full px-3 py-1 text-sm motion-safe:transition-colors motion-safe:duration-150 ease-reveal ${
                  active ? 'bg-accent text-accent-fg' : 'text-muted hover:text-fg'
                }`}
              >
                {option.label}
              </button>
            )
          })}
        </div>
      </div>

      {value.genreIds.length > 1 && (
        <p className="text-xs text-muted">Movies matching more of your genres come first.</p>
      )}
    </div>
  )
}
