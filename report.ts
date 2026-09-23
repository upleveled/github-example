import { findSubjectProblems } from './check.ts';

// ESLint reports @typescript-eslint/restrict-plus-operands here, since
// problems is a string[] instead of a string or number
export function formatSubjectReport(subject: string) {
  const problems = findSubjectProblems(subject);

  if (problems.length === 0) {
    return `✅ ${subject}`;
  }

  return `❌ ${subject}\n   ` + problems;
}

export function formatSummary(subjects: string[]) {
  const passing = subjects.filter(
    (subject) => findSubjectProblems(subject).length === 0,
  );

  return `${passing.length}/${subjects.length} commit subjects follow the rules`;
}
