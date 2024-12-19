import { chunk } from '@std/collections';
import { readSplit, show, sumBy } from './util.ts';

const parse = (x: string) => parseInt(x, 10);

const input = (await readSplit(9, '', false)).map(parse);

const disk: (number | null)[] = [];

chunk(input, 2).forEach(([a, b], i) => {
  for (let j = 0; j < a; j++) {
    disk.push(i);
  }
  if (b) {
    for (let j = 0; j < b; j++) {
      disk.push(null);
    }
  }
});

const disk2 = [...disk];

let lptr = 0;
for (let rptr = disk.length - 1; rptr >= 0; rptr--) {
  if (disk[rptr] === null) {
    continue;
  }
  while (disk[lptr] !== null) {
    lptr++;
  }
  if (lptr >= rptr) {
    break;
  }
  disk[lptr] = disk[rptr];
  disk[rptr] = null;
}

const checksum = (n: number | null, pos: number) => n === null ? 0 : n * pos;

await show(sumBy(disk, checksum));

lptr = 0;
O: for (let rptr = disk2.length - 1; rptr > lptr; rptr--) {
  if (disk2[rptr] === null) {
    continue;
  }
  let rstart = rptr;
  const n = disk2[rptr];
  while (disk2[rstart] === n) {
    rstart--;
  }
  rstart++;
  const count = rptr - rstart + 1;
  rptr = rstart;
  while (disk2[lptr] !== null) {
    lptr++;
  }
  let lstart = lptr;
  while (disk2.slice(lstart, lstart + count).some((t) => t !== null)) {
    lstart++;
    if (lstart + count >= rstart) {
      continue O;
    }
  }
  console.log({ rstart, count, n, lstart, lptr });
  for (let i = 0; i < count; i++) {
    disk2[lstart + i] = n;
    disk2[rstart + i] = null;
  }
}

await show(sumBy(disk2, checksum));
