import { imperativeVerbs, maxSubjectLength, vagueVerbs } from './rules.ts';

export type Problem = {
  rule: string;
  message: string;
};

export function findSubjectProblems(subject: string) {
  const verb = subject.split(' ')[0];

  if (!verb) {
    throw new Error('Commit subject is empty');
  }

  const problems: Problem[] = [];

  if (subject.length > maxSubjectLength) {
    problems.push({
      rule: 'max-subject-length',
      message: `Subject is ${subject.length} characters, max is ${maxSubjectLength}`,
    });
  }

  if (subject.endsWith('.')) {
    problems.push({
      rule: 'no-trailing-period',
      message: 'Subject ends with a period',
    });
  }

  if (!/^[A-Z]/.test(verb)) {
    problems.push({
      rule: 'capitalized-verb',
      message: `Verb "${verb}" is lowercase`,
    });
  }

  if (vagueVerbs.includes(verb)) {
    problems.push({
      rule: 'no-vague-verb',
      message: `Verb "${verb}" is vague, name the changed object and action`,
    });
  }

  // Present-tense verbs like "Adds" are the imperative verb plus an "s"
  if (verb.endsWith('s') && imperativeVerbs.includes(verb.slice(0, -1))) {
    problems.push({
      rule: 'imperative-verb',
      message: `Verb "${verb}" is present tense, use "${verb.slice(0, -1)}"`,
    });
  }

  return problems;
}
