import { readSplit, show } from './util.ts';

const parse = (x: string) => '';

const input = (await readSplit(1, '\n', false)).map(parse);

await show('');
