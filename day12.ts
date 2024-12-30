import { Coord, neighbors, readSplit, show, sumBy } from './util.ts';

const parse = (x: string) => x.split('');

const input = (await readSplit(12, '\n', false)).map(parse);

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
  return perim * members.length;
};

await show(sumBy(regions, price));

const price2 = ({ key, members }: Region): number => {
  const edges: Set<string>[] = [new Set(), new Set(), new Set(), new Set()];
  for (const [x, y] of members) {
    neighbors([0, 0]).forEach(([dx, dy], i) => {
      const [x0, y0] = [x + dx, y + dy];
      if (input[x0]?.[y0] !== key) {
        edges[i].add([x0, y0].join(','));
      }
    });
  }
  neighbors([0, 0]).forEach(([dx, dy], i) => {
    for (const k of edges[i]) {
      const [x, y] = k.split(',').map(Number) as Coord;
      let j = 1;
      while (true) {
        const key = [x + dy * j, y + dx * j].join(',');
        if (edges[i].has(key)) {
          edges[i].delete(key);
          j++;
        } else {
          break;
        }
      }
    }
  });
  //console.log({key, e: edges.map(r => r.size), area: members.length});
  return members.length * sumBy(edges, (e) => e.size);
};

await show(sumBy(regions, price2));
