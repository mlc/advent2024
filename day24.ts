import { readSplit, show } from './util.ts';
import Graph from 'npm:graphology@0.25.4';
import { topologicalSort } from 'npm:graphology-dag@0.4.1';

const parts = await readSplit(24, '\n\n', false);

const inits = Object.fromEntries(
  parts[0].split('\n').map<[string, boolean]>((row) => {
    const [a, b] = row.split(': ');
    return [a, b === '1'];
  }),
);

interface Gate {
  i1: string;
  i2: string;
  op: 'AND' | 'OR' | 'XOR';
}

const wires = Object.fromEntries(
  parts[1].split('\n').map<[string, Gate]>((s) => {
    const parts = s.split(/[ >-]+/);
    return [parts[3], { i1: parts[0], i2: parts[2], op: parts[1] } as Gate];
  }),
);

const graph = new Graph.DirectedGraph();
Object.keys(inits).forEach((key) => graph.mergeNode(key));
Object.entries(wires).forEach(([target, { i1, i2 }]) => {
  graph.mergeNode(target);
  graph.mergeNode(i1);
  graph.mergeNode(i2);
  graph.addEdge(i1, target);
  graph.addEdge(i2, target);
});

const op = (op: 'AND' | 'OR' | 'XOR', b1: boolean, b2: boolean): boolean => {
  switch (op) {
    case 'AND':
      return b1 && b2;
    case 'OR':
      return b1 || b2;
    case 'XOR':
      return b1 !== b2;
    default:
      throw new Error(op);
  }
};

const values = new Map<string, boolean>();
Object.entries(inits).forEach(([k, v]) => {
  values.set(k, v);
});

topologicalSort(graph).forEach((node) => {
  if (values.has(node)) {
    return;
  }
  const wire = wires[node];
  if (!(values.has(wire.i1) && values.has(wire.i2))) {
    throw new Error(node);
  }
  const val = op(wire.op, values.get(wire.i1)!, values.get(wire.i2)!);
  values.set(node, val);
});

let result = 0n;

graph.forEachNode((node) => {
  if (node[0] === 'z' && values.get(node)) {
    const n = parseInt(node.substring(1), 10);
    result = result | (1n << BigInt(n));
  }
});

await show(result);

const color = (op: 'AND' | 'OR' | 'XOR') => {
  switch (op) {
    case 'AND':
      return 'red';
    case 'OR':
      return 'blue';
    case 'XOR':
      return 'green';
  }
};

const outfile = await Deno.open('day24.dot', { write: true, create: true });
const te = new TextEncoderStream();
te.readable.pipeTo(outfile.writable);
const out = te.writable.getWriter();
await out.write('digraph {\n');
for (const edge of graph.edges()) {
  await out.write(`${graph.source(edge)} -> ${graph.target(edge)}\n`);
}
for (const wire of Object.keys(wires)) {
  await out.write(`${wire} [color=${color(wires[wire].op)}]\n`);
}
await out.write('}');
await out.close();
outfile.close();
