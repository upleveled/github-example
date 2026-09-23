import { readCommitSubjects } from './gitLog.ts';
import { formatSubjectReport, formatSummary } from './report.ts';

const countArgument = process.argv[2];

// If the user hasn't chosen a count, check the last 10 commit subjects
const count = countArgument === undefined ? 10 : Number(countArgument);

if (!Number.isInteger(count) || count < 1) {
  // If the user-chosen count is not a positive integer, print an error
  console.log(`Invalid count "${countArgument}"`);
} else {
  const subjects = readCommitSubjects(count);

  for (const subject of subjects) {
    console.log(formatSubjectReport(subject));
  }

  console.log(`\n${formatSummary(subjects)}`);
}
