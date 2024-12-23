import { readSplit, show, sumBy } from './util.ts';
import Graph from 'npm:graphology@0.25.4';
import BronKerbosch from 'npm:@seregpie/bron-kerbosch@1.0.1';
import { maxBy } from '@std/collections';

const parse = (x: string) => x.split('-') as [string, string];

const input = (await readSplit(23, '\n', false)).map(parse);

const graph = new Graph.UndirectedGraph();

input.forEach(([a, b]) => {
  graph.mergeNode(a);
  graph.mergeNode(b);
  graph.addEdge(a, b);
});

const triples = new Set<string>();

graph.forEachNode((n0) => {
  const neighbors = graph.neighbors(n0);
  for (let i = 0; i < neighbors.length; i++) {
    const n1 = neighbors[i];
    for (let j = i + 1; j < neighbors.length; j++) {
      const n2 = neighbors[j];
      if (graph.areNeighbors(n1, n2)) {
        triples.add([n0, n1, n2].sort().join(','));
      }
    }
  }
});

await show(sumBy([...triples], (s) => s.split(',').some((e) => e[0] === 't')));

const cliques: string[][] = BronKerbosch(input);

const best = maxBy(cliques, (cl) => cl.length);
await show(best!.sort().join(','));
