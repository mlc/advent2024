import { Coord, getNums, productBy, range, readSplit, show } from './util.ts';
import { showGrid } from './vis.ts';

interface Robot {
  p: Coord;
  v: Coord;
}

const parse = (x: string): Robot => {
  const [p0, p1, v0, v1] = getNums(x, false);
  return {
    p: [p0, p1],
    v: [v0, v1],
  };
};

const t = false;
const input = (await readSplit(14, '\n', t)).map(parse);

const width = t ? 11 : 101;
const height = t ? 7 : 103;

const mod = (n: number, d: number) => ((n % d) + d) % d;

const after = (n: number) =>
  input.map<Coord>(({ p, v }) => [
    mod(p[0] + n * v[0], width),
    mod(p[1] + n * v[1], height),
  ]);

const midWidth = Math.floor(width / 2);
const midHeight = Math.floor(height / 2);

const qs = [0, 0, 0, 0];

after(100).forEach(([x, y]) => {
  if (x < midWidth && y < midHeight) {
    qs[0] += 1;
  } else if (x < midWidth && y > midHeight) {
    qs[1] += 1;
  } else if (x > midWidth && y < midHeight) {
    qs[2] += 1;
  } else if (x > midWidth && y > midHeight) {
    qs[3] += 1;
  }
});

await show(productBy(qs));

const pad = (n: number) => {
  if (n < 10) {
    return `000${n}`;
  } else if (n < 100) {
    return `00${n}`;
  } else if (n < 1000) {
    return `0${n}`;
  } else {
    return `${n}`;
  }
};

O: for (const step of range(0, width * height)) {
  if (step % 100 === 0) {
    console.log({ step });
  }
  const grid: boolean[][] = new Array(height).fill(0).map(() =>
    new Array(width).fill(false)
  );
  for (const [x, y] of after(step)) {
    if (grid[y][x]) {
      continue O;
    }
    grid[y][x] = true;
  }
  await showGrid(grid, { filename: `day14-step${pad(step)}.png` });
}
