import { inputFilename, Pair, show, sumBy } from './util.ts';

const input = await Deno.readTextFile(inputFilename(3, false));

const MUL = /mul\((\d+),(\d+)\)/g;

const muls: Pair<number>[] = [];

let match: RegExpMatchArray | null = null;
while (match = MUL.exec(input)) {
  muls.push([Number(match[1]), Number(match[2])]);
}

await show(sumBy(muls, ([a, b]) => a * b));

const PARSETWO = /mul\((\d+),(\d+)\)|do\(\)|don't\(\)/g;

const muls2: Pair<number>[] = [];
let active = true;
while (match = PARSETWO.exec(input)) {
  if (match[0] === 'do()') {
    active = true;
  } else if (match[0] === "don't()") {
    active = false;
  } else if (active) {
    muls2.push([Number(match[1]), Number(match[2])]);
  }
}

await show(sumBy(muls2, ([a, b]) => a * b));
