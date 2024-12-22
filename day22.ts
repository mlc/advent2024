import { readSplit, show, sumBy } from './util.ts';
import { slidingWindows } from '@std/collections';
import { MultiSet } from 'mnemonist';

const parse = (x: string) => parseInt(x, 10);

const input = (await readSplit(22, '\n', false)).map(parse);

const mixPrune = (a: number, b: number) => (a ^ b) & 16777215;

const next = (n: number) => {
  const s1 = mixPrune(n, n * 64);
  const s2 = mixPrune(s1, Math.floor(s1 / 32));
  return mixPrune(s2, s2 * 2048);
};

const steps = (n: number, i: number = 2000) => {
  let result = n;
  for (let j = 0; j < i; j++) {
    result = next(result);
  }
  return result;
};

await show(sumBy(input, (n) => steps(n)));

const allPrices = (n: number, i: number = 2000) => {
  const result = [n % 10];
  let s = n;
  for (let j = 0; j < i; j++) {
    s = next(s);
    result.push(s % 10);
  }
  return result;
};

const diffs = (ns: number[]): (number | undefined)[] =>
  ns.map((n, i) => (i === 0 ? undefined : n - ns[i - 1]));

interface M {
  ps: number[];
  ds: (number | undefined)[];
  vals: Map<string, number>;
}

const monkeys: M[] = input.map((n) => {
  const ps = allPrices(n);
  const ds = diffs(ps);
  const vals = new Map<string, number>();
  const wins = slidingWindows(ds, 4);
  wins.forEach((win, i) => {
    if (i === 0) {
      return;
    }
    const key = win.join(',');
    if (vals.has(key)) {
      return;
    }
    vals.set(key, ps[i + 3]);
  });
  return { ps, ds, vals };
});

const prices = new MultiSet<string>();

for (const { vals } of monkeys) {
  for (const [k, price] of vals.entries()) {
    prices.add(k, price);
  }
}

await show(prices.top(1)[0][1]);
