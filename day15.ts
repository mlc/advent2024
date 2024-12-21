import {
  addVectors,
  Coord,
  find2D,
  map2D,
  readSplit,
  scaleCoord,
  show,
  sumBy,
} from './util.ts';

type Op = '>' | '<' | '^' | 'v';
const ops: Op[] = ['>', '<', '^', 'v'];

const [partA, partB] = await readSplit(15, '\n\n', false);

const grid = partA.split('\n').map((line) => line.split(''));
const steps = partB.split('').filter<Op>((c: any): c is Op => ops.includes(c));

let pos = find2D(grid, '@');

const vectors: Record<Op, Coord> = {
  '>': [0, 1],
  '<': [0, -1],
  '^': [-1, 0],
  'v': [1, 0],
};

grid[pos[0]][pos[1]] = '.';

O: for (const step of steps) {
  const nextPos = addVectors(pos, vectors[step]) as Coord;
  if (grid[nextPos[0]][nextPos[1]] === '.') {
    pos = nextPos;
    continue;
  }
  let boxes = 0;
  I: while (true) {
    const peekPos = addVectors(
      pos,
      scaleCoord(vectors[step], boxes + 1),
    ) as Coord;
    const peek = grid[peekPos[0]][peekPos[1]];
    switch (peek) {
      case '#':
        continue O;

      case 'O':
        boxes++;
        break;

      case '.':
        break I;
    }
  }

  grid[nextPos[0]][nextPos[1]] = '.';
  const finalPos = addVectors(
    pos,
    scaleCoord(vectors[step], boxes + 1),
  ) as Coord;
  grid[finalPos[0]][finalPos[1]] = 'O';
  pos = nextPos;
}

const gps = ([x, y]: Coord, ch: string) => ch === 'O' ? 100 * x + y : 0;

await show(sumBy(map2D(grid, gps).flat()));
