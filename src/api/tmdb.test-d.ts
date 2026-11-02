// T02 — Type tests for my TMDB types (checked by the compiler, never run)
// Issue: https://github.com/knthslai/tmdb-movie-grid/issues/3 · Spec: specs/T02-tmdb-api.md
// Empty stub with TODO tags, created by Claude Code. The assertions are mine to write.
// Run: npm run test:types
import { describe, it } from 'vitest'

describe('TMDB types', () => {
  // TODO(T02): replace each it.todo with expectTypeOf assertions (or @ts-expect-error)
  it.todo('Movie has exactly the fields I picked')
  it.todo('poster_path accepts undefined; the poster helper returns my "no poster" value')
  it.todo('release_date is a string, not a Date')
  it.todo('params reject a sort value TMDB does not support')
  it.todo('the genre param function returns string | undefined')
})
