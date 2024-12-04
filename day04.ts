import { neighbors, readSplit, show } from './util.ts';

const input = (await readSplit(4, '\n', false)).map((row) => row.split(''));

let found = 0;
for (const [dx, dy] of neighbors([0, 0], true)) {
  for (let x = 0; x < input.length; ++x) {
    for (let y = 0; y < input[x].length; ++y) {
      if (
        input[x][y] === 'X' &&
        input[x + dx]?.[y + dy] === 'M' &&
        input[x + 2 * dx]?.[y + 2 * dy] === 'A' &&
        input[x + 3 * dx]?.[y + 3 * dy] === 'S'
      ) {
        found += 1;
      }
    }
  }
}

await show(found);

found = 0;

const isMS = (a: string | undefined, b: string | undefined) =>
  (a === 'M' && b === 'S') || (a === 'S' && b === 'M');

for (let x = 0; x < input.length; ++x) {
  for (let y = 0; y < input[x].length; ++y) {
    if (
      input[x][y] === 'A' &&
      isMS(input[x - 1]?.[y - 1], input[x + 1]?.[y + 1]) &&
      isMS(input[x + 1]?.[y - 1], input[x - 1]?.[y + 1])
    ) {
      found += 1;
    }
  }
}

await show(found);
