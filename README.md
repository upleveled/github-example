# GitHub Example

A simple, naïve commit subject linter for the UpLeveled commit message rules

Running the program without any input checks the last 10 commit subjects:

```bash
$ node index.ts

  ✔  Trim readme CI logs, refresh program output transcripts
  ✔  Switch commit subject report to rule names, symbols and color
  ✔  Add .stackblitzrc from the command line cheatsheet
  ✔  Add CI failure logs and real program output to readme
  ✔  Add readme with app usage
  ✖  Update vague verb list
     no-vague-verb  Verb "Update" is vague, name the changed object and action
  ✔  Add GitHub Actions CI with TypeScript and ESLint checks
  ✖  Adds git log reader and commit subject report
     imperative-verb  Verb "Adds" is present tense, use "Add"
  ✔  Add commit subject rules and problem checks
  ✔  Add Node.js project with ESLint config from eslint-config-upleveled

  Checked 10 commit subjects: 8 passed, 2 failed
```

Entering a number checks that many commit subjects:

```bash
$ node index.ts 6

  ✔  Trim readme CI logs, refresh program output transcripts
  ✔  Switch commit subject report to rule names, symbols and color
  ✔  Add .stackblitzrc from the command line cheatsheet
  ✔  Add CI failure logs and real program output to readme
  ✔  Add readme with app usage
  ✖  Update vague verb list
     no-vague-verb  Verb "Update" is vague, name the changed object and action

  Checked 6 commit subjects: 5 passed, 1 failed
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

CI fails on purpose: `formatSubjectReport()` in [`report.ts`](report.ts) concatenates the mapped problems (a `string[]`) onto a string instead of joining them, which ESLint reports as `@typescript-eslint/restrict-plus-operands`. Fixing this is the target of a pull request.

### CI failure logs

GitHub Actions logs expire, so the relevant lines of the failing `Lint with ESLint` step from [run 35922092102](https://github.com/upleveled/github-example/actions/runs/35922092102) are copied here:

```
$ pnpm eslint . --max-warnings 0

/home/runner/work/github-example/github-example/report.ts
  18:50  error  Invalid operand for a '+' operation. Operands must each be a number or string, allowing a string + any of: `any`, `boolean`, `null`, `RegExp`, `undefined`. Got `string[]`  @typescript-eslint/restrict-plus-operands

✖ 1 problem (1 error, 0 warnings)
Process completed with exit code 1.
```
