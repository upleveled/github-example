import { execFileSync } from 'node:child_process';

export function readCommitSubjects(count: number) {
  // %s is the commit subject: the first line of the commit message
  return execFileSync('git', ['log', `--max-count=${count}`, '--format=%s'], {
    encoding: 'utf-8',
  })
    .trim()
    .split('\n');
}
