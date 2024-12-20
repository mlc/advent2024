import { Coord, getNums, readSplit, show, sumBy } from './util.ts';

interface Game {
  a: Coord;
  b: Coord;
  x: Coord;
}

const parse = (xs: string): Game => {
  const [a, b, x] = xs.split('\n').map((s) => getNums(s)) as [
    Coord,
    Coord,
    Coord,
  ];
  return { a, b, x };
};

const input = (await readSplit(13, '\n\n', false)).map(parse);

const spend = ({ a, b, x }: Game): number => {
  let best = Infinity;
  for (let as = 0; as <= 100; as++) {
    for (let bs = 0; bs <= 100; bs++) {
      if (a[0] * as + b[0] * bs === x[0] && a[1] * as + b[1] * bs === x[1]) {
        const cost = 3 * as + bs;
        if (cost < best) {
          best = cost;
        }
      }
    }
  }
  return best === Infinity ? 0 : best;
};

await show(sumBy(input, spend));
