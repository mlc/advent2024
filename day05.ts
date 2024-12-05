import { MultiMap } from 'mnemonist';
import { getNums, Pair, readSplit, show, sumBy } from './util.ts';

const [rules, updates] = (await readSplit(5, '\n\n', false)).map((part) =>
  part.split('\n').map((r) => getNums(r))
) as [Pair<number>[], number[][]];

const rulesLookup = new MultiMap<number, number>();
for (const [i, j] of rules) {
  rulesLookup.set(i, j);
}

const isValid = (update: number[]) =>
  update.every((n, i) =>
    (update.slice(i + 1)).every((n2) => (rulesLookup.get(n)?.includes(n2)))
  );

const midpoint = (ns: number[]) => ns.at(Math.floor(ns.length / 2))!;

await show(sumBy(updates.filter(isValid), midpoint));

const baddies = updates.filter((r) => !isValid(r));

const fixed = baddies.map((update) =>
  [...update].sort((a, b) => {
    if (rulesLookup.get(a)?.includes(b)) {
      return -1;
    } else if (rulesLookup.get(b)?.includes(a)) {
      return 1;
    } else {
      return 0;
    }
  })
);

await show(sumBy(fixed, midpoint));
