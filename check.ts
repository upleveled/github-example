import { imperativeVerbs, maxSubjectLength, vagueVerbs } from './rules.ts';

export function findSubjectProblems(subject: string) {
  const verb = subject.split(' ')[0];

  if (!verb) {
    throw new Error('Commit subject is empty');
  }

  const problems = [];

  if (subject.length > maxSubjectLength) {
    problems.push(`${subject.length} characters, max is ${maxSubjectLength}`);
  }

  if (subject.endsWith('.')) {
    problems.push('ends with a period');
  }

  if (!/^[A-Z]/.test(verb)) {
    problems.push(`lowercase verb "${verb}"`);
  }

  if (vagueVerbs.includes(verb)) {
    problems.push(`vague verb "${verb}", name the changed object and action`);
  }

  // Present-tense verbs like "Adds" are the imperative verb plus an "s"
  if (verb.endsWith('s') && imperativeVerbs.includes(verb.slice(0, -1))) {
    problems.push(`present-tense verb "${verb}", use "${verb.slice(0, -1)}"`);
  }

  return problems;
}
