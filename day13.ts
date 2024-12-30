import { getBigNums, readSplit, show } from './util.ts';

type Coord = [bigint, bigint];

interface Game {
  a: Coord;
  b: Coord;
  x: Coord;
}

const parse = (xs: string): Game => {
  const [a, b, x] = xs.split('\n').map((s) => getBigNums(s) as Coord);
  return { a, b, x };
};

const input = (await readSplit(13, '\n\n', false)).map(parse);

const bigSumBy = <T>(as: T[], f: (elt: T, index: number) => bigint) =>
  as.reduce((a, x, idx) => a + f(x, idx), 0n);

const spend = ({ a, b, x }: Game): bigint => {
  let best = 10000000000000000000000n;
  for (let as = 0n; as <= 100n; as++) {
    for (let bs = 0n; bs <= 100n; bs++) {
      if (a[0] * as + b[0] * bs === x[0] && a[1] * as + b[1] * bs === x[1]) {
        const cost = 3n * as + bs;
        if (cost < best) {
          best = cost;
        }
      }
    }
  }
  return best === 10000000000000000000000n ? 0n : best;
};

await show(bigSumBy(input, spend));

const spend2 = ({ a, b, x }: Game): bigint => {
  const aNum = b[1] * x[0] - b[0] * x[1];
  const aDenom = a[0] * b[1] - a[1] * b[0];
  const bNum = a[1] * x[0] - a[0] * x[1];
  const bDenom = a[1] * b[0] - a[0] * b[1];
  if (aNum % aDenom !== 0n || bNum % bDenom !== 0n) {
    return 0n;
  }
  const as = aNum / aDenom;
  const bs = bNum / bDenom;
  if (as < 0n || bs < 0n) {
    return 0n;
  }
  return 3n * as + bs;
};

const grow = ({ a, b, x }: Game): Game => ({
  a,
  b,
  x: [x[0] + 10000000000000n, x[1] + 10000000000000n],
});

//await show(bigSumBy(input, spend2));
await show(bigSumBy(input, (g) => spend2(grow(g))));
