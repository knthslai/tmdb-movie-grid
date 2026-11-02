# Design

Tokens live in one place: the `@theme` block in [src/index.css](src/index.css). Components use the utilities Tailwind generates from them and never hard-code colors or hex values. To change the look, change a token.

## Look

A dark, poster-first page. The posters carry the color, so the interface stays neutral and warm-gray, with one amber accent.

## Tokens

| Token | Utility | Use for |
|---|---|---|
| `--color-bg` | `bg-bg` | Page background (already set on `html`) |
| `--color-surface` | `bg-surface` | Cards, controls, poster placeholder |
| `--color-surface-raised` | `bg-surface-raised` | Hover/overlay layer, e.g. the overview reveal |
| `--color-border` | `border-border` | Hairline borders and dividers |
| `--color-fg` | `text-fg` | Primary text (already set on `html`) |
| `--color-muted` | `text-muted` | Secondary text: year, vote count, labels |
| `--color-accent` | `text-accent`, `bg-accent`, `ring-accent` | Rating, active control, focus ring (set globally on `:focus-visible`) |
| `--color-accent-fg` | `text-accent-fg` | Text on an accent background |
| `--color-danger` | `text-danger` | Error state |
| `--radius-card` | `rounded-card` | Cards, poster, controls |
| `--aspect-poster` | `aspect-poster` | Poster and its placeholder (TMDB posters are 2:3) |
| `--ease-reveal` | `ease-reveal` | Hover/focus transitions |

Spacing, font sizes and breakpoints use Tailwind's defaults.

## Rules

- Text contrast: `text-fg` and `text-muted` on `bg-bg` or `bg-surface` both pass WCAG AA. Don't put `text-muted` on `bg-surface-raised` for small text without checking.
- One accent. Don't add a second accent color for decoration.
- No gradients over the whole card, no glass/blur cards, no stacked shadows. A poster overlay may use a single dark scrim so text stays readable.
- Motion: transitions 150–250 ms with `ease-reveal`, and wrapped in `motion-safe:` so reduced-motion users get none.
- Enter animations come from [tw-animate-css](https://github.com/Wombosvideo/tw-animate-css): compose `animate-in` with effects such as `fade-in`, `slide-in-from-bottom-2` or `zoom-in-95`, plus `duration-*` and `ease-reveal`. Always prefix with `motion-safe:`. `animate-pulse` (built into Tailwind) is for loading skeletons.
- Every interactive element shows the focus ring; don't remove `outline` without a replacement.
