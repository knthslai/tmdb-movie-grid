# T01 — Scope and assumptions

Issue: [#2](https://github.com/knthslai/tmdb-movie-grid/issues/2) · Implementation mode: Human

## The brief (from Robyn's email)

- Fetch movies from TMDB `/discover/movie`. The first page of results is enough.
- Apply **one filter** in the API request, e.g. genre or release year.
- **Sort** the results by a method and property of my choosing.
- Show a **grid of cards**: poster, title, one other property, and one interactive element (e.g. hover).
- `npm i && npm start` must run it.
- Optional: responsive grid, filter/sort UI, CSS transitions, size cards by rating, alternate layout, any CSS library.
- A few hours. Tell Robyn at the 4-hour mark. Ideally sent by Nov 9.
- Review: Sinclair (growth lead) and Franzi (core lead). Expect a live extension with as little AI as possible.

## Decisions I make here (write them on the issue with a reason)

1. **Filter.** Options: genre (`with_genres`, needs genre ids), release year (`primary_release_year`), minimum rating (`vote_average.gte`), language (`with_original_language`). Ask: which is easiest to make into a UI control? Which makes the follow-up "add a second filter" easiest?
2. **Sort: server or client?**
   - Server: `sort_by=vote_average.desc` sorts all of TMDB, and the API returns the top 20.
   - Client: sort the 20 results I already have.
   - These give different answers. Which one matches "sort by a method of my choosing"? Could I do both and explain the difference?
3. **Extras.** Pick at most two optional items for the time budget. A growth team will care about states that are linkable and measurable: URL state is a strong pick.
4. **Out of scope.** Write down what I'm deliberately not building (pagination, search, auth, server proxy) so I can talk about it.

## Done when

- [ ] Decisions are written on the issue
- [ ] Acceptance criteria on T02–T06 are confirmed or edited
