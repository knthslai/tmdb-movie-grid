# T04 — Movie card

Issue: [#5](https://github.com/knthslai/tmdb-movie-grid/issues/5) · File: `src/components/MovieCard.tsx`

## Background

- TMDB posters are 2:3. The Tailwind `aspect-[2/3]` class or CSS `aspect-ratio: 2 / 3` reserves the space before the image loads.
- `loading="lazy"` on `<img>` defers off-screen posters.
- Hover-only content is invisible to keyboard users. Tailwind's `group`, `group-hover:` and `group-focus-within:` (or `focus-visible:`) cover both.
- `alt` text: the movie title is enough.

## Steps

1. **Props.** Decide the props: the whole `Movie`, or only the fields the card uses? Write the type.
2. **Static markup.** Poster, title, one extra property (rating to one decimal, or release year). Render it with one hardcoded movie in `App.tsx` first.
3. **Missing poster.** Render a placeholder block with the same aspect ratio. Checkpoint: pass `poster_path: null` and check the layout doesn't jump.
4. **Interaction.** Reveal the overview on hover **and** keyboard focus. Checkpoint: Tab through the cards with no mouse.
5. **Long titles.** Try a very long title. Clamp it with `line-clamp-2` or let it wrap, deliberately.

## Edge cases

- Empty `overview`.
- `release_date` of `""`.
- `vote_average` of `0` with `vote_count` of `0`: show "No rating" rather than "0.0"?

## Decisions I make

- Is the card focusable (`tabIndex={0}`, or a `<button>`/`<a>`)? What does clicking it do, if anything?

