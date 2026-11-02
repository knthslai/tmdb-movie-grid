# Discover movies

A small React app that fetches movies from TMDB's `/discover/movie` endpoint and shows them as a grid of cards.

## Run it

```bash
cp .env.example .env.local   # paste the TMDB v3 API key
npm i
npm start                    # opens http://localhost:5173
```

Other scripts: `npm test`, `npm run typecheck`, `npm run lint`, `npm run build`.

## Stack

Vite, React 19, TypeScript, Tailwind CSS v4 (with tw-animate-css for enter animations), TanStack Query, [@lorenzopant/tmdb](https://www.npmjs.com/package/@lorenzopant/tmdb) (typed TMDB client), Vitest.

## Decisions

_To fill in from the actual implementation._

## Trade-offs and limitations

_To fill in._

## What I'd do next

_To fill in._

## How the work is tracked

- Each ticket is a GitHub issue with a spec in [specs/](specs/README.md). The empty files in `src/` contain `TODO(Txx)` comments that map code to tickets; `npm run todo` lists them.
- When I ask Claude Code about a ticket, a hook (`.claude/hooks/ticket-log.mjs`) posts the question and the answer as a comment on that issue. [CLAUDE.md](CLAUDE.md) tells Claude to guide with hints rather than write the code.

## Time spent

| Date | Start | End | Card | Notes |
|---|---|---|---|---|
| 2026-11-02 | | | T00 | Scaffold, issues, specs and TODO stubs made with Claude Code |

