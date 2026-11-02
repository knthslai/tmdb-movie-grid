# T07 — Card size by rating (optional)

Issue: [#11](https://github.com/knthslai/tmdb-movie-grid/issues/11)

Only start this if T01–T06 and T09 are done inside the time budget.

## Background

- `grid-column: span 2` / `grid-row: span 2` makes a card take more cells. In Tailwind: `col-span-2`, `row-span-2`.
- `grid-auto-flow: dense` (`grid-flow-dense`) backfills the holes that large cards leave.
- With `auto-fill` columns, a phone may have only one column, so `span 2` would overflow.

## Steps

1. Write a small pure function from `vote_average` to a size (for example, `'lg' | 'md' | 'sm'`). Choose thresholds and write them down.
2. Map the size to classes in the card or grid.
3. Test at phone width. Disable spans when there's only one or two columns (a media query or container query).

