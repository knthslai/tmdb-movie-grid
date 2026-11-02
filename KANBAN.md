# Board

Single source of truth for task status. Move a bullet when its status changes and update its card.
Limits: one card in Building, one in Verify at a time.

Time budget: a few hours total. At the 4-hour mark, tell Robyn. Target send date: Nov 9.

## Backlog
- T07 — Card size by rating (optional) [Human; Unreviewed]
- T08 — Transitions and alternate layout (optional) [Human; Unreviewed]

## Ready
- T01 — Confirm scope, assumptions and these cards [Human; Unreviewed]
- T02 — TMDB types and discover URL builder [Human; Unreviewed]
- T03 — Data hook with loading, error and empty states [Human; Unreviewed]
- T04 — Movie card [Human; Unreviewed]
- T05 — Responsive grid and page states [Human; Unreviewed]
- T06 — Filter and sort controls, state in the URL [Human; Unreviewed]
- T09 — Tests for the pure logic [Human; Unreviewed]
- T10 — README: decisions, time log, AI usage [Human; Unreviewed]
- T11 — Rehearse live extensions without AI [Human; Unreviewed]
- T12 — Publish repo and send the link [Human; Unreviewed]

## Building
- None

## Verify and understand
- T00 — Scaffold, tooling and draft board [AI-implemented; Unreviewed]

## Done
- None

## Time log

| Date | Start | End | Card | Notes |
|---|---|---|---|---|
| 2026-11-02 | | | T00 | Scaffold and draft board made with Claude Code |

---

## Cards

Acceptance criteria below are drafted from the assignment email. T01 is where I confirm or rewrite them before building.

## T00 — Scaffold, tooling and draft board
Status: Verify and understand
Implementation mode: AI-implemented
Understanding: Unreviewed
Priority: Required
Code reference: dcfb835 (create-vite output), 98d13b8 (tooling)

### Outcome
`npm i && npm start` opens an empty page with Tailwind and TanStack Query ready. No feature logic.

### Understanding check
- Can explain why `start` maps to `vite` (dev server) rather than a production build:
- Can explain where the API key comes from at runtime (`import.meta.env`, `.env.local`) and why it still ends up in the browser bundle:
- Can explain what `QueryClientProvider` provides and what the default `staleTime` is:

### AI involvement
Claude Code ran create-vite, added Tailwind, TanStack Query and Vitest, wrote `env.d.ts`, `.env.example` and the `start`/`test`/`typecheck` scripts, removed the demo app, and drafted this board and the README skeleton.

## T01 — Confirm scope, assumptions and these cards
Status: Ready
Implementation mode: Human
Understanding: Unreviewed
Priority: Required

### Outcome
I know what "done" means and what I am deliberately not building.

### Requirements from the brief
- Repo runs with `npm i && npm start`.
- Fetch `/discover/movie`; the first page is enough.
- Apply one filter in the API request (e.g. genre, release year).
- Sort by a method and property of my choice.
- Grid of cards: poster, title, one extra property, one interactive element (e.g. hover).
- Optional: responsive grid, filter/sort UI, CSS transitions, size by rating, alternate layout, any CSS library.

### Decisions to make here
- Which filter (genre via `with_genres`, year via `primary_release_year`, ...).
- Sort on the server (`sort_by`) or the client (sort the fetched page). Note the trade-off: a client sort only reorders 20 results.
- Which extras, given the time budget.

## T02 — TMDB types and discover URL builder
Status: Ready
Implementation mode: Human
Understanding: Unreviewed
Priority: Required
Depends on: T01
Files: src/api/tmdb.ts

### Acceptance criteria
- `Movie` and `DiscoverResponse` types cover the fields the UI uses; `poster_path` is nullable.
- One function builds the discover URL from typed params (filter, sort, page). Unset params are omitted.
- One function builds a poster URL from `poster_path` and a size, or returns null.
- No React in this file.

## T03 — Data hook with loading, error and empty states
Status: Ready
Implementation mode: Human
Understanding: Unreviewed
Priority: Required
Depends on: T02
Files: src/api/useDiscoverMovies.ts

### Acceptance criteria
- Uses TanStack Query; the query key includes every param, so changing a filter refetches.
- Non-2xx responses throw, so the error state renders.
- A missing API key produces a readable error, not a silent empty grid.

## T04 — Movie card
Status: Ready
Implementation mode: Human
Understanding: Unreviewed
Priority: Required
Depends on: T02
Files: src/components/MovieCard.tsx

### Acceptance criteria
- Shows poster, title and one extra property (rating or release year).
- Missing poster shows a placeholder with the same aspect ratio, so the grid doesn't jump.
- One interactive element: hover/focus reveals the overview (keyboard focus works too).
- Pure component: props in, markup out.

## T05 — Responsive grid and page states
Status: Ready
Implementation mode: Human
Understanding: Unreviewed
Priority: Required
Depends on: T03, T04
Files: src/components/MovieGrid.tsx, src/App.tsx

### Acceptance criteria
- Grid reflows from one column on a phone to many on desktop without media-query sprawl.
- Loading, error (with retry) and empty states each render something deliberate.

## T06 — Filter and sort controls, state in the URL
Status: Ready
Implementation mode: Human
Understanding: Unreviewed
Priority: Required
Depends on: T05
Files: src/components/Controls.tsx, src/lib/sortMovies.ts

### Acceptance criteria
- Changing the filter changes the API request.
- Sorting never mutates the fetched array (`toSorted` or a copy).
- Filter and sort live in the URL query string, so a reload or a shared link keeps them.

## T07 — Card size by rating (optional)
Status: Backlog
Implementation mode: Human
Priority: Optional
Depends on: T05

## T08 — Transitions and alternate layout (optional)
Status: Backlog
Implementation mode: Human
Priority: Optional
Depends on: T05

## T09 — Tests for the pure logic
Status: Ready
Implementation mode: Human
Understanding: Unreviewed
Priority: Required
Depends on: T02, T06
Files: src/api/tmdb.test.ts, src/lib/sortMovies.test.ts

### Acceptance criteria
- URL builder: params present and omitted.
- Sort: order is correct and the input array is unchanged.
- At least one test fails if I break the code on purpose.

## T10 — README: decisions, time log, AI usage
Status: Ready
Implementation mode: Human
Understanding: Unreviewed
Priority: Required
Depends on: all required cards
Files: README.md

## T11 — Rehearse live extensions without AI
Status: Ready
Implementation mode: Human
Priority: Required
Depends on: T10

Drills, 15–20 minutes each, with AI completion off:
- "Load more" or pagination with the `page` param.
- Debounced title search (`/search/movie`).
- A second filter combined with the first.
- Favourites persisted in `localStorage`.
- Details modal on card click.
- Explain: query key, `toSorted` vs `sort`, how the grid stays responsive, and what changes if the key must stay secret (backend proxy).

## T12 — Publish repo and send the link
Status: Ready
Implementation mode: Human
Priority: Required
Depends on: T10

- Confirm `.env.local` is not tracked (`git ls-files | grep env`).
- Fresh clone, `npm i && npm start`, works.
- Push to a public GitHub repo; reply to Robyn with the link and total time spent.
