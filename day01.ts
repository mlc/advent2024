import { getNums, Pair, readSplit, show, sumBy, zipWith } from './util.ts';
import { MultiSet } from 'mnemonist';

const parse = (x: string) => getNums(x) as Pair<number>;

const input = (await readSplit(1, '\n', false)).map(parse);

const l1 = input.map(([a]) => a).sort();
const l2 = input.map(([, b]) => b).sort();

const score = sumBy(zipWith(l1, l2, (a, b) => Math.abs(a - b)));

await show(score);

const s2 = MultiSet.from(l2);

const score2 = sumBy(l1, (n) => n * s2.count(n));

await show(score2);
