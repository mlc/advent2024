import { getNums, readSplit, show, sumBy } from './util.ts';

const parse = (x: string) => getNums(x);

const input = (await readSplit(2, '\n', false)).map(parse);

const isSafe = (a: readonly number[]) => {
  const increasing = a[1] > a[0];
  for (let i = 0; i < a.length - 1; i++) {
    if (a[i + 1] >= a[i] && !increasing) {
      return false;
    } else if (a[i + 1] <= a[i] && increasing) {
      return false;
    } else if (Math.abs(a[i + 1] - a[i]) > 3) {
      return false;
    }
  }
  return true;
};

await show(sumBy(input, isSafe));

const dampen = (a: readonly number[]) => {
  const results: number[][] = [];
  for (let i = 0; i < a.length; i++) {
    results.push([...a.slice(0, i), ...a.slice(i + 1)]);
  }
  return results;
};

const canBeSafe = (a: readonly number[]) => {
  return isSafe(a) || dampen(a).some(isSafe);
};

await show(sumBy(input, canBeSafe));
