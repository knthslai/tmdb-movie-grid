import { useState } from 'react'
import { usePersonBio, useSearchPeople } from '../api/useDiscoverMovies'
import { profileUrl, type Actor } from '../api/tmdb'
import { useDebouncedValue } from '../lib/useDebouncedValue'

export function ActorSearch({ onSelect }: { onSelect: (actor: Actor) => void }) {
  const [text, setText] = useState('')
  const [open, setOpen] = useState(false)
  const query = useDebouncedValue(text.trim(), 300)
  const people = useSearchPeople(query)
  const options = text.trim() === '' ? [] : (people.data ?? [])

  return (
    <div className="relative w-full sm:w-64">
      <input
        type="search"
        role="combobox"
        aria-expanded={open && options.length > 0}
        aria-controls="actor-options"
        aria-label="Search movies by actor"
        placeholder="Search by actor"
        value={text}
        onChange={(e) => {
          setText(e.target.value)
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => e.key === 'Escape' && setOpen(false)}
        className="h-9 w-full min-w-0 rounded-full border border-border bg-surface px-4 text-sm placeholder:text-muted focus:border-accent focus:outline-none"
      />
      {open && text.trim() !== '' && (
        <ul
          id="actor-options"
          role="listbox"
          className="absolute left-0 right-0 z-30 mt-1 max-h-80 overflow-auto rounded-card border border-border bg-surface shadow-lg"
        >
          {options.length === 0 ? (
            <li className="px-3 py-2 text-sm text-muted">
              {people.isFetching ? 'Searching…' : 'No actors found'}
            </li>
          ) : (
            options.map((actor) => (
              <li key={actor.id} role="option" aria-selected={false}>
                <button
                  type="button"
                  onClick={() => {
                    onSelect(actor)
                    setText('')
                    setOpen(false)
                  }}
                  className="flex w-full items-center gap-3 px-3 py-2 text-left text-sm hover:bg-surface-raised"
                >
                  <img
                    src={profileUrl(actor.profile_path, 'w92')}
                    alt=""
                    className="h-10 w-8 shrink-0 rounded bg-surface-raised object-cover"
                  />
                  <span className="truncate">{actor.name}</span>
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  )
}

export function ActorBlurb({ actor, onClear }: { actor: Actor; onClear: () => void }) {
  const bio = usePersonBio(actor.id)
  const photo = profileUrl(actor.profile_path)
  const details = bio.data
  return (
    <div className="mt-4 flex gap-4 rounded-card border border-border bg-surface p-3">
      {photo ? (
        <img src={photo} alt={actor.name} className="h-28 w-20 shrink-0 rounded object-cover" />
      ) : (
        <div className="h-28 w-20 shrink-0 rounded bg-surface-raised" />
      )}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h2 className="text-lg font-semibold">{actor.name}</h2>
          <button
            type="button"
            onClick={onClear}
            className="shrink-0 rounded-card border border-border px-2 py-0.5 text-sm hover:bg-surface-raised"
          >
            Clear
          </button>
        </div>
        {(details?.birthday || details?.place_of_birth) && (
          <p className="text-xs text-muted">
            {[details.birthday, details.place_of_birth].filter(Boolean).join(' · ')}
          </p>
        )}
        <p className="mt-1 line-clamp-3 text-sm text-muted">
          {bio.isPending ? 'Loading…' : details?.biography || 'No biography available.'}
        </p>
      </div>
    </div>
  )
}
