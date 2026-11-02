# Contributing

A React app that fetches movies from TMDB's `/discover/movie` endpoint and shows them as a grid of cards. See the README for decisions and trade-offs.

## Commands

- `npm start`: dev server on http://localhost:5173
- `npm run typecheck`, `npm run lint`, `npm test`: run all three before committing

## Layout

- `src/api/`: the only code that talks to TMDB (client, types, request params, query hooks)
- `src/lib/`: pure logic (sorting, URL state), covered by tests
- `src/components/`: UI. Styling uses the Tailwind tokens in `src/index.css` (see DESIGN.md)

## Never

- Commit `.env.local` or print the API key.
