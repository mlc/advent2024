import { readSplit, show, sumBy } from './util.ts';

const [towelsStr, patternsStr] = await readSplit(19, '\n\n', false);

const towels = towelsStr.split(', ');
const patterns = patternsStr.split('\n');

const possible = (pattern: string): boolean => {
  if (pattern === '') {
    return true;
  } else {
    return towels.some((towel) =>
      pattern.startsWith(towel) && possible(pattern.substring(towel.length))
    );
  }
};

await show(sumBy(patterns, possible));

const memo = new Map<string, number>();
memo.set('', 1);

const count = (pattern: string): number => {
  if (memo.has(pattern)) {
    return memo.get(pattern)!;
  }
  const result = sumBy(towels, (towel) => {
    if (pattern.startsWith(towel)) {
      return count(pattern.substring(towel.length));
    } else {
      return 0;
    }
  });
  memo.set(pattern, result);
  return result;
};

await show(sumBy(patterns, count));
