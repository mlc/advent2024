import { range, readSplit, show } from './util.ts';
import { MultiSet } from 'mnemonist';

const parse = (x: string) => parseInt(x);

const input = (await readSplit(11, ' ', false)).map(parse);

let stones = input;

const step = (n: number): number[] => {
  if (n === 0) {
    return [1];
  }
  const s = n.toString();
  if (s.length % 2 === 0) {
    const parts = [s.substring(0, s.length / 2), s.substring(s.length / 2)];
    return parts.map((x) => parseInt(x, 10));
  } else {
    return [n * 2024];
  }
};

for (const day of range(0, 25)) {
  stones = stones.flatMap(step);
}

await show(stones.length);

let stones2 = MultiSet.from(input);

for (const day of range(0, 75)) {
  const nextStones = new MultiSet<number>();
  for (const [n, count] of stones2.multiplicities()) {
    for (const x of step(n)) {
      nextStones.add(x, count);
    }
  }
  stones2 = nextStones;
}

await show(stones2.size);
