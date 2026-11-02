# T00 — Scaffold and tooling

Issue: [#1](https://github.com/knthslai/tmdb-movie-grid/issues/1)

## Walkthrough (about 20 minutes)

1. **`package.json` scripts.** Read each script. Run `npm start` and note which port opens. Question: why `vite` and not `vite build && vite preview`?
2. **`vite.config.ts`.** Two plugins: React (JSX + fast refresh) and Tailwind. Question: what would break if I removed `tailwindcss()`?
3. **`src/main.tsx`.** Find `QueryClientProvider`. Look up the defaults in the [TanStack Query "Important Defaults" page](https://tanstack.com/query/latest/docs/framework/react/guides/important-defaults): `staleTime`, `gcTime`, retries, refetch on window focus. Write them on the issue in my own words.
4. **The API key.** Open `src/env.d.ts` and `.env.example`. Read [Vite env variables](https://vite.dev/guide/env-and-mode). Question: why does the variable need the `VITE_` prefix, and what does that mean for secrecy once the app is built?
5. **`tsc -b` vs Vite.** Vite strips types and doesn't type-check. Run `npm run typecheck` with a deliberate type error to see the difference.
6. **Editor.** Review completion and formatting settings in `.zed/settings.json`.

## Practice changes

Pick one:
- Change the dev server port in `vite.config.ts`.
- Set a global `staleTime` on the `QueryClient` and explain the effect.
