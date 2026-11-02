# T09 — Tests for the pure logic

Issue: [#8](https://github.com/knthslai/tmdb-movie-grid/issues/8) · Files: `src/api/tmdb.test.ts`, `src/lib/sortMovies.test.ts`

## Background

- [Vitest API](https://vitest.dev/api/): `describe`, `it`, `expect`, `toEqual`, `toBe`. Import them from `vitest`.
- `npm test` runs once; `npm run test:watch` re-runs on save.
- For URLs, assert on `new URL(result).searchParams.get('...')` rather than the whole string, so param order doesn't matter.

## Steps

1. **URL builder:** one test with every param set, one with none set, one with an edge value I decided on in T02 (like `0`).
2. **Poster helper:** `null` path → `null`.
3. **Sort:** correct order for each option; the input array is unchanged (keep a copy and compare); my rule for missing values.
4. **Prove the tests work.** Break the sort on purpose (flip the comparison) and watch a test fail. Note it on the issue.

## Decisions I make

- Which cases are worth a test, and which aren't? Be ready to say why I didn't test components.

