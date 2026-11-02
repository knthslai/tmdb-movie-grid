# Specs

One spec per ticket. The **issue** holds status, the checklist and the discussion. The **spec** holds what I need to know to build it: background, a step-by-step path, edge cases, and the decisions I have to make myself.

| Ticket | Issue | Spec |
|---|---|---|
| T00 Scaffold and tooling | [#1](https://github.com/knthslai/tmdb-movie-grid/issues/1) | [T00-scaffold.md](T00-scaffold.md) |
| T01 Scope and assumptions | [#2](https://github.com/knthslai/tmdb-movie-grid/issues/2) | [T01-scope.md](T01-scope.md) |
| T02 TMDB client, types and params | [#3](https://github.com/knthslai/tmdb-movie-grid/issues/3) | [T02-tmdb-api.md](T02-tmdb-api.md) |
| T03 Data hook | [#4](https://github.com/knthslai/tmdb-movie-grid/issues/4) | [T03-data-hook.md](T03-data-hook.md) |
| T04 Movie card | [#5](https://github.com/knthslai/tmdb-movie-grid/issues/5) | [T04-movie-card.md](T04-movie-card.md) |
| T05 Grid and page states | [#6](https://github.com/knthslai/tmdb-movie-grid/issues/6) | [T05-grid-states.md](T05-grid-states.md) |
| T06 Filter, sort, URL state | [#7](https://github.com/knthslai/tmdb-movie-grid/issues/7) | [T06-controls.md](T06-controls.md) |
| T07 Size by rating | [#11](https://github.com/knthslai/tmdb-movie-grid/issues/11) | [T07-size-by-rating.md](T07-size-by-rating.md) |
| T08 Transitions and layout | [#12](https://github.com/knthslai/tmdb-movie-grid/issues/12) | [T08-polish.md](T08-polish.md) |
| T09 Tests | [#8](https://github.com/knthslai/tmdb-movie-grid/issues/8) | [T09-tests.md](T09-tests.md) |
| T10 README | [#9](https://github.com/knthslai/tmdb-movie-grid/issues/9) | [T10-readme.md](T10-readme.md) |
| T12 Send | [#10](https://github.com/knthslai/tmdb-movie-grid/issues/10) | checklist on the issue |
| D1–D7 Drills | [#13–#19](https://github.com/knthslai/tmdb-movie-grid/issues?q=is%3Aissue+label%3Adrill) | [drills.md](drills.md) |

## How I work a ticket

1. Move the card to **Building** (one at a time). Create the branch: `git switch -c task/t02-tmdb-api`. The branch name links my Claude questions to the issue.
2. Read the spec. Rewrite the acceptance criteria on the issue if I disagree with them.
3. Build it myself, following the spec's steps. Ask Claude when stuck. Every exchange is posted to the issue automatically.
4. Run the checks in the spec. Commit with the ticket id in the message (`feat: discover params and genre join (T02)`).
5. Move the card to **Verify and understand**. Work through the Done gate on the issue, then move it to **Done** by hand.

