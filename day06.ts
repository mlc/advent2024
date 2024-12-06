import { readSplit, show } from './util.ts';

const parse = (x: string) => x.split('');

const input = (await readSplit(6, '\n', false)).map(parse);

const findStart = () => {
  for (let i = 0; i < input.length; i++) {
    for (let j = 0; j < input[i].length; j++) {
      if (input[i][j] === '^') {
        return [i, j];
      }
    }
  }
  throw new Error();
};

const start = findStart();

let [x, y] = start;

let dir = [-1, 0];

const seen = new Set<string>();

while (x >= 0 && y >= 0 && x < input.length && y < input[0].length) {
  seen.add([x, y].join(','));
  if (input[x + dir[0]]?.[y + dir[1]] === '#') {
    dir = [dir[1], dir[0] * -1];
  } else {
    x += dir[0];
    y += dir[1];
  }
}

await show(seen.size);

const tryIt = (ox: number, oy: number) => {
  const s = new Set<string>();
  let [x, y] = start;
  let dir = [-1, 0];

  while (x >= 0 && y >= 0 && x < input.length && y < input[0].length) {
    const k = [x, y, ...dir].join(',');
    if (s.has(k)) {
      return true;
    }
    s.add(k);
    const nextx = x + dir[0];
    const nexty = y + dir[1];
    if ((nextx === ox && nexty === oy) || input[nextx]?.[nexty] === '#') {
      dir = [dir[1], dir[0] * -1];
    } else {
      x += dir[0];
      y += dir[1];
    }
  }
  return false;
};

let n = 0;
for (let ox = 0; ox < input.length; ox++) {
  for (let oy = 0; oy < input[ox].length; oy++) {
    if (ox === start[0] && oy === start[1]) {
      continue;
    }
    if (tryIt(ox, oy)) {
      n += 1;
    }
  }
}

await show(n);
