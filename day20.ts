import { Coord, neighbors, readSplit, show } from './util.ts';
import { MultiMap } from 'mnemonist';

const parse = (x: string) => x.split('');

const input = (await readSplit(20, '\n', false)).map(parse);

const find = (ch: string): Coord => {
  for (let i = 0; i < input.length; ++i) {
    for (let j = 0; j < input[i].length; j++) {
      if (input[i][j] === ch) {
        return [i, j];
      }
    }
  }
  throw new Error('not found');
};

const start = find('S');
const end = find('E').join(',');

const duration = (cheats: Coord[] = []): number => {
  const seen = new Set<string>();
  const queue: [Coord, number, number][] = [[start, 0, 0]];
  const cheatsS = new Set<string>(cheats.map((c) => c.join(',')));
  while (queue.length > 0) {
    const [coord, depth, used] = queue.shift()!;
    const key = coord.join(',');
    if (seen.has(key)) {
      continue;
    }
    if (key === end) {
      return used === cheats.length ? depth : Infinity;
    }
    seen.add(key);
    for (const neighbor of neighbors(coord)) {
      if (input[neighbor[0]]?.[neighbor[1]] !== '#') {
        queue.push([neighbor, depth + 1, used]);
      } else if (cheatsS.has(neighbor.join(','))) {
        queue.push([neighbor, depth + 1, used + 1]);
      }
    }
  }
  throw new Error('no path?');
};

const orig = duration();

console.log({ orig });

const possibilities: Coord[][] = [];
for (let i = 1; i < input.length - 1; i++) {
  for (let j = 1; j < input[i].length - 1; j++) {
    if (input[i][j] === '#') {
      possibilities.push([[i, j]]);
      // if (input[i][j+1] === '#') {
      //   possibilities.push([[i, j],[i,j+1]]);
      // }
      // if (input[i+1][j] === '#') {
      //   possibilities.push([[i, j],[i,j+1]]);
      // }
    }
  }
}

const results = new MultiMap<number, Coord[]>();
for (const poss of possibilities) {
  const dur = duration(poss);
  if (orig - dur >= 100) {
    results.set(orig - dur, poss);
  }
}

await show(results.size);
