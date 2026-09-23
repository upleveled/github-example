# GitHub Example

A simple, naïve commit subject linter for the UpLeveled commit message rules

Running the program without any input checks the last 10 commit subjects:

```bash
$ node index.ts
✅ Add readme with app usage
❌ Update vague verb list
   vague verb "Update", name the changed object and action
✅ Add GitHub Actions CI with TypeScript and ESLint checks
❌ Adds git log reader and commit subject report
   present-tense verb "Adds", use "Add"
✅ Add commit subject rules and problem checks
✅ Add Node.js project with ESLint config from eslint-config-upleveled

4/6 commit subjects follow the rules
```

Entering a number checks that many commit subjects:

```bash
$ node index.ts 3
✅ Add readme with app usage
❌ Update vague verb list
   vague verb "Update", name the changed object and action
✅ Add GitHub Actions CI with TypeScript and ESLint checks

2/3 commit subjects follow the rules
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

### CI failure logs

GitHub Actions logs expire, so the failing `Lint with ESLint` step from [run 35921305065](https://github.com/upleveled/github-example/actions/runs/35921305065) is copied here:

```
##[group]Run pnpm eslint . --max-warnings 0
pnpm eslint . --max-warnings 0
shell: /usr/bin/bash -e {0}
env:
  PNPM_HOME: /home/runner/setup-pnpm/node_modules/.bin
##[endgroup]
Pages directory cannot be found at /home/runner/work/github-example/github-example/pages or /home/runner/work/github-example/github-example/src/pages. If using a custom path, please configure with the `no-html-link-for-pages` rule in your eslint config file.

/home/runner/work/github-example/github-example/report.ts
##[error]  12:32  error  Invalid operand for a '+' operation. Operands must each be a number or string, allowing a string + any of: `any`, `boolean`, `null`, `RegExp`, `undefined`. Got `string[]`  @typescript-eslint/restrict-plus-operands

✖ 1 problem (1 error, 0 warnings)

##[error]Process completed with exit code 1.
```
