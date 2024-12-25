import { range, readSplit, show, sumBy } from './util.ts';

type Kind = 'key' | 'lock';

interface Entry {
  kind: Kind;
  weights: [number, number, number, number, number];
}

const parse = (x: string): Entry => {
  const rows = x.split('\n');
  const kind: Kind = rows[0] === '#####' ? 'lock' : 'key';
  return {
    kind,
    weights: [...range(0, 5)].map((i) =>
      sumBy(rows, (row) => row[i] === '#') - 1
    ),
  } as Entry;
};

const input = (await readSplit(25, '\n\n', false)).map(parse);

const keys = input.filter(({ kind }) => kind === 'key');
const locks = input.filter(({ kind }) => kind === 'lock');

const compatible = (a: Entry, b: Entry) =>
  a.weights.every((wt, i) => wt + b.weights[i] <= 5);

await show(sumBy(keys, (k) => sumBy(locks, (l) => compatible(k, l))));
