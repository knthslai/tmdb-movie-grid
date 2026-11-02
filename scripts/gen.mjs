#!/usr/bin/env node
// Small code generator for the repo's usual building blocks. Every file it writes typechecks,
// lints and passes its test as-is, with TODO(gen) markers where the real logic goes.
//
//   npm run gen -- api <name>        fetcher + params mapper appended to src/api/tmdb.ts, plus a test
//   npm run gen -- hook <name>       TanStack Query hook for an existing `gen api` fetcher
//   npm run gen -- feature <name>    api + hook in one go
//   npm run gen -- component <Name>  React component in src/components/
//   npm run gen -- lib <name>        pure function + test in src/lib/
//
// Names can be kebab, camel or Pascal case: movie-details, movieDetails and MovieDetails all work.
// Nothing is overwritten: the generator stops if a file or export with that name already exists.
import { appendFileSync, existsSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const TMDB_FILE = join(root, 'src/api/tmdb.ts')

const USAGE = 'Usage: npm run gen -- <api|hook|feature|component|lib> <name>'

function fail(message) {
  console.error(`gen: ${message}`)
  process.exit(1)
}

// "movie-details" / "movieDetails" / "MovieDetails" → { camel: "movieDetails", pascal: "MovieDetails" }
function toNames(raw) {
  if (!/^[A-Za-z][A-Za-z0-9-]*$/.test(raw)) fail(`"${raw}" is not a valid name (letters, digits and dashes)`)
  const words = raw
    .split('-')
    .flatMap((part) => part.split(/(?=[A-Z])/))
    .filter(Boolean)
    .map((word) => word.toLowerCase())
  const pascal = words.map((word) => word[0].toUpperCase() + word.slice(1)).join('')
  return { camel: pascal[0].toLowerCase() + pascal.slice(1), pascal }
}

const created = []

function writeNew(path, content) {
  if (existsSync(path)) fail(`${relative(root, path)} already exists`)
  writeFileSync(path, content)
  created.push(`created  ${relative(root, path)}`)
}

function genApi({ camel, pascal }) {
  const source = readFileSync(TMDB_FILE, 'utf8')
  if (source.includes(`function fetch${pascal}(`)) fail(`fetch${pascal} already exists in src/api/tmdb.ts`)

  // Appended to tmdb.ts so all TMDB access stays in that one file.
  appendFileSync(
    TMDB_FILE,
    `
// TODO(gen): which TMDB endpoint this wraps, e.g. /movie/{movie_id}
// (https://developer.themoviedb.org/reference/intro/getting-started).
export type ${pascal}Params = {
  // TODO(gen): the params the app passes in, e.g. movieId: number
  page?: number
}

// App params → TMDB request params. Pure, so it can be unit tested.
export function to${pascal}Params({ page = 1 }: ${pascal}Params) {
  return { page }
}

export async function fetch${pascal}(params: ${pascal}Params): Promise<unknown> {
  requireApiKey()
  // TODO(gen): call the client and return its typed response, e.g.
  // return tmdb.movies.details(to${pascal}Params(params))
  throw new Error(\`fetch${pascal} is not implemented yet (\${JSON.stringify(to${pascal}Params(params))})\`)
}
`,
  )
  created.push(`appended src/api/tmdb.ts (${pascal}Params, to${pascal}Params, fetch${pascal})`)

  writeNew(
    join(root, `src/api/${camel}.test.ts`),
    `import { describe, expect, it } from 'vitest'
import { to${pascal}Params } from './tmdb'

describe('to${pascal}Params', () => {
  it('defaults to page 1', () => {
    expect(to${pascal}Params({})).toEqual({ page: 1 })
  })

  // TODO(gen): one case per param mapping rule.
})
`,
  )
}

function genHook({ camel, pascal }) {
  if (!readFileSync(TMDB_FILE, 'utf8').includes(`function fetch${pascal}(`)) {
    fail(`fetch${pascal} not found in src/api/tmdb.ts. Run \`npm run gen -- api ${camel}\` first.`)
  }
  writeNew(
    join(root, `src/api/use${pascal}.ts`),
    `import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { fetch${pascal}, to${pascal}Params, type ${pascal}Params } from './tmdb'

// TODO(gen): what this hook loads. The query key holds the mapped params, so each set of params
// gets its own cache entry. keepPreviousData keeps the old data on screen while new params load.
export function use${pascal}(params: ${pascal}Params = {}) {
  return useQuery({
    queryKey: ['${camel}', to${pascal}Params(params)],
    queryFn: () => fetch${pascal}(params),
    placeholderData: keepPreviousData,
  })
}
`,
  )
}

function genComponent({ pascal }) {
  writeNew(
    join(root, `src/components/${pascal}.tsx`),
    `type Props = {
  // TODO(gen): the props this component needs
  title: string
}

// TODO(gen): what this component shows. Style with the tokens in src/index.css (see DESIGN.md).
export function ${pascal}({ title }: Props) {
  return (
    <section aria-label={title} className="rounded-card bg-surface p-4">
      <h2 className="text-lg font-semibold">{title}</h2>
    </section>
  )
}
`,
  )
}

function genLib({ camel }) {
  writeNew(
    join(root, `src/lib/${camel}.ts`),
    `// TODO(gen): what this pure function does. No React and no fetching here, so it is easy to test.
export function ${camel}<T>(input: T): T {
  return input
}
`,
  )
  writeNew(
    join(root, `src/lib/${camel}.test.ts`),
    `import { describe, expect, it } from 'vitest'
import { ${camel} } from './${camel}'

describe('${camel}', () => {
  it('returns its input', () => {
    expect(${camel}(1)).toBe(1)
  })

  // TODO(gen): the real cases.
})
`,
  )
}

const GENERATORS = {
  api: genApi,
  hook: genHook,
  feature: (names) => {
    genApi(names)
    genHook(names)
  },
  component: genComponent,
  lib: genLib,
}

const [kind, name] = process.argv.slice(2)
if (!kind || !name || !(kind in GENERATORS)) fail(USAGE)

GENERATORS[kind](toNames(name))
console.log(created.join('\n'))
console.log('\nNext: fill in the TODO(gen) markers (`npm run todo` lists them), then run typecheck, lint and test.')
