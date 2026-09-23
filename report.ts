import { styleText } from 'node:util';
import { findSubjectProblems, type Problem } from './check.ts';

function formatProblem(problem: Problem) {
  return `     ${styleText('yellow', problem.rule)}  ${problem.message}`;
}

// ESLint reports @typescript-eslint/restrict-plus-operands here, since the
// mapped problems are a string[] instead of a string
export function formatSubjectReport(subject: string) {
  const problems = findSubjectProblems(subject);

  if (problems.length === 0) {
    return `  ${styleText('green', '✔')}  ${styleText('dim', subject)}`;
  }

  return (
    `  ${styleText('red', '✖')}  ${subject}\n` + problems.map(formatProblem)
  );
}

export function formatSummary(subjects: string[]) {
  const failed = subjects.filter(
    (subject) => findSubjectProblems(subject).length > 0,
  ).length;

  return `  Checked ${subjects.length} commit subjects: ${styleText('green', `${subjects.length - failed} passed`)}, ${styleText('red', `${failed} failed`)}`;
}
