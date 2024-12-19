import { Coord, readSplit, show } from './util.ts';
import { MultiMap } from 'mnemonist';

const parse = (x: string) => x.split('');

const input = (await readSplit(8, '\n', false)).map(parse);

const antennae = new MultiMap<string, Coord>();

input.forEach((row, x) => {
  row.forEach((col, y) => {
    if (col !== '.') {
      antennae.set(col, [x, y]);
    }
  });
});

const isValid = ([x, y]: Coord): boolean =>
  x >= 0 && x < input.length && y >= 0 && y < input[0].length;

const antinodes = new Set<string>();

for (const points of antennae.containers()) {
  for (let i = 0; i < points.length; i++) {
    const a = points[i];
    for (let j = i + 1; j < points.length; j++) {
      const b = points[j];
      const pt1: Coord = [a[0] + 2 * (b[0] - a[0]), a[1] + 2 * (b[1] - a[1])];
      const pt2: Coord = [b[0] + 2 * (a[0] - b[0]), b[1] + 2 * (a[1] - b[1])];
      if (isValid(pt1)) {
        antinodes.add(pt1.join(','));
      }
      if (isValid(pt2)) {
        antinodes.add(pt2.join(','));
      }
    }
  }
}

await show(antinodes.size);

for (const points of antennae.containers()) {
  for (let i = 0; i < points.length; i++) {
    const a = points[i];
    for (let j = i + 1; j < points.length; j++) {
      const b = points[j];
      for (let q = -50; q <= 50; q++) {
        const pt: Coord = [a[0] + q * (b[0] - a[0]), a[1] + q * (b[1] - a[1])];
        if (isValid(pt)) {
          antinodes.add(pt.join(','));
        }
      }
    }
  }
}

await show(antinodes.size);
