// Title search. TMDB's /search/movie matches movie titles only; searching people, keywords or
// collections is a TODO (see the README).
export function SearchBox({ value, onChange }: { value: string; onChange: (next: string) => void }) {
  return (
    <input
      type="search"
      aria-label="Search movies by title"
      placeholder="Search by title"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-9 w-full min-w-0 rounded-full border border-border bg-surface px-4 text-sm placeholder:text-muted focus:border-accent focus:outline-none sm:w-64"
    />
  )
}
