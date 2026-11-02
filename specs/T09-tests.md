# T09 — Tests for the pure logic

Issue: [#8](https://github.com/knthslai/tmdb-movie-grid/issues/8) · Files: `src/api/tmdb.test.ts`, `src/lib/sortMovies.test.ts`

## Background

- [Vitest API](https://vitest.dev/api/): `describe`, `it`, `expect`, `toEqual`, `toBe`. Import them from `vitest`.
- `npm test` runs once; `npm run test:watch` re-runs on save.

## Steps

1. **Genre param:** no genres → `undefined`; several ids → joined with my separator; same ids in another order → same value.
2. **Poster helper:** missing path → my "no poster" value.
   Type tests for the TMDB types live in T02 (`tmdb.test-d.ts`).
3. **Sort:** correct order for each option; the input array is unchanged (keep a copy and compare); my rule for missing values.
4. **Prove the tests work.** Break the sort on purpose (flip the comparison) and watch a test fail. Note it on the issue.

## Decisions I make

- Which cases are worth a test, and which aren't? Be ready to say why I didn't test components.

