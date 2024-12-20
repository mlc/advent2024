import { Coord, getNums, neighbors, range, readSplit, show } from './util.ts';

const parse = (x: string) => getNums(x) as Coord;

const t = false;
const input = (await readSplit(18, '\n', t)).map(parse);

const size = t ? 7 : 71;

const freshGrid = (): boolean[][] =>
  [...range(0, size)].map((_) => [...range(0, size)].map((__) => false));

const grid = freshGrid();

for (const [x, y] of input.slice(0, t ? 12 : 1024)) {
  grid[x][y] = true;
}

const pathLen = (): number | null => {
  const dist = new Map<string, number>();
  const queue: [Coord, number][] = [[[0, 0], 0]];
  const target = [size - 1, size - 1].join(',');
  while (queue.length > 0) {
    const [pos, depth] = queue.shift()!;
    const key = pos.join(',');
    if (key === target) {
      return depth;
    }
    if (dist.has(key)) {
      continue;
    }
    dist.set(key, depth);
    for (const [x, y] of neighbors(pos)) {
      if (grid[x]?.[y] === false) {
        queue.push([[x, y], depth + 1]);
      }
    }
  }
  return null;
};

await show(pathLen()!);

for (const [x, y] of input.slice(t ? 12 : 1024)) {
  grid[x][y] = true;
  if (pathLen() === null) {
    await show([x, y].join(','));
    break;
  }
}
