import { SORT_OPTIONS, isSortOption, type Genre } from '../api/tmdb'
import type { ViewState } from '../lib/urlState'

type Props = {
  genres: Genre[]
  value: ViewState
  onChange: (next: ViewState) => void
}

export function Controls({ genres, value, onChange }: Props) {
  const selected = new Set(value.genreIds)

  const toggleGenre = (id: number) => {
    const genreIds = selected.has(id) ? value.genreIds.filter((g) => g !== id) : [...value.genreIds, id]
    onChange({ ...value, genreIds })
  }

  return (
    <div className="flex flex-col gap-4">
      <label className="flex items-center gap-2 text-sm text-muted">
        Sort by
        <select
          className="rounded-card border border-border bg-surface px-3 py-1.5 text-fg"
          value={value.sortBy}
          onChange={(e) => {
            if (isSortOption(e.target.value)) onChange({ ...value, sortBy: e.target.value })
          }}
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <fieldset>
        <legend className="mb-2 text-sm text-muted">
          Genres {value.genreIds.length > 1 && '· movies matching more of your picks come first'}
        </legend>
        <div className="flex flex-wrap gap-2">
          {genres.map((genre) => {
            const active = selected.has(genre.id)
            return (
              <button
                key={genre.id}
                type="button"
                aria-pressed={active}
                onClick={() => toggleGenre(genre.id)}
                className={`rounded-full border px-3 py-1 text-sm motion-safe:transition-colors motion-safe:duration-150 ease-reveal ${
                  active
                    ? 'border-accent bg-accent text-accent-fg'
                    : 'border-border bg-surface text-fg hover:bg-surface-raised'
                }`}
              >
                {genre.name}
              </button>
            )
          })}
          {value.genreIds.length > 0 && (
            <button
              type="button"
              onClick={() => onChange({ ...value, genreIds: [] })}
              className="px-3 py-1 text-sm text-muted underline-offset-4 hover:underline"
            >
              Clear
            </button>
          )}
        </div>
      </fieldset>
    </div>
  )
}
