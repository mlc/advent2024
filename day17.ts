import { getNums, readSplit, show } from './util.ts';

const input = await readSplit(17, '\n', false);
const [aInit] = getNums(input[0]);
const [bInit] = getNums(input[1]);
const [cInit] = getNums(input[2]);
const program = getNums(input[4]);

const simul = (startA: number) => {
  let ip = 0;
  let a = startA, b = bInit, c = cInit;
  const out: number[] = [];
  const states = new Set<string>();

  const readCombo = (x: number): number => {
    switch (x) {
      case 0:
      case 1:
      case 2:
      case 3:
        return x;
      case 4:
        return a;
      case 5:
        return b;
      case 6:
        return c;
      default:
        throw new Error('bad combo');
    }
  };

  const divide = (i: number, j: number) => Math.floor(i / (1 << j));

  while (ip < program.length) {
    const state = [a, b, c, ip].join(',');
    if (states.has(state)) {
      return [];
    }
    states.add(state);
    const op = program[ip + 1];
    switch (program[ip]) {
      case 0: // adv
        a = divide(a, readCombo(op));
        break;

      case 1: // bxl
        b = b ^ op;
        break;

      case 2: // bst
        b = readCombo(op) & 0x07;
        break;

      case 3: // jnz
        if (a !== 0) {
          ip = op - 2;
        }
        break;

      case 4: // bxc
        b = b ^ c;
        break;

      case 5: // out
        out.push(readCombo(op) & 0x07);
        break;

      case 6: // bdv
        b = divide(a, readCombo(op));
        break;

      case 7: // cdv
        c = divide(a, readCombo(op));
        break;

      default:
        throw new Error('bad op');
    }
    ip += 2;
  }
  return out;
};

await show(simul(aInit).join(','));

const target = program.join(',');

let guess = 0;
while (true) {
  if (simul(guess).join(',') === target) {
    await show(guess);
    break;
  }
  if (guess % 100000 === 0) {
    console.log(guess);
  }
  guess++;
}
