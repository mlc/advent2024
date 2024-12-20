import { Coord, neighbors, readSplit, show, sumBy } from './util.ts';

const parse = (x: string) => x.split('');

const input = (await readSplit(12, '\n', true)).map(parse);

const seen = input.map((row) => row.map((col) => false));

interface Region {
  key: string;
  members: Coord[];
}

const regions: Region[] = [];

const findRegion = (start: Coord): Region => {
  const queue: Coord[] = [start];
  const members: Coord[] = [];
  const key = input[start[0]][start[1]];
  while (queue.length > 0) {
    const candidate = queue.shift()!;
    const [x, y] = candidate;
    if (seen[x]?.[y] || input[x]?.[y] !== key) {
      continue;
    }
    seen[x][y] = true;
    members.push(candidate);
    queue.push(...neighbors(candidate));
  }
  return { key, members };
};

for (let x = 0; x < input.length; x++) {
  for (let y = 0; y < input[x].length; y++) {
    if (seen[x][y]) {
      continue;
    }
    regions.push(findRegion([x, y]));
  }
}

const price = ({ key, members }: Region): number => {
  let perim = 0;
  for (const member of members) {
    for (const [x, y] of neighbors(member)) {
      if (input[x]?.[y] !== key) {
        perim++;
      }
    }
  }
  console.log({ key, area: members.length, perim });
  return perim * members.length;
};

console.log(sumBy(regions, price));
