import { getNums, readSplit, show, sumBy } from './util.ts';

interface Row {
  target: number;
  nums: number[];
}

const parse = (x: string): Row => {
  const [target, ...nums] = getNums(x);
  return { target, nums };
};

const input = (await readSplit(7, '\n', false)).map(parse);

const tryIt = (acc: number, nums: number[]): number[] => {
  if (nums.length === 0) {
    return [acc];
  }
  const [first, ...rest] = nums;
  return [...tryIt(acc + first, rest), ...tryIt(acc * first, rest)];
};

const options = ({ target, nums }: Row, f = tryIt) => {
  const [first, ...rest] = nums;
  return sumBy(f(first, rest), (n) => n === target);
};

await show(sumBy(input, (row) => options(row) > 0 ? row.target : 0));

const tryIt2 = (acc: number, nums: number[]): number[] => {
  if (nums.length === 0) {
    return [acc];
  }
  const [first, ...rest] = nums;
  const concat = Number(`${acc}${first}`);
  return [
    ...tryIt2(acc + first, rest),
    ...tryIt2(acc * first, rest),
    ...tryIt2(concat, rest),
  ];
};

await show(sumBy(input, (row) => options(row, tryIt2) > 0 ? row.target : 0));
