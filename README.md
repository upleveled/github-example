# GitHub Example

A simple, naïve commit subject linter for the UpLeveled commit message rules

Running the program without any input checks the last 10 commit subjects:

```bash
$ node index.ts
✅ Add readme with app usage
❌ Update vague verb list
   vague verb "Update", name the changed object and action
```

Entering a number checks that many commit subjects:

```bash
$ node index.ts 3
```

Entering anything else will print an error:

```bash
$ node index.ts abc
Invalid count "abc"
```

## Rules

[`rules.ts`](rules.ts) and [`check.ts`](check.ts) check each subject for:

- more than 72 characters
- a trailing period
- a lowercase verb, eg. `fix the CI workflow`
- a vague verb, eg. `Refine stuff`
- a present-tense verb, eg. `Adds a git log reader`

The commit history of this repo contains subjects which break these rules on purpose, so the program has something to report.

### Naïve parts

The checks are string matching, not grammar:

- the verb is whatever comes before the first space, matched against a fixed word list in [`rules.ts`](rules.ts)
- a present-tense verb is detected as a known imperative verb plus an `s`, so `Implements` passes
- the rules which need judgement are not checked at all: whether the subject names the concrete changed object and action, and whether it explains why
- only the subject is checked, never the commit message body

## Setup

```bash
pnpm install
```

ESLint, Prettier and TypeScript configuration comes from [UpLeveled ESLint Config](https://github.com/upleveled/eslint-config-upleveled).

## CI

[`.github/workflows/ci.yml`](.github/workflows/ci.yml) runs TypeScript type checking (`pnpm tsc`) and linting (`pnpm eslint . --max-warnings 0`) on every push.

CI fails on purpose: `formatSubjectReport()` in [`report.ts`](report.ts) concatenates `problems` (a `string[]`) onto a string instead of joining it, which ESLint reports as `@typescript-eslint/restrict-plus-operands`. Fixing this is the target of a pull request.
