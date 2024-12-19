import { Coord, neighbors, readSplit, show } from './util.ts';

const parse = (x: string) => x.split('').map((y) => parseInt(y));

const input = (await readSplit(10, '\n', false)).map(parse);

let sum = 0;

const dfs = (start: Coord, useSet = true) => {
  const queue = [start];
  const result: Set<string> | Coord[] = useSet ? new Set<string>() : [];

  while (queue.length > 0) {
    const [x, y] = queue.shift()!;
    const n = input[x]?.[y];
    if (typeof n !== 'number') {
      continue;
    }
    if (n === 9) {
      if (Array.isArray(result)) {
        result.push([x, y]);
      } else {
        result.add(`${x},${y}`);
      }
      continue;
    }
    for (const neighbor of neighbors([x, y])) {
      if (input[neighbor[0]]?.[neighbor[1]] === n + 1) {
        queue.push(neighbor);
      }
    }
  }

  return Array.isArray(result) ? result.length : result.size;
};

for (let i = 0; i < input.length; i++) {
  for (let j = 0; j < input[i].length; j++) {
    if (input[i][j] !== 0) {
      continue;
    }
    sum += dfs([i, j]);
  }
}

await show(sum);

sum = 0;

for (let i = 0; i < input.length; i++) {
  for (let j = 0; j < input[i].length; j++) {
    if (input[i][j] !== 0) {
      continue;
    }
    sum += dfs([i, j], false);
  }
}

await show(sum);
