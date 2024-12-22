import { readSplit, show, sumBy } from './util.ts';

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

type M = { ps: number[]; ds: (number | undefined)[] };

const monkeys: M[] = input.map((n) => {
  const ps = allPrices(n);
  return { ps, ds: diffs(ps) };
});

const eq = (as: number[], bs: (number | undefined)[], offset: number) => {
  for (let i = 0; i < as.length; i++) {
    if (as[i] !== bs[i + offset]) {
      return false;
    }
  }
  return true;
};

const value = ({ ps, ds }: M, seq: number[]) => {
  for (let i = 1; i < ds.length; i++) {
    if (eq(seq, ds, i)) {
      return ps[i + seq.length - 1];
    }
  }
  return 0;
};

// console.log(diffs(allPrices(123, 10)));

//console.log(monkeys.map(m => value(m, [-2,1,-1,3])))
let best = 0;
for (let a = -9; a <= 9; ++a) {
  for (let b = -9; b <= 9; ++b) {
    console.log({ a, b });
    for (let c = -9; c <= 9; ++c) {
      for (let d = -9; d <= 9; ++d) {
        const seq = [a, b, c, d];
        const trial = sumBy(monkeys, (m) => value(m, seq));
        best = Math.max(trial, best);
      }
    }
  }
}

await show(best);
