import type { Lesson, Project } from '../../../types';

/**
 * Module 13, Graphs (days 44 to 48). One running map ties the lessons together: five places of a barangay (Plaza, Market, School, Clinic,
 * Terminal) joined by six two-way roads with distances in km: Plaza-Market 2, Plaza-School 4, Market-School 1, Market-Terminal 7,
 * School-Clinic 3, Clinic-Terminal 2. The fewest-roads route from Plaza to Terminal is 2 roads (9 km); the shortest by distance is 4 roads (8 km).
 */

const ID = 'data-structures-algorithms';

// A line of 120 places, one km apart, for the hidden tests of lesson 44.
const longRoads: [string, string, number][] = Array.from({ length: 119 }, (_, i): [string, string, number] => [`S${i}`, `S${i + 1}`, 1]);
const longPath = Array.from({ length: 120 }, (_, i) => `S${i}`);

export const lessons: Lesson[] = [
  {
    id: `${ID}-44`,
    day: 44,
    title: 'What Graphs Are: Vertices, Edges and Their Kinds',
    summary: 'Learn the vocabulary of graphs: vertices and edges, directed and undirected, weighted and unweighted, cycles, and what a path and a degree are.',
    minutes: 25,
    skills: ['graphs'],
    intro: {
      objectives: [
        'Name the vertices and edges of a real situation and decide which kind of graph it is',
        'Count the degree of a vertex and the length of a path, by edges and by weight',
        'Tell a tree, a cyclic graph and a directed acyclic graph apart',
      ],
      why: 'Routes, friend suggestions and task orders are all graphs. When an AI assistant says "model this as a graph", you can only judge its choice if you know exactly what the words mean.',
    },
    body: [
      {
        type: 'paragraph',
        text: 'Some data is not a list or a tree but a web of connections: roads between places, friends in a group chat, tasks that must wait for other tasks, web pages that link to each other. A **graph** is the structure built for exactly this: a set of things, plus the connections between them. This is the first of five lessons about graphs, and it only teaches the vocabulary, because every algorithm that follows (searching, finding loops, ordering tasks, finding the shortest route) is described in these words. If an AI assistant writes graph code for you, this is the language you need to read it and to question it.',
      },
      { type: 'heading', text: 'A real-world picture' },
      {
        type: 'paragraph',
        text: 'Picture the map of a barangay pinned on the wall of the hall. The Plaza, the Market, the School, the Clinic and the Terminal are drawn as dots, and a line joins two dots when a road connects those places. Nobody cares whether the Plaza is drawn at the top or at the bottom of the map. The only thing that matters is which dots are joined. That is a graph. A group chat is another one: every person is a dot, and a line means that two people message each other.',
      },
      {
        type: 'paragraph',
        text: 'Where the picture stops being accurate: a drawing has positions and lengths on paper, but a graph records only who is connected to whom (and, if you choose, one number on each connection). Two very different drawings can be the same graph, and a long line on the paper does not mean a long road unless a number says so.',
      },
      { type: 'heading', text: 'How it works' },
      {
        type: 'paragraph',
        text: 'A graph has two kinds of parts. A **vertex** (plural: vertices; many books say **node**) is one thing: a place, a person, a task. An **edge** is a connection between two vertices. A graph is simply its set of vertices together with its set of edges. Two vertices joined by an edge are **adjacent**, and we call them **neighbours**.',
      },
      {
        type: 'paragraph',
        text: 'Graphs differ in a few independent ways. You answer each question separately, and the answers combine.',
      },
      {
        type: 'table',
        headers: ['Kind', 'What it means', 'Example'],
        rows: [
          ['Undirected', 'An edge works both ways: if A is joined to B, then B is joined to A', 'A two-way road; two people who message each other'],
          ['Directed', 'Each edge has a direction, drawn as an arrow from one vertex to another', 'A one-way street; "Ana follows Ben" (Ben may not follow Ana)'],
          ['Unweighted', 'An edge only says that a connection exists', '"These two people know each other"'],
          ['Weighted', 'Each edge carries a number, called its weight', 'A distance in km, a fare in pesos, minutes of travel'],
          ['Cyclic', 'Some path leads from a vertex back to where it started', 'Three one-way streets that form a loop'],
          ['Acyclic', 'No path ever leads back to where it started', 'Steps of a recipe: nothing needs itself, even through other steps'],
        ],
        caption: 'Four questions to ask about any graph: is it directed, is it weighted, does it have a cycle, and is it connected (lesson 47).',
      },
      {
        type: 'paragraph',
        text: 'Our running example, used through this whole module, is undirected and weighted: five places, six two-way roads, and a distance in km on each road.',
      },
      {
        type: 'diagram',
        format: 'mermaid',
        caption: 'The barangay map. Each line is a two-way road; the number is its length in km.',
        source: 'flowchart LR\n  Plaza <-->|2 km| Market\n  Plaza <-->|4 km| School\n  Market <-->|1 km| School\n  Market <-->|7 km| Terminal\n  School <-->|3 km| Clinic\n  Clinic <-->|2 km| Terminal',
      },
      {
        type: 'paragraph',
        text: 'A **path** is a walk along edges from one vertex to another, such as Plaza, Market, School. Its **length** can mean two different things: the number of edges (two here), or, in a weighted graph, the sum of the weights (2 + 1 = 3 km). Always ask which one is meant. Lesson 46 finds the path with the fewest edges, and lesson 48 finds the one with the smallest total weight; they are not always the same path.',
      },
      {
        type: 'paragraph',
        text: 'The **degree** of a vertex is the number of edges that touch it. Market has degree 3: its roads to Plaza, School and Terminal. In a directed graph we count the edges leaving a vertex (its **out-degree**) and arriving at it (its **in-degree**) separately. A useful check for an undirected graph: every edge has two ends, so the degrees of all the vertices add up to exactly twice the number of edges.',
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: 'In plain words: a graph is just dots and lines. A *vertex* is one dot (a place, a person, a task). An *edge* is one line between two dots. If the lines have arrows, the graph is *directed*, like one-way streets; if they have numbers on them, it is *weighted*, like a map with distances. The code below stores the roads as a list of little lists, each holding two place names and a distance. The line `for (const [a, b] of roads)` takes one road at a time and gives its first two parts the names `a` and `b`, so the loop can ask whether a place is at either end of that road.',
      },
      {
        type: 'paragraph',
        text: 'A **cycle** is a path that leads back to where it started (walking back along the very same road does not count). A **directed acyclic graph**, or **DAG**, has arrows and no cycle; it is the natural shape of "this must happen before that", and lesson 47 puts it to work. You already know one special graph: a tree (module 10) is a connected graph with no cycles, and a rooted tree adds a direction from parent to child. Every tree is a graph, but most graphs are not trees, because they can contain cycles or several routes between two vertices.',
      },
      {
        type: 'details',
        summary: 'How big can a graph get?',
        body: [
          'With V vertices, an undirected graph that allows at most one edge between a pair (and no edge from a vertex to itself) can have at most V(V-1)/2 edges. A directed one can have V(V-1), because A to B and B to A are two different edges.',
          'For 5 vertices that is 10 undirected pairs, and our map uses 6 of them. For 100 vertices it is 4,950 pairs. Real graphs usually use a tiny share of what is possible: a junction has a handful of roads, not 99. A graph with far fewer edges than the maximum is called **sparse**, and one close to the maximum is **dense**. Lesson 45 shows why that decides how we store a graph.',
        ],
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: 'Before any algorithm, the engineering decision is the model: what is a vertex, and what is an edge? A routing service might make junctions the vertices and road segments the edges, one-way streets directed, and travel times weights that change with traffic, so weights are live data rather than constants. Two separate roads between the same pair of junctions are **parallel edges** (a multigraph), and a road that starts and ends at the same junction is a **self-loop**. The simple structures of this module assume neither unless a lesson says so, and code that ignores them breaks quietly. Real networks are also sparse, so E grows roughly like V rather than V squared. That one fact is why adjacency lists dominate in practice.',
      },
      { type: 'heading', text: 'See it in code' },
      {
        type: 'paragraph',
        text: 'We start with the simplest way to write a graph down: a list of its vertices and a list of its edges, each edge as `[place, place, km]`. (An edge list is one of three common ways to store a graph; lesson 45 adds the other two.) First, build the map and compute every degree.',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'The map as vertices and an edge list, with degrees',
        code: `const places = ['Plaza', 'Market', 'School', 'Clinic', 'Terminal'];
const roads = [
  ['Plaza', 'Market', 2],
  ['Plaza', 'School', 4],
  ['Market', 'School', 1],
  ['Market', 'Terminal', 7],
  ['School', 'Clinic', 3],
  ['Clinic', 'Terminal', 2],
];
console.log(places.length, 'places,', roads.length, 'roads');

function degree(place) {
  let count = 0;
  for (const [a, b] of roads) {
    if (a === place || b === place) {
      count++;
    }
  }
  return count;
}

let sum = 0;
for (const place of places) {
  console.log(place, degree(place));
  sum += degree(place);
}
console.log('sum of degrees', sum, 'twice the roads', roads.length * 2);`,
      },
      {
        type: 'code',
        language: 'text',
        label: 'Output',
        code: `5 places, 6 roads
Plaza 2
Market 3
School 3
Clinic 2
Terminal 2
sum of degrees 12 twice the roads 12`,
      },
      {
        type: 'paragraph',
        text: 'Next, a directed graph: four one-way streets. Here a street is `[from, to]`, and the order matters. Count the arrows leaving and arriving at each place.',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'One-way streets: out-degree and in-degree',
        code: `const oneWay = [
  ['Plaza', 'Market'],
  ['Market', 'School'],
  ['School', 'Plaza'],
  ['School', 'Clinic'],
];

function outDegree(place) {
  return oneWay.filter((street) => street[0] === place).length;
}
function inDegree(place) {
  return oneWay.filter((street) => street[1] === place).length;
}

for (const place of ['Plaza', 'Market', 'School', 'Clinic']) {
  console.log(place, 'out', outDegree(place), 'in', inDegree(place));
}`,
      },
      {
        type: 'code',
        language: 'text',
        label: 'Output',
        code: `Plaza out 1 in 1
Market out 1 in 1
School out 2 in 1
Clinic out 0 in 1`,
      },
      {
        type: 'paragraph',
        text: 'Finally, the two meanings of a path\'s length. `pathCost` adds the km of each step, and answers -1 if two neighbours in the path are not joined by a road. It uses the `roads` list from the first block.',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'The length of a path, in roads and in km',
        code: `function weightOf(a, b) {
  for (const [x, y, km] of roads) {
    if ((x === a && y === b) || (x === b && y === a)) {
      return km;
    }
  }
  return null;
}

function pathCost(path) {
  let total = 0;
  for (let i = 0; i < path.length - 1; i++) {
    const km = weightOf(path[i], path[i + 1]);
    if (km === null) {
      return -1;
    }
    total += km;
  }
  return total;
}

const fewRoads = ['Plaza', 'Market', 'Terminal'];
const fewKm = ['Plaza', 'Market', 'School', 'Clinic', 'Terminal'];
console.log(fewRoads.length - 1, 'roads,', pathCost(fewRoads), 'km');
console.log(fewKm.length - 1, 'roads,', pathCost(fewKm), 'km');
console.log(pathCost(['Plaza', 'Clinic']));`,
      },
      {
        type: 'code',
        language: 'text',
        label: 'Output',
        code: `2 roads, 9 km
4 roads, 8 km
-1`,
      },
      { type: 'heading', text: 'Walk through the code' },
      {
        type: 'list',
        items: [
          '`degree` loops over every road. A road `[a, b, km]` touches `place` when `place` is at either end, so the test is `a === place || b === place`. Each match adds one to `count`.',
          'The final line checks the rule from the lesson: the degrees add up to 12, which is exactly twice the 6 roads, because each road has two ends.',
          '`outDegree` keeps the streets whose first part is the place (arrows leaving it). `inDegree` keeps the streets whose second part is the place (arrows arriving). Clinic has out 0: you can reach it but cannot leave it by a listed street.',
          '`weightOf` finds the road between two places in either order, because a two-way road may be written `[a, b]` or `[b, a]`. It returns `null` when no road joins them.',
          '`pathCost` walks along the path two places at a time and adds the km. The last three lines show that one route has fewer roads (2) while the other has fewer km (8 against 9).',
        ],
      },
      {
        type: 'table',
        headers: ['Road looked at', 'Touches Market?', 'count after it'],
        rows: [
          ['Plaza - Market', 'yes', '1'],
          ['Plaza - School', 'no', '1'],
          ['Market - School', 'yes', '2'],
          ['Market - Terminal', 'yes', '3'],
          ['School - Clinic', 'no', '3'],
          ['Clinic - Terminal', 'no', '3'],
        ],
        caption: 'Tracing degree("Market"): the loop looks at all 6 roads and ends with 3.',
      },
      { type: 'heading', text: 'Try it with AI' },
      {
        type: 'paragraph',
        text: 'Use any AI assistant to practise deciding what the vertices and edges of a situation are. The decision is yours; the AI is there to question it.',
      },
      {
        type: 'prompt',
        label: 'Practise modelling, one question at a time',
        text: 'I am learning graphs in a data structures course. Situation: a jeepney terminal has four routes, and each route passes through several stops. Passengers can transfer between routes at stops that two routes share. Do not give me the model. Ask me one question at a time: what could the vertices be, what could the edges be, should the edges be directed, and should they have weights. After each of my answers, tell me whether it works and what it would make easy or hard later.',
      },
      {
        type: 'prompt',
        label: 'Get quizzed on the kinds of graph',
        text: 'Quiz me with five short real-life situations (not code). For each one I will say whether the graph is directed or undirected, weighted or unweighted, and whether it could contain a cycle. Wait for my answer before you tell me if I was right, and explain any mistake in one or two sentences.',
      },
      {
        type: 'paragraph',
        text: 'What to look for: the AI may accept several different models (stops as vertices, or routes as vertices) and both can be right, so ask it what each one makes easy. An AI can also be confidently wrong. Check its labels against the definitions above: a family tree drawn with arrows from parent to child is directed and acyclic, not undirected, and a "length" is only meaningful once it says whether it counts edges or adds weights.',
      },
      {
        type: 'takeaways',
        items: [
          'A graph is a set of vertices plus a set of edges; only the connections matter, not where things are drawn.',
          'Ask four questions of any graph: directed or undirected, weighted or unweighted, cyclic or acyclic, connected or not.',
          'A path\'s length is either its number of edges or its total weight; say which one you mean.',
          'The degree of a vertex counts its edges, and in an undirected graph the degrees add up to twice the number of edges.',
          'A tree is a connected graph with no cycles; a DAG has directed edges and no cycle.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: `${ID}-44-match-1`,
          kind: 'match',
          title: 'What kind of graph is it?',
          prompt: 'Match each situation to the kind of graph that describes it best.',
          concept: 'kinds of graph',
          labels: { terms: 'Situation', meanings: 'Kind of graph' },
          pairs: [
            { term: 'Every link is mutual: if Ana is linked to Ben, then Ben is linked to Ana', definition: 'Undirected graph', note: 'A link that works both ways needs no arrow.' },
            { term: 'Each link is an arrow: Ana follows Ben, but Ben may not follow Ana', definition: 'Directed graph', note: 'The arrow records which end the link starts from.' },
            { term: 'Each road carries its length in km', definition: 'Weighted graph', note: 'A number on every edge is what makes a graph weighted.' },
            { term: 'Following the arrows can lead you back to where you started', definition: 'Graph with a cycle', note: 'A path that returns to its start is a cycle.' },
            { term: 'Steps of a recipe: each step comes after the steps it needs, and no step depends on itself', definition: 'Directed acyclic graph (DAG)', note: 'Arrows say "before", and the absence of any loop is what makes an order possible.' },
          ],
          hints: [
            'Ask two things of each situation: do the links have a direction, and do they carry a number?',
            'Arrows that cannot loop back describe "must happen before" relationships.',
            'The only situation that talks about arriving back at the start is the cycle.',
          ],
          explanation: 'Direction, numbers and loops are three separate questions. Mutual links are undirected, arrows are directed, numbers make a graph weighted, and a way back to the start is a cycle. A recipe combines arrows with no cycle: a DAG.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: `${ID}-44-predict-output-1`,
          kind: 'predict-output',
          title: 'Count the degrees',
          prompt: 'Four places and four roads. Predict the line the program prints: the degrees of A, B, C and D.',
          concept: 'degree of a vertex',
          language: 'javascript',
          code: `const roads = [['A', 'B'], ['A', 'C'], ['A', 'D'], ['C', 'D']];
const counts = {};
for (const [x, y] of roads) {
  counts[x] = (counts[x] || 0) + 1;
  counts[y] = (counts[y] || 0) + 1;
}
console.log(counts.A, counts.B, counts.C, counts.D);`,
          expected: '3 1 2 2',
          choices: ['3 1 2 2', '3 1 1 1', '4 1 2 2', '2 1 2 1'],
          wrongNotes: {
            '3 1 1 1': 'C and D each have two roads: one to A and one to each other (C to D).',
            '4 1 2 2': 'There are 4 roads, but A is only at the end of 3 of them. The degrees must add up to 8, and 4 + 1 + 2 + 2 is 9.',
            '2 1 2 1': 'Count the roads that start at A: A to B, A to C and A to D. Each road is counted at both of its ends.',
          },
          hints: [
            'Go road by road and add one to each of its two ends.',
            'A appears in three of the four roads.',
            'Check your answer: the four numbers must add up to twice the number of roads, which is 8.',
          ],
          explanation: 'A touches three roads, B one, and C and D two each (A-C and C-D, A-D and C-D). The degrees add up to 3 + 1 + 2 + 2 = 8, which is twice the 4 roads.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: `${ID}-44-code-challenge-1`,
          kind: 'code-challenge',
          title: 'What does this route cost?',
          prompt: 'Write `pathCost(roads, path)`. `roads` is a list of `[place, place, km]` two-way roads and `path` is a list of places. Return the total km of the route, or -1 if two neighbours in the path are not joined by a road. A path with one place costs 0.',
          concept: 'path length in a weighted graph',
          language: 'javascript',
          starter: `function pathCost(roads, path) {
  // add the km of each step; return -1 if a step has no road
}
`,
          solution: `function pathCost(roads, path) {
  let total = 0;
  for (let i = 0; i < path.length - 1; i++) {
    let km = null;
    for (const [a, b, weight] of roads) {
      if ((a === path[i] && b === path[i + 1]) || (b === path[i] && a === path[i + 1])) {
        km = weight;
      }
    }
    if (km === null) {
      return -1;
    }
    total += km;
  }
  return total;
}
`,
          tests: {
            kind: 'function',
            fn: 'pathCost',
            cases: [
              { label: 'two roads, 9 km', args: [[['Plaza', 'Market', 2], ['Market', 'Terminal', 7]], ['Plaza', 'Market', 'Terminal']], expected: 9 },
              { label: 'the road is written the other way round', args: [[['B', 'A', 5]], ['A', 'B']], expected: 5 },
              { label: 'no road between the neighbours', args: [[['A', 'B', 1], ['C', 'D', 1]], ['A', 'B', 'C']], expected: -1 },
              { label: 'one place only', args: [[['A', 'B', 1]], ['A']], expected: 0 },
              { label: 'a long route (hidden)', args: [longRoads, longPath], expected: 119, hidden: true },
              { label: 'a long route with a gap (hidden)', args: [longRoads, ['S0', 'S1', 'S3']], expected: -1, hidden: true },
            ],
          },
          hints: [
            'Look at the path two places at a time: path[i] and path[i + 1].',
            'For each pair, search the roads for one that joins them in either order. Remember that a road `[a, b]` also joins b to a.',
            'Start `total` at 0, add the road\'s km for every pair, and return -1 as soon as one pair has no road.',
          ],
          explanation: 'A route is only valid if every step is a real road, so each pair of neighbours in the path needs a lookup. A road works in both directions, so the test checks both orders. The cost is the sum of the km.',
        },
      },
    ],
    quiz: [
      {
        id: `${ID}-44-q1`,
        prompt: 'A tourist app stores every road between towns with its length in km, and all roads can be driven in both directions. Which description fits this graph?',
        choices: ['Directed and unweighted', 'Undirected and weighted', 'Directed and weighted', 'Undirected and unweighted'],
        answer: 1,
        explanation: 'Roads that work both ways make the graph undirected, and a length on every road makes it weighted.',
      },
      {
        id: `${ID}-44-q2`,
        prompt: 'Which statement about trees and graphs is true?',
        choices: [
          'A tree is a connected graph that has no cycles',
          'A graph is a tree as soon as it has at least one edge',
          'Trees and graphs are unrelated structures with different rules',
          'Every graph has a root vertex, just like a tree has',
        ],
        answer: 0,
        explanation: 'A tree is a special graph: connected, with no cycles. Most graphs are not trees because they contain cycles or are not one connected piece, and a graph has no root unless we choose one.',
      },
      {
        id: `${ID}-44-q3`,
        prompt: 'An undirected graph has 5 edges. What do the degrees of all its vertices add up to?',
        choices: ['5', '25', '10', 'It depends on which vertices the edges join'],
        answer: 2,
        explanation: 'Every edge has two ends and adds one to the degree of each end, so the degrees always add up to twice the number of edges: 10.',
      },
      {
        id: `${ID}-44-q4`,
        prompt: 'One route from Plaza to Terminal uses 2 roads totalling 9 km. Another uses 4 roads totalling 8 km. Which is the shorter path?',
        choices: [
          'The first, because it has fewer roads, however length is measured',
          'The second, because a route with more roads is always better',
          'It depends: by number of roads the first is shorter, by total km the second',
          'Neither, because a path may only use one edge',
        ],
        answer: 2,
        explanation: 'The word "length" has two meanings. Counting edges favours the first route; adding weights favours the second. Always say which one you mean.',
      },
      {
        id: `${ID}-44-q5`,
        audience: { max: 'beginner' },
        prompt: 'When a graph is drawn as dots and lines, what is a vertex?',
        choices: ['A line joining two dots', 'One of the dots, such as a place or a person', 'A number written on a line', 'A loop that comes back to where it started'],
        answer: 1,
        explanation: 'A vertex (also called a node) is one thing in the graph, drawn as a dot. The lines between dots are the edges.',
      },
      {
        id: `${ID}-44-q6`,
        audience: { min: 'advanced' },
        prompt: 'A routing service must store one-way streets, two separate roads between the same two junctions, and travel times that change with traffic. Which model fits?',
        choices: [
          'An undirected unweighted graph that allows only one edge per pair',
          'A tree rooted at the busiest junction',
          'A directed graph that allows parallel edges, with weights updated as traffic changes',
          'A weighted graph that forbids parallel edges, treats every road as two-way, and never changes its weights once built',
        ],
        answer: 2,
        explanation: 'One-way streets need direction, two roads between one pair of junctions are parallel edges, and changing travel times mean the weights are live data.',
      },
    ],
    task: {
      title: 'Draw your own graph',
      minutes: 15,
      steps: [
        'On paper, choose six places or people you know (rooms in your home, shops on your street, classmates) and draw each as a dot.',
        'Join two dots with a line when there is a direct connection (a door, a walk of under five minutes, a chat). Decide whether your graph is directed, and whether it is weighted: if so, write a number on each line.',
        'Write down the degree of every dot, add them up, and check that the total is twice the number of lines.',
        'Find two different paths between the same two dots and write down the length of each, both as a number of edges and, if weighted, as a total weight.',
      ],
    },
    taskExtra: [
      {
        audience: { max: 'beginner' },
        steps: ['Keep it small: use only four dots and at most four lines, and say out loud (or write) what each dot and each line means in plain words.'],
      },
      {
        audience: { min: 'advanced' },
        steps: [
          'Write your graph as an edge list in JavaScript and compute every degree with code. Then count how many of the V(V-1)/2 possible pairs actually have an edge, and say whether your graph is sparse or dense.',
          'Add one thing the simple model cannot hold (a one-way road, or two parallel roads) and write down what you would have to change in the model to keep it correct.',
        ],
      },
    ],
  },
  {
    id: `${ID}-45`,
    day: 45,
    title: 'Representing Graphs: Adjacency Matrix and Adjacency List',
    summary: 'Store a graph two ways, as a grid and as a list of neighbours, and compare their space and the cost of each question you ask of them.',
    minutes: 28,
    skills: ['graphs', 'choose-structure', 'complexity'],
    intro: {
      objectives: [
        'Build an adjacency matrix and an adjacency list from a list of roads',
        'State the space and the cost of an edge test and a neighbour look-up for each',
        'Choose a representation for a sparse or a dense graph and defend the choice',
      ],
      why: 'AI assistants almost always store a graph as an adjacency list. Knowing what the matrix would cost lets you check that choice, and spot the rare case where the matrix is the better one.',
    },
    body: [
      {
        type: 'paragraph',
        text: 'A drawing is for people. A program needs data it can look things up in, and the way you store a graph decides how fast you can answer the two questions graph code asks again and again: "is there a road from A to B?" and "which places can I reach directly from A?". There are two classic answers. An **adjacency matrix** is a grid with a cell for every pair of vertices. An **adjacency list** keeps, for each vertex, a short list of its neighbours. Their costs differ in a way you can count, so this lesson counts.',
      },
      { type: 'heading', text: 'A real-world picture' },
      {
        type: 'paragraph',
        text: 'The adjacency matrix is the distance chart at the back of a road atlas: towns are listed down the side and across the top, and the cell where a row meets a column holds the distance between those two towns. Every pair of towns has a cell, even a pair with no direct road (that cell is left blank). The adjacency list is the contact list on a phone, kept separately by every person: each person writes down only the people they can call directly.',
      },
      {
        type: 'paragraph',
        text: 'Where the picture stops: finding one cell of the chart is instant, because you go straight to its row and column, while a contact list has to be read through. On the other hand, the chart reserves room for every possible pair, and in a neighbourhood most pairs have no road. That waste is the whole story of this lesson.',
      },
      { type: 'heading', text: 'How it works' },
      {
        type: 'paragraph',
        text: 'To build a matrix, give every vertex a number from 0 to V-1 (a `Map` from name to number does it, as in module 8). The matrix is a V by V grid. Cell `[i][j]` holds the weight of the edge from vertex i to vertex j, or a marker meaning "no edge". We use `null` as the marker, because 0 could be a real weight; an unweighted graph can store `true` and `false`. For an undirected graph we fill both `[i][j]` and `[j][i]`, so the grid is a mirror image across its diagonal. For a directed graph we fill only the cell that matches the arrow.',
      },
      {
        type: 'paragraph',
        text: 'To build a list, use a `Map` from each vertex to an array of its neighbours. For a weighted graph each entry is an object such as `{ to: \'Market\', km: 2 }`. An undirected road is written at both ends, so it appears twice; a directed edge is written once, at its start.',
      },
      {
        type: 'paragraph',
        text: 'Now count the costs, using V for the number of vertices and E for the number of edges. Asking "is there an edge from a to b?" is one cell read in the matrix: O(1). In the list, it means reading a\'s neighbours until b turns up: O(degree of a), unless each vertex also keeps a `Set` of its neighbours (module 8), which makes it O(1) on average. Asking "who are a\'s neighbours?" scans a whole row of V cells in the matrix, O(V), even if a has only two neighbours, while the list hands over exactly the neighbours, O(degree of a). Space is V times V cells for the matrix, O(V²), however few roads exist, but about V + 2E entries for the list, O(V + E).',
      },
      {
        type: 'table',
        headers: ['Question', 'Adjacency matrix', 'Adjacency list'],
        rows: [
          ['Space', 'O(V²) cells, always', 'O(V + E) entries'],
          ['Is there an edge from a to b?', 'O(1): read one cell', 'O(degree of a); O(1) on average with a Set per vertex'],
          ['Who are the neighbours of a?', 'O(V): scan a row', 'O(degree of a): read the list'],
          ['Add an edge', 'O(1): set a cell (two for undirected)', 'O(1): append to a list (two for undirected)'],
          ['Visit every edge', 'O(V²): look at every cell', 'O(V + E)'],
          ['Fits best', 'Small or dense graphs, many edge tests', 'Sparse graphs, which is most real graphs'],
        ],
        caption: 'The same graph, two layouts. V is the number of vertices, E the number of edges.',
      },
      {
        type: 'paragraph',
        text: 'Counting makes the gap concrete. A map of 1,000 junctions with 3,000 two-way roads needs 1,000 x 1,000 = 1,000,000 matrix cells, but only 6,000 list entries (each road is written at both ends). Scale it to 100,000 junctions and 300,000 roads and the matrix needs 10,000,000,000 cells, which is not practical to hold in memory, while the list needs 600,000 entries. Our five-place map is the other extreme: 25 cells against 12 entries, a small difference that no one would notice.',
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: 'In plain words: the matrix is a table with a row and a column for every place. To find out whether a road joins two places, you look at the one box where their row and column meet. The list is a set of short notes, one per place, each naming the places you can reach directly from it. In the code below, `index.get(\'Plaza\')` turns a place name into its row number, and `{ to: b, km }` is a small package holding a neighbour and the distance to it. Both structures hold the same facts. The list is shorter because it writes down only the roads that exist.',
      },
      {
        type: 'paragraph',
        text: 'A graph is **sparse** when it has far fewer edges than the maximum possible (a road map: each junction has a few roads) and **dense** when it is close to the maximum (everyone linked to everyone). The matrix pays for the maximum whatever the graph looks like, so it suits small or dense graphs. The list pays for what exists, so it is the default for everything else. A third layout, the edge list from lesson 44, is easy to store and send but slow to search: finding a vertex\'s neighbours means scanning all E edges.',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: 'The matrix still earns its place. On a dense graph its O(V²) space is proportional to the data anyway, and algorithms that look at every pair of vertices, such as Floyd-Warshall for all-pairs shortest paths, are written directly over a matrix. A boolean matrix can be packed into bits, and its rows sit contiguously in memory, which often helps caches. Large sparse graphs in production usually go the other way: vertices are integer ids rather than names, and the lists are packed into a few flat arrays (a layout often called compressed sparse row) so a million small arrays do not each carry their own overhead. Two further points: removing a vertex from a list graph means deleting it from every neighbour\'s list, and a per-vertex `Set` buys O(1) average edge tests at the price of extra memory.',
      },
      { type: 'heading', text: 'See it in code' },
      {
        type: 'paragraph',
        text: 'Start with the matrix, built from the same `places` and `roads` as lesson 44. We print each row with a dot for "no road".',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'Adjacency matrix from an edge list',
        code: `const places = ['Plaza', 'Market', 'School', 'Clinic', 'Terminal'];
const roads = [
  ['Plaza', 'Market', 2],
  ['Plaza', 'School', 4],
  ['Market', 'School', 1],
  ['Market', 'Terminal', 7],
  ['School', 'Clinic', 3],
  ['Clinic', 'Terminal', 2],
];

const index = new Map();
places.forEach((place, i) => index.set(place, i));

const matrix = [];
for (let row = 0; row < places.length; row++) {
  matrix.push(new Array(places.length).fill(null));
}
for (const [a, b, km] of roads) {
  matrix[index.get(a)][index.get(b)] = km;
  matrix[index.get(b)][index.get(a)] = km;
}
for (const row of matrix) {
  console.log(row.map((cell) => (cell === null ? '.' : cell)).join(' '));
}
console.log(matrix[index.get('Plaza')][index.get('Market')]);
console.log(matrix[index.get('Plaza')][index.get('Terminal')]);`,
      },
      {
        type: 'code',
        language: 'text',
        label: 'Output',
        code: `. 2 4 . .
2 . 1 . 7
4 1 . 3 .
. . 3 . 2
. 7 . 2 .
2
null`,
      },
      {
        type: 'paragraph',
        text: 'Now the list, and the two questions asked of both layouts.',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'Adjacency list, and the same questions on both',
        code: `const list = new Map();
for (const place of places) {
  list.set(place, []);
}
for (const [a, b, km] of roads) {
  list.get(a).push({ to: b, km });
  list.get(b).push({ to: a, km });
}
for (const [place, neighbours] of list) {
  console.log(place, '->', neighbours.map((n) => n.to + '(' + n.km + ')').join(' '));
}

let entries = 0;
for (const neighbours of list.values()) {
  entries += neighbours.length;
}
console.log('matrix cells', places.length * places.length, 'list entries', entries);

// Who are the neighbours of Market?
const row = matrix[index.get('Market')];
const viaMatrix = [];
for (let j = 0; j < row.length; j++) {
  if (row[j] !== null) {
    viaMatrix.push(places[j]);
  }
}
console.log(viaMatrix.join(' '));
console.log(list.get('Market').map((n) => n.to).join(' '));`,
      },
      {
        type: 'code',
        language: 'text',
        label: 'Output',
        code: `Plaza -> Market(2) School(4)
Market -> Plaza(2) School(1) Terminal(7)
School -> Plaza(4) Market(1) Clinic(3)
Clinic -> School(3) Terminal(2)
Terminal -> Market(7) Clinic(2)
matrix cells 25 list entries 12
Plaza School Terminal
Plaza School Terminal`,
      },
      { type: 'heading', text: 'Walk through the code' },
      {
        type: 'list',
        items: [
          '`index` maps each name to its row number: Plaza is 0, Market 1, School 2, Clinic 3, Terminal 4. A matrix needs numbers, a list can use names directly.',
          'The matrix starts as 5 rows of 5 `null`s. For each road, both `[a][b]` and `[b][a]` get the km, which is why the printed grid is the same when mirrored across its diagonal. Plaza (row 0) shows 2 in column 1 (Market) and 4 in column 2 (School).',
          'The list starts as an empty array per place. For each road, `b` is appended to a\'s list and `a` to b\'s list. Forgetting the second push is the classic bug: the graph would silently become directed.',
          'The entry count is 12, exactly twice the 6 roads. The matrix always has 25 cells, even though only 12 of them hold a road.',
          'For Market\'s neighbours, the matrix version has to look at all 5 cells of the row, while the list version reads only its 3 entries. Both give the same answer.',
        ],
      },
      {
        type: 'table',
        headers: ['Road', 'Matrix cells set', 'List entries added'],
        rows: [
          ['Plaza - Market (2)', '[0][1] and [1][0]', 'Plaza gets Market, Market gets Plaza'],
          ['Plaza - School (4)', '[0][2] and [2][0]', 'Plaza gets School, School gets Plaza'],
          ['Market - School (1)', '[1][2] and [2][1]', 'Market gets School, School gets Market'],
        ],
        caption: 'Tracing the first three roads through both builders: every undirected road touches two cells and adds two list entries.',
      },
      { type: 'heading', text: 'Try it with AI' },
      {
        type: 'prompt',
        label: 'Choose a representation with your own numbers',
        text: 'I am learning adjacency matrices and adjacency lists. My graph has 5,000 vertices and about 20,000 undirected edges, and my program mostly lists the neighbours of a vertex. First I will say which representation I would choose and how many matrix cells and list entries each would need. Do not tell me the answer. Ask me questions to check my reasoning, and only then tell me what I got right and what I missed.',
      },
      {
        type: 'prompt',
        label: 'Review generated code',
        text: 'Here is a function that was generated to build an adjacency list for an undirected graph. [paste a short function of your own]. Do not rewrite it. Ask me what each line does, then point out any edge case I did not mention (a vertex with no edges, a repeated edge, an edge to a vertex that is not in the list).',
      },
      {
        type: 'paragraph',
        text: 'What to look for: the AI should name both costs as functions of V and E, and agree with the table above. An AI can also be confidently wrong: it may call an edge test on a list "O(1)" without a `Set`, or say the matrix is always faster. Count cells and entries yourself on your own numbers before you believe either claim.',
      },
      {
        type: 'takeaways',
        items: [
          'An adjacency matrix is a V by V grid: O(V²) space, O(1) edge test, O(V) to list neighbours.',
          'An adjacency list keeps each vertex\'s neighbours: O(V + E) space, and neighbours come in O(degree).',
          'An undirected edge is stored twice in a list and in two cells of a matrix; forgetting one makes the graph directed.',
          'Most real graphs are sparse, so the adjacency list is the default; the matrix suits small or dense graphs.',
          'Count before you choose: 1,000 junctions with 3,000 roads is 1,000,000 cells against 6,000 entries.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: `${ID}-45-fill-blank-1`,
          kind: 'fill-blank',
          title: 'Add a two-way road',
          prompt: 'Complete `addRoad` so a two-way road is recorded at both of its ends. The program should print the neighbours of Market.',
          concept: 'building an adjacency list',
          language: 'javascript',
          code: `const list = { Plaza: [], Market: [], School: [] };

function addRoad(a, b) {
  list[___].push(b);
  list[___].push(a);
}

addRoad('Plaza', 'Market');
addRoad('Market', 'School');
console.log(list.Market.join(' '));`,
          blanks: [
            { answers: ['a'], feedback: 'The first push records b as a neighbour, so it has to go into the list of the place at the other end.' },
            { answers: ['b'], feedback: 'The second push records a as a neighbour of b, so it goes into b\'s list.' },
          ],
          bank: ['a', 'b', 'list', 'Market'],
          tests: { kind: 'output', expected: ['Plaza School'] },
          hints: [
            'A two-way road has two ends, and each end needs the other one in its list.',
            'The first line adds b to a list. Whose list?',
            'The first blank is `a` and the second is `b`.',
          ],
          explanation: 'Pushing b onto a\'s list and a onto b\'s list makes the road work in both directions. Market ends up with both of its neighbours, Plaza and School.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: `${ID}-45-predict-output-1`,
          kind: 'predict-output',
          title: 'Read a directed matrix',
          prompt: 'This graph is directed: an edge `[from, to]` fills only one cell. Predict the three lines printed.',
          concept: 'adjacency matrix',
          language: 'javascript',
          code: `const matrix = [
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
];
const edges = [[0, 1], [1, 2], [2, 0], [0, 2]];
for (const [from, to] of edges) {
  matrix[from][to] = 1;
}
for (const row of matrix) {
  console.log(row.join(''));
}`,
          expected: '011\n001\n100',
          choices: ['011\n001\n100', '010\n101\n010', '010\n001\n101', '011\n101\n110'],
          wrongNotes: {
            '010\n101\n010': 'That grid is mirrored across the diagonal, which happens for undirected edges. Here each edge fills only the cell at [from][to].',
            '010\n001\n101': 'Row 0 should have two 1s: the edges 0 to 1 and 0 to 2 both start at vertex 0.',
            '011\n101\n110': 'That is every pair joined both ways. Only four cells are set, one per edge.',
          },
          hints: [
            'Row number is where the edge starts, column number is where it ends.',
            'Vertex 0 has two edges leaving it: to 1 and to 2.',
            'Row 1 has a single 1 (column 2), and row 2 has a single 1 (column 0).',
          ],
          explanation: 'Edge 0 to 1 sets row 0 column 1, 1 to 2 sets row 1 column 2, 2 to 0 sets row 2 column 0, and 0 to 2 sets row 0 column 2. Row 0 is 011, row 1 is 001 and row 2 is 100, and the grid is not symmetric because the graph is directed.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: `${ID}-45-scenario-1`,
          kind: 'scenario',
          title: 'Walking links between 60,000 intersections',
          prompt: 'Choose the representation that fits the job.',
          concept: 'choosing a graph representation',
          situation: 'A map app stores walking links between 60,000 intersections. Each intersection links to at most 5 others. The main job, repeated all day, is to list the intersections you can walk to directly from the one you are standing at.',
          options: [
            { text: 'An adjacency list: one short array of neighbours per intersection', consequence: 'About 60,000 small lists and at most 300,000 entries, and each look-up reads only the few neighbours that exist. This fits.', quality: 'best' },
            { text: 'An adjacency matrix with a row and column for every intersection', consequence: '60,000 x 60,000 is 3.6 billion cells, almost all empty, and listing neighbours means scanning a row of 60,000. The memory cost alone rules it out.', quality: 'poor' },
            { text: 'A single edge list of every link, scanned each time', consequence: 'It stores little, but every neighbour question reads every link, up to about 300,000 checks each time. It works and is slow for this job.', quality: 'acceptable' },
          ],
          hints: [
            'Is this graph sparse or dense? Compare 5 links per intersection with 60,000 possible neighbours.',
            'Count the matrix cells: 60,000 times 60,000.',
            'The job asks for neighbours, which is exactly what a list keeps ready.',
          ],
          explanation: 'Each intersection has a handful of links among 60,000 possible, so the graph is very sparse. An adjacency list stores only what exists and answers the neighbour question directly; a matrix would pay for 3.6 billion mostly empty cells.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: `${ID}-45-code-challenge-1`,
          kind: 'code-challenge',
          title: 'From a matrix to a list',
          prompt: 'Write `matrixToList(matrix)`. The matrix is a square grid of 0 and 1 where `matrix[i][j] === 1` means an edge from vertex i to vertex j. Return an array where entry i is the array of vertices j that i has an edge to, in increasing order.',
          concept: 'converting a graph representation',
          language: 'javascript',
          starter: `function matrixToList(matrix) {
  // entry i lists the neighbours of vertex i
}
`,
          solution: `function matrixToList(matrix) {
  const list = [];
  for (let i = 0; i < matrix.length; i++) {
    const neighbours = [];
    for (let j = 0; j < matrix[i].length; j++) {
      if (matrix[i][j] === 1) {
        neighbours.push(j);
      }
    }
    list.push(neighbours);
  }
  return list;
}
`,
          tests: {
            kind: 'function',
            fn: 'matrixToList',
            cases: [
              { label: 'a path of three', args: [[[0, 1, 0], [1, 0, 1], [0, 1, 0]]], expected: [[1], [0, 2], [1]] },
              { label: 'directed edges', args: [[[0, 1, 1], [0, 0, 1], [1, 0, 0]]], expected: [[1, 2], [2], [0]] },
              { label: 'no edges at all', args: [[[0, 0], [0, 0]]], expected: [[], []] },
              { label: 'one vertex', args: [[[0]]], expected: [[]] },
              {
                label: 'a ring of 100 (hidden)',
                args: [Array.from({ length: 100 }, (_, i) => Array.from({ length: 100 }, (_, j) => (j === (i + 1) % 100 || j === (i + 99) % 100 ? 1 : 0)))],
                expected: Array.from({ length: 100 }, (_, i) => [(i + 1) % 100, (i + 99) % 100].sort((x, y) => x - y)),
                hidden: true,
              },
            ],
          },
          hints: [
            'Make one neighbour array per row, and keep the rows in order.',
            'Inside a row, check every column. A 1 means the column number is a neighbour.',
            'Loop over rows i and columns j; when `matrix[i][j] === 1`, push j into row i\'s array, then push that array onto the result.',
          ],
          explanation: 'Reading a row of the matrix and keeping the column numbers that hold a 1 gives that vertex\'s neighbours. Doing it for every row costs one look at each of the V² cells, which is the price of starting from a matrix.',
        },
      },
    ],
    quiz: [
      {
        id: `${ID}-45-q1`,
        prompt: 'Your graph has 2,000 vertices and 5,000 edges, and your code mostly asks "which neighbours does this vertex have?". Which representation fits?',
        choices: [
          'An adjacency matrix, because it answers every kind of question about the graph in constant time',
          'An edge list, because it stores each edge only once',
          'An adjacency list, because it holds exactly the neighbours and uses about V + E entries',
          'A matrix of strings, because names are easier to read',
        ],
        answer: 2,
        explanation: 'The graph is sparse, 5,000 edges out of nearly two million possible pairs, and the job is a neighbour look-up, which is what a list stores directly.',
      },
      {
        id: `${ID}-45-q2`,
        prompt: 'In a road map where every junction has at most 6 roads, what happens to the space of each representation as the number of junctions V grows?',
        choices: [
          'Both grow about as fast as V squared',
          'The matrix grows with V squared, while the list grows roughly with V',
          'The list grows with V squared, while the matrix grows roughly with V',
          'Neither grows, because the number of roads per junction is fixed',
        ],
        answer: 1,
        explanation: 'The matrix always has V x V cells. With at most 6 roads per junction the list holds at most 6V entries, so it grows about in step with V.',
      },
      {
        id: `${ID}-45-q3`,
        prompt: 'You store an undirected graph as an adjacency list and add the road between A and B. What must the code do?',
        choices: ['Rebuild every list from scratch', 'Set one cell of a grid to 1', 'Add B to A\'s list only, because the road is stored once', 'Add B to A\'s list and A to B\'s list'],
        answer: 3,
        explanation: 'An undirected road can be followed from either end, so each end lists the other. Storing it once would make the graph directed.',
      },
      {
        id: `${ID}-45-q4`,
        prompt: 'A small graph of 40 vertices must answer many questions of the form "is there a direct road from X to Y?" and nothing else. What is a good reason to choose the matrix?',
        choices: [
          'It uses less memory than a list on every graph',
          'It lists the neighbours of a vertex faster than a list does',
          'It cannot store weights, which keeps it simple',
          'Each question reads a single cell, so every answer takes constant time',
        ],
        answer: 3,
        explanation: 'A matrix answers an edge test with one cell read, O(1). It does not use less memory or list neighbours faster, but for a small graph with only edge tests that does not matter.',
      },
      {
        id: `${ID}-45-q5`,
        audience: { max: 'beginner' },
        prompt: 'In the phone contact picture, which one is the adjacency list?',
        choices: [
          'A chart with every person down the side and across the top',
          'Each person keeping a short list of the people they can call directly',
          'One long list of every pair of people in the world',
          'A single number counting all the calls made',
        ],
        answer: 1,
        explanation: 'The adjacency list is a short list of neighbours kept for each vertex. The chart with a row and column for everyone is the matrix.',
      },
      {
        id: `${ID}-45-q6`,
        audience: { min: 'advanced' },
        prompt: 'A logistics job needs the shortest distance between every pair of 300 warehouses, and nearly every pair has a direct truck route. Which statement best supports using a matrix?',
        choices: [
          'Matrices always take less memory than adjacency lists, whatever the number of edges',
          'The graph is dense, so O(V²) space matches the data, and all-pairs algorithms read cells',
          'Adjacency lists cannot store weights',
          'A matrix needs no vertex numbering, so it is easier to write',
        ],
        answer: 1,
        explanation: 'On a dense graph the matrix wastes little, and all-pairs algorithms such as Floyd-Warshall are naturally written over a matrix. The other statements are false: lists store weights, and a matrix needs vertex numbers.',
      },
    ],
    task: {
      title: 'Both layouts for your own map',
      minutes: 20,
      steps: [
        'Take the graph you drew in lesson 44, or the barangay map, and write its edges as a JavaScript edge list.',
        'Build an adjacency matrix and an adjacency list from it, using the code in this lesson as a guide, and print both.',
        'Count the matrix cells and the list entries. Which is smaller, and by how much?',
        'Answer "is there a road from X to Y?" both ways and count how many cells or entries each way had to look at.',
      ],
    },
    taskExtra: [
      {
        audience: { max: 'beginner' },
        steps: ['Ask an AI assistant to explain your finished code line by line, then tell it in your own words what `index.get(a)` does and check that it agrees.'],
      },
      {
        audience: { min: 'advanced' },
        steps: [
          'Add a `Set` of neighbours to each vertex of the list and measure, by counting comparisons, the difference in an edge test for a vertex with many neighbours.',
          'Write down the break-even: for your V, at what number of edges would the matrix use fewer cells than the list uses entries?',
        ],
      },
    ],
  },
  {
    id: `${ID}-46`,
    day: 46,
    title: 'Graph Traversal: Breadth-First and Depth-First Search',
    summary: 'Visit every vertex you can reach, once each, with a queue (breadth-first) or a stack (depth-first), and use the queue to find the route with the fewest roads.',
    minutes: 30,
    skills: ['graphs', 'linked-structures', 'patterns'],
    intro: {
      objectives: [
        'Trace breadth-first and depth-first search by hand, showing the queue or stack and the visited set',
        'Write BFS and DFS and use a visited set so cycles cannot trap them',
        'Find the path with the fewest edges, and state the cost of each search as O(V + E)',
      ],
      why: 'Almost every graph algorithm, from "friends of friends" to route finding to detecting loops, is a traversal with a small addition. If you can read BFS and DFS, you can read and review most graph code an AI assistant gives you.',
    },
    body: [
      {
        type: 'paragraph',
        text: 'A **traversal** visits every vertex that can be reached from a starting vertex, in a systematic order, without visiting any vertex twice. There are two main strategies. **Breadth-first search (BFS)** explores outward in rounds: first the start, then everything one road away, then everything two roads away. **Depth-first search (DFS)** goes as far as it can along one road, and only when it hits a dead end does it back up and try another. They differ by one data structure, a queue for BFS and a stack for DFS, and that single difference changes what they are good for.',
      },
      { type: 'heading', text: 'A real-world picture' },
      {
        type: 'paragraph',
        text: 'BFS is news spreading in a group chat. You tell your friends. In the next round each of them tells their friends. Then those friends tell theirs. News always reaches people one step away before people two steps away. DFS is exploring a maze with a piece of chalk: you follow one corridor until it ends, mark the junctions you passed, walk back to the last junction that still has an unexplored branch, and try that.',
      },
      {
        type: 'paragraph',
        text: 'Where the picture stops being accurate: a program visits one vertex at a time, not everyone in a round at once. The "rounds" of BFS are just the order in which vertices come out of the queue.',
      },
      { type: 'heading', text: 'How it works' },
      {
        type: 'paragraph',
        text: 'The first problem is cycles. In our map you can walk Plaza, Market, School, Plaza and be back where you began. A search that does not remember where it has been would walk around that loop forever. So both searches keep a **visited** (or "seen") set, a `Set` from module 8, and never put a vertex in the waiting list twice.',
      },
      {
        type: 'paragraph',
        text: 'BFS keeps a **queue** (module 7) of vertices waiting to be explored. It starts with the start vertex, marked as seen. Then it repeats: take the vertex at the front, visit it, and for each neighbour not yet seen, mark it as seen and add it to the back. We mark a vertex when it is **discovered**, not when it is taken from the queue, so it can never be in the queue twice. Because the queue is first in, first out, everything one road from the start is taken before everything two roads away, and so on, level by level.',
      },
      {
        type: 'paragraph',
        text: 'That ordering is what makes BFS find the route with the **fewest roads**. A vertex is discovered the first time any path reaches it, and by then all vertices closer to the start have already been processed, so no shorter path to it can appear later. To get the route itself, remember for each discovered vertex who discovered it (its **parent**). When you reach the target, follow the parents back to the start and reverse the list. Note that this counts roads, not km: lesson 48 handles distance.',
      },
      {
        type: 'paragraph',
        text: 'DFS can use recursion: visit a vertex, then call DFS on each neighbour that has not been seen. The **call stack** (module 9) remembers the way back. The same search can be written with an explicit **stack**: pop a vertex, skip it if seen, otherwise visit it and push its unseen neighbours. Pushing the neighbours in reverse order makes the first neighbour come out first, so the two versions visit in the same order. One practical limit: recursion depth. A graph shaped like a very long chain would need one call per vertex, and every language limits how deep calls may nest (the Talino code runner stops at about 200). The explicit stack has no such limit.',
      },
      {
        type: 'visual',
        id: 'graph-bfs-dfs',
        caption: 'Choose Graph 1, start at A, and press Next with BFS selected, then again with DFS. Watch the waiting list: BFS takes from the front of a queue, DFS from the top of a stack. Compare the two visit orders at the end.',
      },
      {
        type: 'paragraph',
        text: 'The cost. With an adjacency list, each vertex is put in the queue at most once (V in total), and each neighbour entry is looked at once as its vertex is processed (2E entries for an undirected graph). So BFS and DFS both take O(V + E). With an adjacency matrix, finding a vertex\'s neighbours scans a whole row, so the same searches take O(V²). Taking the front of a queue with `shift()` costs O(n) in the model we use (module 7), so our BFS keeps a `head` position instead and never removes anything: each step is O(1).',
      },
      {
        type: 'table',
        headers: ['', 'Breadth-first (BFS)', 'Depth-first (DFS)'],
        rows: [
          ['Waiting list', 'Queue (first in, first out)', 'Stack (last in, first out) or the call stack'],
          ['Order', 'Level by level, nearest first', 'Deep along one road, then back up'],
          ['Fewest roads to a vertex?', 'Yes, in an unweighted graph', 'No: it may find a long way round first'],
          ['Time with an adjacency list', 'O(V + E)', 'O(V + E)'],
          ['Memory held', 'The frontier: can be as wide as a whole level', 'The current road: as deep as the longest road'],
          ['Typical uses', 'Fewest hops, friends within two steps', 'Is there a path at all, cycles, ordering, exploring everything'],
        ],
        caption: 'Same cost, different behaviour: choose by the question you are asking.',
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: 'In plain words: both searches are ways of walking through a map without getting lost or going in circles. Each keeps a list of places still to look at, and a note of places already visited. BFS takes the oldest place on its list first, like a line at a store where the first person in line is served first. DFS takes the newest place first, like a pile of plates where you take the one on top. The code below stores the map as an object: each place name is a key, and its value is an array of the places next to it. `queue[head]` reads the front of the line, and `head++` moves the front forward by one.',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: 'Three things matter in real codebases. First, mark-on-discovery in BFS versus mark-on-visit in an explicit-stack DFS: the DFS stack may hold the same vertex several times, which is fine for time (each entry is popped once, at most 2E in total) but means the stack can hold O(E) entries, not O(V). Second, BFS memory is the frontier width, which on a wide graph can be most of V, while DFS holds the depth of the current path. Third, a recursive DFS that works on a test graph may overflow the call stack on a production one: any traversal over data you do not control should use an explicit stack or a bounded depth. For huge graphs that do not fit in memory, traversal becomes a paging problem, which module 17 touches on.',
      },
      { type: 'heading', text: 'See it in code' },
      {
        type: 'paragraph',
        text: 'We use the same seven-vertex graph as the visual (Graph 1), with neighbours in alphabetical order. First, BFS that returns the order in which vertices are visited.',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'Breadth-first search',
        code: `const graph = {
  A: ['B', 'C'],
  B: ['A', 'D', 'E'],
  C: ['A', 'F', 'G'],
  D: ['B'],
  E: ['B', 'F'],
  F: ['C', 'E'],
  G: ['C'],
};

function bfs(graph, start) {
  const order = [];
  const queue = [start];
  let head = 0;
  const seen = new Set([start]);
  while (head < queue.length) {
    const current = queue[head];
    head++;
    order.push(current);
    for (const next of graph[current]) {
      if (!seen.has(next)) {
        seen.add(next);
        queue.push(next);
      }
    }
  }
  return order;
}

console.log(bfs(graph, 'A').join(' '));`,
      },
      {
        type: 'code',
        language: 'text',
        label: 'Output',
        code: 'A B C D E F G',
      },
      {
        type: 'paragraph',
        text: 'Now the fewest-roads route. The only change is a `parent` map that replaces the `seen` set (a vertex is seen when it has a parent), plus a loop that walks the parents backwards. It uses the barangay map, stored the same way.',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'The route with the fewest roads',
        code: `const map = {
  Plaza: ['Market', 'School'],
  Market: ['Plaza', 'School', 'Terminal'],
  School: ['Plaza', 'Market', 'Clinic'],
  Clinic: ['School', 'Terminal'],
  Terminal: ['Market', 'Clinic'],
};

function fewestRoads(graph, from, to) {
  const parent = new Map();
  parent.set(from, null);
  const queue = [from];
  let head = 0;
  while (head < queue.length) {
    const current = queue[head];
    head++;
    if (current === to) {
      break;
    }
    for (const next of graph[current]) {
      if (!parent.has(next)) {
        parent.set(next, current);
        queue.push(next);
      }
    }
  }
  if (!parent.has(to)) {
    return null;
  }
  const path = [];
  let step = to;
  while (step !== null) {
    path.push(step);
    step = parent.get(step);
  }
  return path.reverse();
}

console.log(fewestRoads(map, 'Plaza', 'Terminal').join(' > '));
console.log(fewestRoads(map, 'Clinic', 'Clinic').join(' > '));
console.log(fewestRoads({ A: ['B'], B: ['A'], C: [] }, 'A', 'C'));`,
      },
      {
        type: 'code',
        language: 'text',
        label: 'Output',
        code: `Plaza > Market > Terminal
Clinic
null`,
      },
      {
        type: 'paragraph',
        text: 'Finally, DFS twice: recursively, and with an explicit stack. They must visit in the same order. These use the seven-vertex `graph` from the first block.',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'Depth-first search, recursive and with a stack',
        code: `function dfs(graph, vertex, visited, order) {
  visited.add(vertex);
  order.push(vertex);
  for (const next of graph[vertex]) {
    if (!visited.has(next)) {
      dfs(graph, next, visited, order);
    }
  }
  return order;
}

function dfsStack(graph, start) {
  const order = [];
  const visited = new Set();
  const stack = [start];
  while (stack.length > 0) {
    const current = stack.pop();
    if (visited.has(current)) {
      continue;
    }
    visited.add(current);
    order.push(current);
    const neighbours = graph[current];
    for (let i = neighbours.length - 1; i >= 0; i--) {
      if (!visited.has(neighbours[i])) {
        stack.push(neighbours[i]);
      }
    }
  }
  return order;
}

console.log(dfs(graph, 'A', new Set(), []).join(' '));
console.log(dfsStack(graph, 'A').join(' '));`,
      },
      {
        type: 'code',
        language: 'text',
        label: 'Output',
        code: `A B D E F C G
A B D E F C G`,
      },
      { type: 'heading', text: 'Walk through the code' },
      {
        type: 'paragraph',
        text: 'Here is BFS on the seven-vertex graph, one loop turn per row. "Queue" shows what is still waiting after the turn (everything from `head` onward).',
      },
      {
        type: 'table',
        headers: ['Turn', 'Take from front', 'New vertices added', 'Queue now', 'Visit order so far'],
        rows: [
          ['1', 'A', 'B, C', 'B, C', 'A'],
          ['2', 'B', 'D, E (A is already seen)', 'C, D, E', 'A B'],
          ['3', 'C', 'F, G (A is already seen)', 'D, E, F, G', 'A B C'],
          ['4', 'D', 'none (B is seen)', 'E, F, G', 'A B C D'],
          ['5', 'E', 'none (B and F are seen)', 'F, G', 'A B C D E'],
          ['6', 'F', 'none', 'G', 'A B C D E F'],
          ['7', 'G', 'none', '(empty)', 'A B C D E F G'],
        ],
        caption: 'Tracing bfs(graph, "A"). Vertices leave the queue in the order they entered it.',
      },
      {
        type: 'list',
        items: [
          'In `bfs`, `seen` starts with the start vertex. A neighbour is added to `seen` at the moment it joins the queue, which is why E, taken at turn 5, does not add F again: F joined the queue at turn 3.',
          'The loop ends when `head` catches up with the queue\'s length, meaning every discovered vertex has been taken. The work is 7 vertices and 14 neighbour looks (twice the 7 edges), which is the O(V + E) count.',
          'In `fewestRoads`, `parent.set(next, current)` records who discovered each place. From Plaza the search discovers Market and School, then from Market it discovers Terminal, with parent Market. Walking back from Terminal gives Terminal, Market, Plaza, and `reverse()` turns it round.',
          '`fewestRoads` stops early when it takes `to` from the queue. When the target is never discovered, it returns `null` (the third example: C has no road to A).',
          'In `dfs`, each neighbour is explored completely before the next one. From A it goes to B, then B\'s first unseen neighbour D (a dead end), then E, then F, then C and G. The recursion returns, one level at a time, once a vertex has no unseen neighbours.',
          '`dfsStack` pushes neighbours in reverse, so the alphabetically first neighbour sits on top and is explored first. It checks `visited` again when popping, because a vertex can be pushed twice before it is visited.',
        ],
      },
      { type: 'heading', text: 'Try it with AI' },
      {
        type: 'prompt',
        label: 'Trace first, then ask',
        text: 'Here is a small graph as an object: { S: ["A","B"], A: ["S","C"], B: ["S","C","D"], C: ["A","B"], D: ["B"] }. I will write down the BFS visit order from S and the DFS visit order from S (neighbours taken in the order listed) and send them to you. Do not give me the answers first. Check mine, and if either is wrong, ask me a question that helps me see which step went wrong.',
      },
      {
        type: 'prompt',
        label: 'Review a generated search',
        text: 'Write a JavaScript function that finds the route with the fewest roads between two places in a graph stored as an object of arrays. Before you write it, tell me in two sentences how it will avoid going in circles. After the code, give me its time complexity in terms of V and E, and three tests including a place that cannot be reached. I will predict the output of each test before I run them.',
      },
      {
        type: 'paragraph',
        text: 'What to look for: the generated code must mark vertices as seen when it adds them (or check on removal), and its complexity should be O(V + E). An AI can be confidently wrong in two common ways here: it may use `queue.shift()` and still claim O(V + E), when in our model each shift costs O(n); and it may present a DFS as "finding the shortest path". Test the second claim on the barangay map: DFS can return a route that has more roads than necessary.',
      },
      {
        type: 'takeaways',
        items: [
          'BFS uses a queue and visits nearest first; DFS uses a stack (or recursion) and goes deep before backing up.',
          'Both need a visited set, or a cycle sends them round forever.',
          'BFS finds the route with the fewest edges in an unweighted graph; a parent map lets you rebuild the route.',
          'On an adjacency list both searches cost O(V + E); on an adjacency matrix they cost O(V²).',
          'Deep recursion can overflow the call stack, so an explicit stack is the safe form of DFS for big graphs.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: `${ID}-46-predict-output-1`,
          kind: 'predict-output',
          title: 'Trace a BFS',
          prompt: 'This BFS records how many roads each place is from S. Predict the two lines it prints.',
          concept: 'breadth-first search',
          language: 'javascript',
          code: `const graph = { S: ['A', 'B'], A: ['S', 'C'], B: ['S', 'C', 'D'], C: ['A', 'B'], D: ['B'] };
const dist = { S: 0 };
const queue = ['S'];
let head = 0;
while (head < queue.length) {
  const current = queue[head];
  head++;
  for (const next of graph[current]) {
    if (dist[next] === undefined) {
      dist[next] = dist[current] + 1;
      queue.push(next);
    }
  }
}
console.log(queue.join(' '));
console.log(dist.C, dist.D);`,
          expected: 'S A B C D\n2 2',
          choices: ['S A B C D\n2 2', 'S A C B D\n2 2', 'S A B C D\n3 2', 'S A B D C\n2 2'],
          wrongNotes: {
            'S A C B D\n2 2': 'That is what a depth-first search might do. BFS finishes both neighbours of S (A and B) before anything farther away.',
            'S A B C D\n3 2': 'C is discovered from A, which is one road from S, so C is 2 roads away, not 3.',
            'S A B D C\n2 2': 'A is taken first and discovers C before B discovers D, so C joins the queue before D.',
          },
          hints: [
            'Write the queue after each turn. S discovers A and B first.',
            'A is taken next. Its unseen neighbour is C. Then B is taken and discovers D (C is already seen).',
            'The queue ends as S A B C D. C was discovered from A (distance 1), so its distance is 2; D was discovered from B, so also 2.',
          ],
          explanation: 'Turn 1 takes S and adds A and B. Turn 2 takes A and adds C. Turn 3 takes B, whose neighbours S and C are already seen, and adds D. Both C and D were discovered from a vertex one road away, so both are 2 roads from S.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: `${ID}-46-fix-bug-1`,
          kind: 'fix-bug',
          title: 'The search that never stops',
          prompt: 'This DFS should print the vertices of the triangle once each, `A B C`, but it crashes. Tap the buggy line, then choose the fix.',
          concept: 'visited set in graph search',
          language: 'javascript',
          code: `const graph = { A: ['B', 'C'], B: ['A', 'C'], C: ['A', 'B'] };
function dfs(vertex, visited, order) {
  visited.add(vertex);
  order.push(vertex);
  for (const next of graph[vertex]) {
    dfs(next, visited, order);
  }
}
const order = [];
dfs('A', new Set(), order);
console.log(order.join(' '));`,
          bugLine: 6,
          fixes: [
            { line: 'if (!visited.has(next)) dfs(next, visited, order);', correct: true, why: 'Only vertices not yet visited are explored, so each vertex is entered once and the triangle cannot send the search round and round.' },
            { line: 'if (visited.has(next)) dfs(next, visited, order);', correct: false, why: 'This explores only vertices that were already visited, so the search stops at A and prints just A.' },
            { line: 'if (next !== vertex) dfs(next, visited, order);', correct: false, why: 'This avoids a vertex calling itself but not the loop A, B, C, A, so the recursion still never ends.' },
          ],
          tests: { kind: 'output', expected: ['A B C'] },
          lineNote: 'The visited set is filled in, but look at where it is used. Which line decides whether to explore a neighbour?',
          hints: [
            'The triangle is a cycle: A leads to B, B to C, and C back to A.',
            'The program adds each vertex to `visited` but never asks whether a neighbour is in it.',
            'Check `visited` before the recursive call, and call only for neighbours that are not visited yet.',
          ],
          explanation: 'Without a check, the loop A, B, C, A, B... never ends and the call stack overflows. Asking `!visited.has(next)` before recursing makes each vertex be explored once.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: `${ID}-46-scenario-1`,
          kind: 'scenario',
          title: 'Friends within two steps',
          prompt: 'Pick the search that fits the job.',
          concept: 'choosing BFS or DFS',
          situation: 'A social app suggests people you may know: everyone who is a friend of a friend of Ana, but not yet her friend. Friendships are stored as an adjacency list.',
          options: [
            { text: 'Breadth-first search from Ana, stopping after two rounds', consequence: 'Round one finds her friends and round two finds their friends, then the search stops. Exactly the people at distance two are found, and nothing farther is explored.', quality: 'best' },
            { text: 'Depth-first search from Ana, exploring everything it can reach', consequence: 'DFS goes deep along one chain of friends first, so it reaches people ten steps away before finishing Ana\'s own friends. You would have to filter by distance afterwards, and DFS does not track it for you.', quality: 'poor' },
            { text: 'Check every pair of people in the app against Ana', consequence: 'It gives the right answer, but it ignores the graph and looks at every user for every suggestion. It is far more work than exploring only two rounds.', quality: 'acceptable' },
          ],
          hints: [
            'Which words in the situation talk about distance: "friend of a friend"?',
            'One search explores in rounds of increasing distance from the start. Which one?',
            'BFS takes everyone one step away before anyone two steps away, so you can stop after round two.',
          ],
          explanation: 'BFS explores nearest first, so "within two steps" is just two rounds. DFS has no sense of distance, so it would wander deep before covering the nearby people.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: `${ID}-46-code-challenge-1`,
          kind: 'code-challenge',
          title: 'How many roads?',
          prompt: 'Write `fewestRoads(graph, from, to)`. `graph` is an object mapping each place to an array of its neighbours. Return the smallest number of roads between `from` and `to`, or -1 if `to` cannot be reached. The same place to itself is 0 roads.',
          concept: 'shortest path in an unweighted graph',
          language: 'javascript',
          starter: `function fewestRoads(graph, from, to) {
  // breadth-first search, remembering how far each place is
}
`,
          solution: `function fewestRoads(graph, from, to) {
  const dist = { [from]: 0 };
  const queue = [from];
  let head = 0;
  while (head < queue.length) {
    const current = queue[head];
    head++;
    if (current === to) {
      return dist[current];
    }
    for (const next of graph[current]) {
      if (dist[next] === undefined) {
        dist[next] = dist[current] + 1;
        queue.push(next);
      }
    }
  }
  return -1;
}
`,
          tests: {
            kind: 'function',
            fn: 'fewestRoads',
            cases: [
              { label: 'Plaza to Terminal', args: [{ Plaza: ['Market', 'School'], Market: ['Plaza', 'School', 'Terminal'], School: ['Plaza', 'Market', 'Clinic'], Clinic: ['School', 'Terminal'], Terminal: ['Market', 'Clinic'] }, 'Plaza', 'Terminal'], expected: 2 },
              { label: 'same place', args: [{ A: ['B'], B: ['A'] }, 'A', 'A'], expected: 0 },
              { label: 'unreachable', args: [{ A: ['B'], B: ['A'], C: [] }, 'A', 'C'], expected: -1 },
              { label: 'a shortcut exists', args: [{ A: ['B', 'D'], B: ['A', 'C'], C: ['B', 'D'], D: ['A', 'C'] }, 'A', 'C'], expected: 2 },
              {
                label: 'a chain of 150 places (hidden)',
                args: [Object.fromEntries(Array.from({ length: 150 }, (_, i) => [`P${i}`, [...(i > 0 ? [`P${i - 1}`] : []), ...(i < 149 ? [`P${i + 1}`] : [])]])), 'P0', 'P149'],
                expected: 149,
                hidden: true,
              },
              {
                label: 'a ring with a cycle (hidden)',
                args: [Object.fromEntries(Array.from({ length: 60 }, (_, i) => [`R${i}`, [`R${(i + 1) % 60}`, `R${(i + 59) % 60}`]])), 'R0', 'R30'],
                expected: 30,
                hidden: true,
              },
            ],
          },
          hints: [
            'Use a queue and a way to remember which places are already discovered, so cycles cannot trap the search.',
            'Store a distance for each discovered place: the start is 0, and a neighbour discovered from `current` is `dist[current] + 1`.',
            'Return the distance when you reach `to`, and return -1 if the queue runs out first.',
          ],
          explanation: 'BFS discovers places in order of their distance from the start, so the first time `to` is reached its distance is the smallest number of roads. If the queue empties without reaching it, there is no route.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: `${ID}-46-match-1`,
          kind: 'match',
          title: 'Count the work',
          prompt: 'Match each piece of work in a graph search to its cost, using V vertices and E edges.',
          concept: 'complexity of graph traversal',
          labels: { terms: 'Work', meanings: 'Cost' },
          pairs: [
            { term: 'BFS over an adjacency list', definition: 'O(V + E)', note: 'Each vertex enters the queue once and each neighbour entry is read once.' },
            { term: 'BFS over an adjacency matrix', definition: 'O(V²)', note: 'Each of the V vertices scans a whole row of V cells.' },
            { term: 'Taking the front with queue.shift() on an array, once per vertex, in our model', definition: 'O(V²) in total', note: 'Each shift costs O(n) in our model and there are V of them, so a head position is better.' },
            { term: 'Rebuilding the route from a parent map', definition: 'O(length of the route)', note: 'It walks back one parent per step and never looks at the rest of the graph.' },
          ],
          hints: [
            'Count how many times each piece of work is repeated, and how much each repetition costs.',
            'A matrix row has V cells whether or not they hold a road.',
            'The route rebuild touches only the places on the route.',
          ],
          explanation: 'On a list the search touches each vertex and each edge a constant number of times. A matrix makes every vertex read a full row. A shift on an array costs O(n) in our model, and doing it V times adds up to O(V²). The route rebuild follows only the route.',
        },
      },
    ],
    quiz: [
      {
        id: `${ID}-46-q1`,
        prompt: 'Why does a graph search need a visited set?',
        choices: [
          'A graph can contain cycles, so without it the search could walk round a loop forever',
          'A visited set sorts the vertices into alphabetical order so that the output is always the same',
          'The queue cannot hold more than one copy of a string, so duplicates would be thrown away',
          'It makes the search visit the nearest vertices first, which is what a queue alone cannot do',
        ],
        answer: 0,
        explanation: 'In a cyclic graph a path can lead back to a vertex already visited. Remembering visited vertices breaks the loop and ensures every vertex is processed once.',
      },
      {
        id: `${ID}-46-q2`,
        prompt: 'BFS on the barangay map finds Plaza, Market, Terminal (2 roads, 9 km). A route of 4 roads totals 8 km. What does BFS guarantee here?',
        choices: [
          'The route with the smallest total km, which is the 4-road one',
          'That the route is the only one between the two places',
          'The route with the largest number of roads',
          'The route with the fewest roads, but not necessarily the fewest km',
        ],
        answer: 3,
        explanation: 'BFS counts roads, so it finds the fewest roads. It knows nothing about distances, so it can miss a route with more roads but fewer km. Lesson 48 handles that case.',
      },
      {
        id: `${ID}-46-q3`,
        prompt: 'Which data structures drive breadth-first search and an iterative depth-first search?',
        choices: ['A stack for BFS and a queue for DFS', 'A queue for BFS and a stack for DFS', 'A queue for both', 'A sorted array for both'],
        answer: 1,
        explanation: 'BFS must serve the vertex that has waited longest, which is a queue. Iterative DFS must continue with the newest vertex, which is a stack.',
      },
      {
        id: `${ID}-46-q4`,
        prompt: 'A map has V places and E roads, stored as an adjacency list. What is the running time of BFS?',
        choices: ['O(V²)', 'O(E²)', 'O(V log V)', 'O(V + E)'],
        answer: 3,
        explanation: 'Each vertex enters the queue at most once, and each entry of every neighbour list is looked at once: V plus about 2E, which is O(V + E).',
      },
      {
        id: `${ID}-46-q5`,
        audience: { max: 'beginner' },
        prompt: 'News spreads from you to your friends, then from them to their friends, in rounds. Which search does this look like?',
        choices: ['Breadth-first search', 'Depth-first search', 'Binary search', 'No search: it is sorting'],
        answer: 0,
        explanation: 'Spreading outward round by round, nearest people first, is exactly what breadth-first search does with its queue.',
      },
      {
        id: `${ID}-46-q6`,
        audience: { min: 'advanced' },
        prompt: 'A recursive DFS crashes with a stack overflow on a graph that is one chain of 100,000 vertices. What is the most direct fix that keeps the depth-first order?',
        choices: [
          'Use an explicit stack in a loop, so depth is bounded by memory, not the call stack',
          'Switch to BFS, which visits the vertices in the very same order as DFS',
          'Use an adjacency matrix instead of lists, which removes the recursion depth',
          'Skip the visited set, since a chain has no cycle',
        ],
        answer: 0,
        explanation: 'The recursion depth equals the chain length. An explicit stack in a loop keeps the same visit order without nesting calls. BFS visits in a different order, and the matrix does not change the depth.',
      },
    ],
    task: {
      title: 'Search your own map',
      minutes: 20,
      steps: [
        'Write the barangay map as an object of arrays (or your own graph from lesson 44), then run BFS by hand on paper: write the queue and the visit order after every turn, as in the table above.',
        'Copy `fewestRoads` and run it for three pairs of places, including one pair with no route (add a place with no roads).',
        'Add a counter inside the neighbour loop and check that after a full BFS it equals twice the number of roads.',
        'Run `dfs` and `bfs` from the same start. Do they visit in the same order? Explain any difference.',
      ],
    },
    taskExtra: [
      {
        audience: { max: 'beginner' },
        steps: ['Before you run each function, write down the output you expect. Then run it and, if it differs, trace the queue by hand to find out why.'],
      },
      {
        audience: { min: 'advanced' },
        steps: [
          'Change `dfsStack` to mark vertices when pushed instead of when popped, compare the visit order with the recursive DFS, and explain the difference.',
          'Build a chain of 1,000 places and run the recursive `dfs` and the stack version. Report what happens and why.',
        ],
      },
    ],
  },
  {
    id: `${ID}-47`,
    day: 47,
    title: 'Cycles, Connected Components and Topological Sorting',
    summary: 'Use traversal to detect cycles in undirected and directed graphs, split a graph into connected components, and order tasks with Kahn\'s algorithm.',
    minutes: 30,
    skills: ['graphs', 'patterns'],
    intro: {
      objectives: [
        'Detect a cycle in an undirected graph with a parent check and in a directed graph with three states',
        'Count and list the connected components of a graph',
        'Produce a valid task order with Kahn\'s algorithm and recognise when none exists',
      ],
      why: 'Dependency problems are everywhere: build steps, course prerequisites, task lists. Knowing how to find a loop, split a network into groups and order work that depends on other work lets you check what an AI assistant produces for them.',
    },
    body: [
      {
        type: 'paragraph',
        text: 'Lesson 46 gave you two ways to walk a graph. This lesson uses that walk to answer three practical questions. Is there a **cycle**, a way to leave a vertex and arrive back at it? How many separate pieces, called **connected components**, does the graph fall into? And, for a directed graph of tasks, in what order can the tasks be done so that every task comes after the ones it depends on? That last answer is a **topological order**. Each answer is a small variation of a traversal, and each runs in O(V + E).',
      },
      { type: 'heading', text: 'A real-world picture' },
      {
        type: 'paragraph',
        text: 'A cycle is a deadlock. Ana will not start until Ben finishes, Ben waits for Carla, and Carla waits for Ana: nobody can ever begin. Connected components are islands: the barangay on the main road, a separate village across the river with its own roads, and a farm with no road at all. You can walk from any place to any other place on the same island, and to none on another. A topological order is how you get dressed: socks before shoes, trousers before shoes, and it does not matter whether the belt comes first.',
      },
      {
        type: 'paragraph',
        text: 'Where this stops being accurate: a real dependency chain often has many valid orders, and the algorithm picks just one of them. And "island" means connected by roads in the graph, not close together on the map.',
      },
      { type: 'heading', text: 'How it works' },
      {
        type: 'paragraph',
        text: '**Cycle in an undirected graph.** Run a DFS and remember, for each vertex, the one it was reached from (its parent). In an undirected graph every road is stored at both ends, so a vertex always sees its parent among its neighbours: that does not mean a cycle. But if a vertex has a visited neighbour that is not its parent, there is a second route between the two, which is a cycle. (We assume at most one road between a pair of places; two parallel roads would be a cycle this check would miss.)',
      },
      {
        type: 'paragraph',
        text: '**Cycle in a directed graph.** The parent trick fails, because arrows have direction. Instead every vertex is in one of three states: **unvisited**, **visiting** (it is on the path DFS is following right now, still waiting for its neighbours to finish) and **done** (it and everything reachable from it is finished). An arrow that leads to a vertex in state *visiting* points back to something on the current path, so that is a cycle. An arrow to a *done* vertex is fine: it only means two routes lead to the same place. Two states are not enough, because then you could not tell "visited on the way here" from "visited earlier and finished".',
      },
      {
        type: 'table',
        headers: ['State', 'Meaning', 'Arrow into a vertex in this state'],
        rows: [
          ['unvisited', 'Not reached yet', 'Explore it'],
          ['visiting', 'On the current DFS path', 'Cycle found'],
          ['done', 'Finished, with everything it leads to', 'Ignore it: it is not a cycle'],
        ],
        caption: 'Three-state cycle detection for directed graphs.',
      },
      {
        type: 'paragraph',
        text: '**Connected components.** In an undirected graph, loop over every vertex. When one has not been visited, it belongs to a new component: start a traversal from it, and everything the traversal reaches is in that component. Then carry on with the loop. Each vertex and edge is handled once across all the traversals, so the whole job is O(V + E). (Module 12\'s union-find answers the same question while edges arrive one at a time; a traversal answers it for a graph you already have.)',
      },
      {
        type: 'paragraph',
        text: '**Topological sorting with Kahn\'s algorithm.** An order exists only for a directed graph with no cycle (a DAG). Count each vertex\'s **in-degree**, the number of arrows pointing at it. A vertex with in-degree 0 waits for nothing, so it can go first. Put all such vertices in a queue. Repeatedly take one from the queue, add it to the order, and "remove" its arrows by subtracting one from the in-degree of each vertex it points to. Any vertex whose in-degree falls to 0 is now free to go and joins the queue. If, at the end, the order holds fewer vertices than the graph has, the rest were all waiting on each other: there is a cycle. The cost is O(V + E).',
      },
      {
        type: 'diagram',
        format: 'mermaid',
        caption: 'Preparing a barangay fiesta. An arrow means "must be done before". Kahn\'s algorithm starts from the only task with nothing before it.',
        source: 'flowchart LR\n  Permit[Get permit] --> Tent[Rent tent]\n  Permit --> Food[Order food]\n  Tent --> Tables[Set up tables]\n  Food --> Tables\n  Tables --> Open[Open fiesta]',
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: 'In plain words: a cycle is a circle of waiting, where each thing waits for the next and the last waits for the first, so nothing can start. A component is an island: a group of places joined to each other but not to anything outside. For ordering tasks, think of a to-do list where some jobs need others done first. Kahn\'s method is simple: do every job that needs nothing, cross it off, see which jobs became free, and repeat. If you run out of free jobs while some are left, the leftovers are stuck waiting on each other. In the code, `inDegree[next]--` means "one of the things this job was waiting for is now done".',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: 'Some details that matter in production. Cycle detection in an undirected graph can also run with union-find: if an edge joins two vertices already in the same set, it closes a cycle, which suits graphs that arrive as a stream of edges. On directed graphs, "connected" splits in two: weakly connected (ignoring arrow direction) and strongly connected (a directed path both ways between every pair); finding the strongly connected components needs different algorithms, such as Tarjan\'s or Kosaraju\'s, which are not covered here. A topological order is not unique, and tests that assert one exact order are fragile: assert that every arrow goes forward instead. A DFS-based topological sort exists too (reverse the finishing order), but Kahn\'s is iterative, so it does not overflow the call stack on deep dependency chains, and it reports a cycle for free.',
      },
      { type: 'heading', text: 'See it in code' },
      {
        type: 'paragraph',
        text: 'First, cycle detection in an undirected graph. `explore` carries the parent along.',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'Cycle in an undirected graph',
        code: `function hasCycle(graph) {
  const visited = new Set();

  function explore(vertex, parent) {
    visited.add(vertex);
    for (const next of graph[vertex]) {
      if (!visited.has(next)) {
        if (explore(next, vertex)) {
          return true;
        }
      } else if (next !== parent) {
        return true;
      }
    }
    return false;
  }

  for (const vertex of Object.keys(graph)) {
    if (!visited.has(vertex) && explore(vertex, null)) {
      return true;
    }
  }
  return false;
}

const line = { A: ['B'], B: ['A', 'C'], C: ['B'] };
const triangle = { A: ['B', 'C'], B: ['A', 'C'], C: ['A', 'B'] };
console.log(hasCycle(line), hasCycle(triangle));`,
      },
      {
        type: 'code',
        language: 'text',
        label: 'Output',
        code: 'false true',
      },
      {
        type: 'paragraph',
        text: 'Next, the directed version with three states, tried on a diamond (two routes to D, no cycle) and on a loop.',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'Cycle in a directed graph: three states',
        code: `function hasDirectedCycle(graph) {
  const state = {};
  for (const vertex of Object.keys(graph)) {
    state[vertex] = 'unvisited';
  }

  function explore(vertex) {
    state[vertex] = 'visiting';
    for (const next of graph[vertex]) {
      if (state[next] === 'visiting') {
        return true;
      }
      if (state[next] === 'unvisited' && explore(next)) {
        return true;
      }
    }
    state[vertex] = 'done';
    return false;
  }

  for (const vertex of Object.keys(graph)) {
    if (state[vertex] === 'unvisited' && explore(vertex)) {
      return true;
    }
  }
  return false;
}

const diamond = { A: ['B', 'C'], B: ['D'], C: ['D'], D: [] };
const loop = { A: ['B'], B: ['C'], C: ['A'] };
console.log(hasDirectedCycle(diamond), hasDirectedCycle(loop));`,
      },
      {
        type: 'code',
        language: 'text',
        label: 'Output',
        code: 'false true',
      },
      {
        type: 'paragraph',
        text: 'Then connected components, with an island map: Plaza, Market and School are joined, Chapel and Hall are joined, and the Pier has no roads.',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'Connected components',
        code: `function components(graph) {
  const seen = new Set();
  const groups = [];
  for (const start of Object.keys(graph)) {
    if (seen.has(start)) {
      continue;
    }
    const group = [];
    const stack = [start];
    seen.add(start);
    while (stack.length > 0) {
      const current = stack.pop();
      group.push(current);
      for (const next of graph[current]) {
        if (!seen.has(next)) {
          seen.add(next);
          stack.push(next);
        }
      }
    }
    groups.push(group);
  }
  return groups;
}

const islands = {
  Plaza: ['Market'],
  Market: ['Plaza', 'School'],
  School: ['Market'],
  Chapel: ['Hall'],
  Hall: ['Chapel'],
  Pier: [],
};
for (const group of components(islands)) {
  console.log(group.join(' '));
}
console.log(components(islands).length, 'components');`,
      },
      {
        type: 'code',
        language: 'text',
        label: 'Output',
        code: `Plaza Market School
Chapel Hall
Pier
3 components`,
      },
      {
        type: 'paragraph',
        text: 'Finally Kahn\'s algorithm, on the fiesta tasks and on a graph with a cycle. It returns the order, or `null` when a cycle makes an order impossible.',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'Topological order with Kahn\'s algorithm',
        code: `function buildOrder(graph) {
  const inDegree = {};
  for (const task of Object.keys(graph)) {
    inDegree[task] = 0;
  }
  for (const task of Object.keys(graph)) {
    for (const next of graph[task]) {
      inDegree[next]++;
    }
  }

  const queue = [];
  for (const task of Object.keys(graph)) {
    if (inDegree[task] === 0) {
      queue.push(task);
    }
  }

  const order = [];
  let head = 0;
  while (head < queue.length) {
    const task = queue[head];
    head++;
    order.push(task);
    for (const next of graph[task]) {
      inDegree[next]--;
      if (inDegree[next] === 0) {
        queue.push(next);
      }
    }
  }
  return order.length === Object.keys(graph).length ? order : null;
}

const fiesta = {
  'Get permit': ['Rent tent', 'Order food'],
  'Rent tent': ['Set up tables'],
  'Order food': ['Set up tables'],
  'Set up tables': ['Open fiesta'],
  'Open fiesta': [],
};
console.log(buildOrder(fiesta).join(' > '));
console.log(buildOrder({ A: ['B'], B: ['C'], C: ['A'], D: [] }));`,
      },
      {
        type: 'code',
        language: 'text',
        label: 'Output',
        code: `Get permit > Rent tent > Order food > Set up tables > Open fiesta
null`,
      },
      { type: 'heading', text: 'Walk through the code' },
      {
        type: 'list',
        items: [
          'In `hasCycle`, `explore(next, vertex)` passes the current vertex as the parent. On the line graph, B sees A as a neighbour that is visited but equals its parent, so it is ignored. On the triangle, C (reached from B) sees A: visited, and not its parent B, so the search reports a cycle.',
          'In `hasDirectedCycle`, the diamond reaches D from B first, and D finishes as `done`. Back at A, the arrow to C leads to D again, but D is `done`, not `visiting`, so there is no cycle. On the loop, A is `visiting` while the search follows A, B, C, and C\'s arrow to A finds a `visiting` vertex: a cycle.',
          '`components` takes each unseen vertex as the start of a new group and floods outward from it with a stack. Pier has no neighbours, so it forms a group of its own. Three starts, three components.',
          'In `buildOrder`, the first two loops count the arrows pointing at each task. Only Get permit has in-degree 0, so it starts the queue.',
        ],
      },
      {
        type: 'table',
        headers: ['Turn', 'Task taken', 'In-degrees lowered', 'Joins the queue', 'Order so far'],
        rows: [
          ['1', 'Get permit', 'Rent tent 1 to 0, Order food 1 to 0', 'Rent tent, Order food', 'Get permit'],
          ['2', 'Rent tent', 'Set up tables 2 to 1', 'nothing yet', 'Get permit, Rent tent'],
          ['3', 'Order food', 'Set up tables 1 to 0', 'Set up tables', '... Order food'],
          ['4', 'Set up tables', 'Open fiesta 1 to 0', 'Open fiesta', '... Set up tables'],
          ['5', 'Open fiesta', 'none', 'nothing', 'all 5 tasks'],
        ],
        caption: 'Tracing buildOrder(fiesta). The second example never gets past D: A, B and C each wait for another, so only 1 of 4 tasks is ordered and the function returns null.',
      },
      { type: 'heading', text: 'Try it with AI' },
      {
        type: 'prompt',
        label: 'Find the cycle yourself, then check',
        text: 'I will give you a list of tasks with their prerequisites. First I will tell you whether the plan can be done and, if not, which tasks form the cycle. Do not tell me yet. Tasks: Paint walls needs Plaster walls; Plaster walls needs Fix roof; Fix roof needs Buy materials; Buy materials needs Get budget approved; Get budget approved needs Paint walls (a mistake in my notes). After my answer, check it and explain how Kahn\'s algorithm would show the problem.',
      },
      {
        type: 'prompt',
        label: 'Test the generated code',
        text: 'Write a JavaScript function that returns the connected components of an undirected graph stored as an object of arrays. Then list five test graphs I should try, including a graph with no vertices, one with a single vertex, and one where a vertex lists a neighbour that is not a key of the object. I will predict each result before running it.',
      },
      {
        type: 'paragraph',
        text: 'What to look for: the generated code should handle a graph with several pieces (by looping over all vertices, not just one start) and should mention the O(V + E) cost. An AI can be confidently wrong in a typical way: for a directed graph it may reuse the undirected parent check, which reports a false cycle on the diamond or misses real ones. Test any cycle detector on both the diamond and the loop.',
      },
      {
        type: 'takeaways',
        items: [
          'In an undirected graph a visited neighbour that is not your parent means a cycle.',
          'In a directed graph, track three states; an arrow to a vertex that is still "visiting" is a cycle, and an arrow to a "done" vertex is not.',
          'Connected components: start a new traversal from every vertex not yet seen. The count is the number of traversals started.',
          'Kahn\'s algorithm orders a DAG by repeatedly taking vertices with in-degree 0; if fewer than V vertices come out, there is a cycle.',
          'All of these are traversals, so each costs O(V + E) on an adjacency list.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: `${ID}-47-predict-output-1`,
          kind: 'predict-output',
          title: 'Trace Kahn\'s algorithm',
          prompt: 'This program orders five tasks. An arrow `A: [\'D\']` means A must come before D. Predict the order it prints.',
          concept: 'topological sorting',
          language: 'javascript',
          code: `const graph = { A: ['D'], B: ['D', 'C'], C: [], D: ['E'], E: [] };
const inDegree = {};
for (const task of Object.keys(graph)) {
  inDegree[task] = 0;
}
for (const task of Object.keys(graph)) {
  for (const next of graph[task]) {
    inDegree[next]++;
  }
}
const queue = [];
for (const task of Object.keys(graph)) {
  if (inDegree[task] === 0) {
    queue.push(task);
  }
}
const order = [];
let head = 0;
while (head < queue.length) {
  const task = queue[head];
  head++;
  order.push(task);
  for (const next of graph[task]) {
    inDegree[next]--;
    if (inDegree[next] === 0) {
      queue.push(next);
    }
  }
}
console.log(order.join(' '));`,
          expected: 'A B D C E',
          choices: ['A B D C E', 'A B C D E', 'A B C E D', 'B A D E C'],
          wrongNotes: {
            'A B C D E': 'B\'s arrows are listed as D first, then C. Both become free on that turn, but D joins the queue before C.',
            'A B C E D': 'E needs D to be done first, so E can never come before D.',
            'B A D E C': 'The queue starts with the in-degree 0 tasks in the order the keys are written: A, then B.',
          },
          hints: [
            'First work out the in-degrees: D has two arrows pointing at it (from A and B), C one, E one.',
            'The queue starts with A and B. Taking A lowers D from 2 to 1, so D is not free yet.',
            'Taking B lowers D to 0 (D joins the queue) and then C to 0 (C joins after D). Then D frees E, so the order is A B D C E.',
          ],
          explanation: 'A and B start the queue. A lowers D to 1. B lowers D to 0 and C to 0, in that order of its arrow list, so the queue becomes D, C. D frees E (in-degree 0) and joins the queue behind C. The order is A B D C E.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: `${ID}-47-fill-blank-1`,
          kind: 'fill-blank',
          title: 'Three states',
          prompt: 'Complete the directed cycle detector. Choose the state each blank needs so that it prints `true false`: the first graph is a loop, the second a diamond.',
          concept: 'cycle detection in a directed graph',
          language: 'javascript',
          code: `function hasCycle(graph) {
  const state = {};
  for (const vertex of Object.keys(graph)) {
    state[vertex] = 'unvisited';
  }
  function explore(vertex) {
    state[vertex] = ___;
    for (const next of graph[vertex]) {
      if (state[next] === ___) {
        return true;
      }
      if (state[next] === 'unvisited' && explore(next)) {
        return true;
      }
    }
    state[vertex] = ___;
    return false;
  }
  for (const vertex of Object.keys(graph)) {
    if (state[vertex] === 'unvisited' && explore(vertex)) {
      return true;
    }
  }
  return false;
}
const loop = { A: ['B'], B: ['C'], C: ['A'] };
const diamond = { A: ['B', 'C'], B: ['D'], C: ['D'], D: [] };
console.log(hasCycle(loop), hasCycle(diamond));`,
          blanks: [
            { answers: ['\'visiting\''], feedback: 'When the search enters a vertex it is on the current path, not finished yet.' },
            { answers: ['\'visiting\''], feedback: 'A cycle is an arrow that points back to a vertex still on the current path.' },
            { answers: ['\'done\''], feedback: 'When every neighbour has been explored, the vertex is finished and no longer on the path.' },
          ],
          bank: ['\'visiting\'', '\'visiting\'', '\'done\'', '\'unvisited\''],
          tests: { kind: 'output', expected: ['true false'] },
          hints: [
            'There are three states: unvisited, visiting and done.',
            'A vertex is "visiting" from the moment the search enters it until the search finishes all its neighbours.',
            'Blanks one and two are both `\'visiting\'`; blank three is `\'done\'`.',
          ],
          explanation: 'The vertex is marked visiting on entry and done on exit. Finding an arrow into a visiting vertex means the arrow points back along the current path, which is a cycle. An arrow into a done vertex (as D in the diamond) is only a second route.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: `${ID}-47-scenario-1`,
          kind: 'scenario',
          title: 'A course planner',
          prompt: 'Choose the approach that solves the whole problem.',
          concept: 'topological sorting',
          situation: 'A school lists 40 courses, each with its prerequisite courses. A student wants one valid order to take every course, and the system must say clearly when the prerequisites contradict each other (for example, A needs B and B needs A).',
          options: [
            { text: 'Kahn\'s algorithm over the prerequisite graph: if fewer than 40 courses come out, report the contradiction', consequence: 'Courses with nothing left to wait for come out first, each unlocks the next, and a shortfall means some courses wait on each other. One pass of O(V + E) both orders and detects the problem.', quality: 'best' },
            { text: 'Sort the courses alphabetically and print them', consequence: 'Alphabetical order ignores prerequisites completely, so a course can come before the course it needs. It also never notices a contradiction.', quality: 'poor' },
            { text: 'Run BFS from the first course and print the visit order', consequence: 'BFS orders vertices by distance from one start, not by what must come first, and it would not reach courses unconnected to the start. The order it prints can break a prerequisite.', quality: 'poor' },
          ],
          hints: [
            'You need an order in which every arrow goes forward, plus a clear failure when no such order exists.',
            'Which algorithm in this lesson outputs fewer vertices than the graph has when there is a cycle?',
            'Free courses (in-degree 0) go first; finishing one may free others.',
          ],
          explanation: 'A valid order is a topological order, and one exists exactly when the graph has no cycle. Kahn\'s algorithm produces it and, by coming up short, shows the contradiction.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: `${ID}-47-code-challenge-1`,
          kind: 'code-challenge',
          title: 'How many islands?',
          prompt: 'Write `countComponents(graph)`. `graph` is an undirected graph stored as an object mapping each place to an array of neighbours (every road appears at both ends). Return the number of connected components. A graph with no places has 0.',
          concept: 'connected components',
          language: 'javascript',
          starter: `function countComponents(graph) {
  // start a new traversal from every place not yet seen
}
`,
          solution: `function countComponents(graph) {
  const seen = new Set();
  let count = 0;
  for (const start of Object.keys(graph)) {
    if (seen.has(start)) {
      continue;
    }
    count++;
    const stack = [start];
    seen.add(start);
    while (stack.length > 0) {
      const current = stack.pop();
      for (const next of graph[current]) {
        if (!seen.has(next)) {
          seen.add(next);
          stack.push(next);
        }
      }
    }
  }
  return count;
}
`,
          tests: {
            kind: 'function',
            fn: 'countComponents',
            cases: [
              { label: 'one piece', args: [{ A: ['B'], B: ['A', 'C'], C: ['B'] }], expected: 1 },
              { label: 'three islands', args: [{ Plaza: ['Market'], Market: ['Plaza'], Chapel: ['Hall'], Hall: ['Chapel'], Pier: [] }], expected: 3 },
              { label: 'no places', args: [{}], expected: 0 },
              { label: 'a ring is one piece', args: [{ A: ['B', 'D'], B: ['A', 'C'], C: ['B', 'D'], D: ['A', 'C'] }], expected: 1 },
              { label: '200 places with no roads (hidden)', args: [Object.fromEntries(Array.from({ length: 200 }, (_, i) => [`N${i}`, []]))], expected: 200, hidden: true },
              {
                label: '100 pairs (hidden)',
                args: [Object.fromEntries(Array.from({ length: 200 }, (_, i) => [`N${i}`, [`N${i % 2 === 0 ? i + 1 : i - 1}`]]))],
                expected: 100,
                hidden: true,
              },
            ],
          },
          hints: [
            'Loop over every place. If it has not been seen, it starts a new island.',
            'When you start a new island, count it, then walk everything reachable from that place and mark all of it as seen.',
            'Use a `seen` set and a stack (or queue); increase `count` once per start, not once per place.',
          ],
          explanation: 'Each unseen place begins a new island, and the walk marks the whole island as seen so none of its places can start another. The number of walks started is the number of components, and every place and road is handled once: O(V + E).',
        },
      },
    ],
    quiz: [
      {
        id: `${ID}-47-q1`,
        prompt: 'In an undirected graph, DFS at vertex B finds a neighbour A that is already visited. A is the vertex DFS came from. Is that a cycle?',
        choices: [
          'Yes, any visited neighbour closes a cycle',
          'Yes, but only in a weighted graph',
          'No: that road was just used; only a visited non-parent neighbour shows a cycle',
          'No, an undirected graph can never have a cycle',
        ],
        answer: 2,
        explanation: 'Each undirected road is stored at both ends, so a vertex always sees its parent as a visited neighbour. A visited neighbour other than the parent means a second route exists, which is a cycle.',
      },
      {
        id: `${ID}-47-q2`,
        prompt: 'A directed graph has arrows A to B, A to C, B to D and C to D. A DFS from A reaches D twice. Is there a cycle?',
        choices: [
          'Yes, because D is reached by two different routes',
          'No, because when D is reached the second time it is finished, not on the current path',
          'Yes, because D has an in-degree greater than 1',
          'No, because a directed graph cannot have a cycle',
        ],
        answer: 1,
        explanation: 'Reaching a vertex twice is not a cycle. A cycle needs an arrow that leads back to a vertex still on the current path (state visiting). D is done by then.',
      },
      {
        id: `${ID}-47-q3`,
        prompt: 'Kahn\'s algorithm is run on a graph of 6 tasks and outputs only 4 of them before the queue runs empty. What does that tell you?',
        choices: [
          'The graph is a DAG, and 2 tasks are optional',
          'The graph has too many edges for a queue',
          'Tasks with in-degree 0 were missed and the algorithm should be run again',
          'The remaining 2 or more tasks include a cycle, or wait on one, so no valid order exists',
        ],
        answer: 3,
        explanation: 'A task enters the queue only when everything it waits for is done. If the queue empties early, the rest all still wait on tasks among themselves, so there is a cycle and no valid order.',
      },
      {
        id: `${ID}-47-q4`,
        prompt: 'Eight computers have these links: A-B, B-C, D-E, F-G, G-H, H-F. How many connected components does the network have?',
        choices: ['4', '2', '3', '8'],
        answer: 2,
        explanation: 'The groups are {A, B, C}, {D, E} and {F, G, H}. The links inside the last group even form a cycle, but it is still one component.',
      },
      {
        id: `${ID}-47-q5`,
        audience: { max: 'beginner' },
        prompt: 'You must put on socks, trousers and shoes. Socks and trousers must both go on before the shoes. Which order works?',
        choices: ['Shoes, socks, trousers', 'Trousers, shoes, socks', 'Socks, trousers, shoes', 'Shoes, trousers, socks'],
        answer: 2,
        explanation: 'Both socks and trousers have to come before shoes, and nothing says which of the two goes first. Socks, trousers, shoes is valid (so is trousers, socks, shoes).',
      },
      {
        id: `${ID}-47-q6`,
        audience: { min: 'advanced' },
        prompt: 'A build system must order 1,000,000 tasks with 3,000,000 dependencies, and report cycles. Which approach is the safest choice?',
        choices: [
          'Recursive DFS with three states, since recursion is the simplest to write and to read back later',
          'Kahn\'s algorithm: it loops, costs O(V + E), and reports a cycle when fewer than V tasks come out',
          'Union-find, because it detects cycles in directed graphs',
          'Repeated BFS from every task, which is O(V + E) per task',
        ],
        answer: 1,
        explanation: 'A dependency chain a million long would overflow a recursive DFS. Kahn\'s runs in a loop in O(V + E) and signals cycles. Union-find as described here handles undirected connectivity, and BFS from every task would cost O(V(V + E)).',
      },
    ],
    task: {
      title: 'Plan a project and test it for loops',
      minutes: 20,
      steps: [
        'Choose a project of six to eight steps (cooking a meal, moving house, publishing a page). Write each step as a key and the steps that depend on it as an array.',
        'Run `buildOrder` from this lesson on your graph and check that every step comes after everything it depends on.',
        'Add one dependency that creates a cycle and run it again. What does `buildOrder` return, and why?',
        'Add two steps that depend on nothing and on no one, and use `components` on the undirected version of your graph to count the separate pieces.',
      ],
    },
    taskExtra: [
      {
        audience: { max: 'beginner' },
        steps: ['Do it first on paper with five steps: cross out every step that needs nothing, write it in a list, and repeat. Then compare your list with what the code prints.'],
      },
      {
        audience: { min: 'advanced' },
        steps: [
          'Write a checker `isValidOrder(graph, order)` and use it as the test for `buildOrder`, instead of comparing with one fixed order.',
          'Make `buildOrder` return the tasks that are stuck when a cycle exists, and explain why they are not necessarily all on the cycle itself.',
        ],
      },
    ],
  },
  {
    id: `${ID}-48`,
    day: 48,
    title: "Shortest Paths and Dijkstra's Algorithm",
    summary: 'Find the route with the smallest total distance in a weighted graph with Dijkstra\'s algorithm, count its cost, and see why it needs non-negative weights.',
    minutes: 30,
    skills: ['graphs', 'complexity'],
    intro: {
      objectives: [
        'Explain why the fewest roads and the fewest km can be different routes',
        'Trace Dijkstra\'s algorithm, showing the distance table and the choice of the next vertex',
        'Write Dijkstra with a scan for the smallest distance and state its cost, and why weights must not be negative',
      ],
      why: 'Navigation, delivery routing, network packets and game maps all ask for the cheapest route. When an AI assistant writes a route finder, you need to know which algorithm fits the weights and what it costs as the map grows.',
    },
    body: [
      {
        type: 'paragraph',
        text: 'Lesson 46 found the route with the fewest roads. But a commuter does not care about the number of roads: they care about the total fare, time or distance. On our barangay map the route from Plaza to Terminal with the fewest roads is Plaza, Market, Terminal: 2 roads and 9 km. The route Plaza, Market, School, Clinic, Terminal has 4 roads but only 8 km. In a **weighted graph**, the shortest path is the one with the smallest total weight, and breadth-first search cannot find it because it counts roads. **Dijkstra\'s algorithm** can, as long as no weight is negative.',
      },
      { type: 'heading', text: 'A real-world picture' },
      {
        type: 'paragraph',
        text: 'Think of choosing a jeepney route by total fare or travel time. A direct ride with a long detour can cost more than three short hops that cut through town. You cannot tell by counting stops; you have to add up the costs. A careful commuter would keep a note of the cheapest known cost to reach each place, and always extend the route from the place that is cheapest so far, because anything reached later through a more expensive place cannot beat it.',
      },
      {
        type: 'paragraph',
        text: 'Where the picture stops being accurate: real travel adds waiting time, transfers and traffic that change by the hour. The algorithm treats every weight as a fixed number you hand it.',
      },
      { type: 'heading', text: 'How it works' },
      {
        type: 'paragraph',
        text: 'Which algorithm to use depends on the weights. Dijkstra computes the shortest distance from one starting vertex to all the others, which is why it is called a **single-source** algorithm.',
      },
      {
        type: 'table',
        headers: ['The graph', 'Use', 'Why'],
        rows: [
          ['Unweighted (or every weight equal)', 'Breadth-first search', 'The fewest roads is the shortest path; O(V + E)'],
          ['Weighted, all weights 0 or more', 'Dijkstra\'s algorithm', 'The cheapest unfinished vertex can never be improved later'],
          ['Weighted, some weights negative', 'A different algorithm (Bellman-Ford is one, not covered here)', 'Dijkstra\'s guarantee breaks'],
        ],
        caption: 'Pick the shortest-path method by the kind of weights.',
      },
      {
        type: 'paragraph',
        text: 'The idea. Keep a table `dist` with the best distance found so far from the start to every vertex: 0 for the start, and infinity (`Infinity` in JavaScript) for the rest, meaning "no route known yet". Also keep `previous`, who comes just before each vertex on its best route, and a set of finished vertices. Then repeat these two steps until every reachable vertex is finished. **Step one:** among the vertices not finished, pick the one with the smallest `dist` and mark it finished. Its distance is now final. **Step two, relaxing:** for each road from that vertex to a neighbour, work out `dist[current] + weight`. If that is smaller than the neighbour\'s current `dist`, the new route is better: update the `dist` and set `previous` to the current vertex.',
      },
      {
        type: 'paragraph',
        text: 'Why step one is safe. Suppose `current` has the smallest distance of all unfinished vertices. Any other route to it would have to leave the finished area through some unfinished vertex, whose distance is already at least as large as `current`\'s, and then travel more. Travelling along a road adds a weight that is 0 or more, so it cannot make the total smaller. So no later discovery can beat `current`\'s distance. **A negative weight breaks exactly this argument**: a later road could subtract distance and undercut a vertex we already finished. We will watch that happen in the code.',
      },
      {
        type: 'visual',
        id: 'graph-shortest-path',
        caption: 'Select Dijkstra and press Next. At each step, look at the distance table: which unfinished vertex has the smallest distance, and which neighbours get a smaller number after it is finished?',
      },
      {
        type: 'paragraph',
        text: 'The cost, by counting. The simple version scans all V vertices to find the smallest unfinished distance, and does that V times: about V × V checks, plus one look at each road when relaxing, E in total. That is O(V² + E), which is O(V²) because E is at most about V². On a line of 5 vertices the scan count is 25, on 10 it is 100 and on 100 it is 10,000: it grows with the square. A faster version keeps the unfinished vertices in a **priority queue**, a min-heap from module 11, so finding the smallest costs O(log V) instead of O(V). Each improvement pushes an entry, and the total is O((V + E) log V). On a sparse road map with a million junctions and a few million roads, that is the difference between tens of millions of steps and about a trillion.',
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: 'In plain words: the algorithm keeps a scoreboard of the shortest distance found so far to every place, starting with 0 for where you are and "unknown" for everywhere else. Each round it picks the closest place not yet settled, settles it, and then asks of each road leaving it: "would going this way give a neighbour a better score?". If yes, it updates the scoreboard and notes where you came from. When everything reachable is settled, the scoreboard holds the shortest distances, and the notes let you read the route backwards. In the code, `Infinity` is a number larger than every other, so any real distance beats it.',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: 'In practice, the heap version is the one you ship. The usual implementation pushes `(distance, vertex)` entries and skips stale ones when popped (lazy deletion), so the heap can hold up to E entries and the bound stays O((V + E) log V). Dijkstra can stop as soon as the target is taken from the queue, which saves work for a single query. Routing engines commonly build on this idea with extra speed-ups (searching from both ends, or guiding the search towards the target with a heuristic as in A*), but those are separate algorithms with their own conditions. Weights from real data need care: they must be non-negative (a refund or a downhill "gain" modelled as a negative number silently produces wrong routes), and floating-point sums can differ in the last digits, so compare distances with a tolerance when you test.',
      },
      { type: 'heading', text: 'See it in code' },
      {
        type: 'paragraph',
        text: 'The weighted barangay map as an adjacency list (lesson 45): each neighbour is `{ to, km }`, and each two-way road is written at both ends. Then Dijkstra with the scan, counting how many vertices it looks at while searching for the smallest distance.',
      },
      {
        type: 'code',
        language: 'javascript',
        label: "Dijkstra's algorithm, scanning for the smallest distance",
        code: `const map = {
  Plaza: [{ to: 'Market', km: 2 }, { to: 'School', km: 4 }],
  Market: [{ to: 'Plaza', km: 2 }, { to: 'School', km: 1 }, { to: 'Terminal', km: 7 }],
  School: [{ to: 'Plaza', km: 4 }, { to: 'Market', km: 1 }, { to: 'Clinic', km: 3 }],
  Clinic: [{ to: 'School', km: 3 }, { to: 'Terminal', km: 2 }],
  Terminal: [{ to: 'Market', km: 7 }, { to: 'Clinic', km: 2 }],
};

function dijkstra(graph, start) {
  const dist = {};
  const previous = {};
  const done = new Set();
  for (const vertex of Object.keys(graph)) {
    dist[vertex] = Infinity;
    previous[vertex] = null;
  }
  dist[start] = 0;
  let scans = 0;

  for (let round = 0; round < Object.keys(graph).length; round++) {
    let current = null;
    for (const vertex of Object.keys(graph)) {
      scans++;
      if (!done.has(vertex) && (current === null || dist[vertex] < dist[current])) {
        current = vertex;
      }
    }
    if (dist[current] === Infinity) {
      break;
    }
    done.add(current);
    for (const { to, km } of graph[current]) {
      const alt = dist[current] + km;
      if (alt < dist[to]) {
        dist[to] = alt;
        previous[to] = current;
      }
    }
  }
  return { dist, previous, scans };
}

const result = dijkstra(map, 'Plaza');
for (const place of Object.keys(map)) {
  console.log(place, result.dist[place], result.previous[place]);
}
console.log('scans', result.scans);`,
      },
      {
        type: 'code',
        language: 'text',
        label: 'Output',
        code: `Plaza 0 null
Market 2 Plaza
School 3 Market
Clinic 6 School
Terminal 8 Clinic
scans 25`,
      },
      {
        type: 'paragraph',
        text: 'The `previous` table is a trail of breadcrumbs. Following it backwards from the target gives the route. A wrapper returns the distance and the route, or `null` when the target cannot be reached (its distance is still `Infinity`). It uses `map` and `dijkstra` from the block above.',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'Rebuilding the route',
        code: `function routeTo(previous, target) {
  const path = [];
  let step = target;
  while (step !== null) {
    path.push(step);
    step = previous[step];
  }
  return path.reverse();
}

function shortestRoute(graph, from, to) {
  const { dist, previous } = dijkstra(graph, from);
  if (dist[to] === Infinity) {
    return null;
  }
  return { km: dist[to], path: routeTo(previous, to) };
}

const best = shortestRoute(map, 'Plaza', 'Terminal');
console.log(best.km, 'km:', best.path.join(' > '));
console.log(shortestRoute({ ...map, Pier: [] }, 'Plaza', 'Pier'));`,
      },
      {
        type: 'code',
        language: 'text',
        label: 'Output',
        code: `8 km: Plaza > Market > School > Clinic > Terminal
null`,
      },
      {
        type: 'paragraph',
        text: 'Now count the scans as the map grows. A helper builds a straight line of n places one km apart.',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'Counting the scans',
        code: `function lineMap(n) {
  const graph = {};
  for (let i = 0; i < n; i++) {
    graph['v' + i] = [];
  }
  for (let i = 0; i < n - 1; i++) {
    graph['v' + i].push({ to: 'v' + (i + 1), km: 1 });
    graph['v' + (i + 1)].push({ to: 'v' + i, km: 1 });
  }
  return graph;
}

for (const n of [5, 10, 100]) {
  console.log(n, 'places:', dijkstra(lineMap(n), 'v0').scans, 'scans');
}`,
      },
      {
        type: 'code',
        language: 'text',
        label: 'Output',
        code: `5 places: 25 scans
10 places: 100 scans
100 places: 10000 scans`,
      },
      {
        type: 'paragraph',
        text: 'Last, the warning. This small directed map has a road with a negative weight, such as a toll refund: A to B costs 2, A to C costs 3, C to B costs -2, and B to D costs 1. Going A, C, B, D costs 3 - 2 + 1 = 2.',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'A negative weight breaks the guarantee',
        code: `const odd = {
  A: [{ to: 'B', km: 2 }, { to: 'C', km: 3 }],
  B: [{ to: 'D', km: 1 }],
  C: [{ to: 'B', km: -2 }],
  D: [],
};
console.log('Dijkstra says D is', dijkstra(odd, 'A').dist.D);
console.log('the route A, C, B, D really costs', 3 + -2 + 1);`,
      },
      {
        type: 'code',
        language: 'text',
        label: 'Output',
        code: `Dijkstra says D is 3
the route A, C, B, D really costs 2`,
      },
      { type: 'heading', text: 'Walk through the code' },
      {
        type: 'paragraph',
        text: 'Here is the distance table after each round on the barangay map, starting from Plaza. Columns are Plaza, Market, School, Clinic, Terminal. "inf" means no route known yet.',
      },
      {
        type: 'table',
        headers: ['Round', 'Finished (smallest unfinished)', 'Plaza', 'Market', 'School', 'Clinic', 'Terminal'],
        rows: [
          ['start', '-', '0', 'inf', 'inf', 'inf', 'inf'],
          ['1', 'Plaza (0)', '0', '2', '4', 'inf', 'inf'],
          ['2', 'Market (2)', '0', '2', '3', 'inf', '9'],
          ['3', 'School (3)', '0', '2', '3', '6', '9'],
          ['4', 'Clinic (6)', '0', '2', '3', '6', '8'],
          ['5', 'Terminal (8)', '0', '2', '3', '6', '8'],
        ],
        caption: 'Round 2 improves School from 4 to 3 (through Market, 2 + 1). Round 4 improves Terminal from 9 to 8 (through Clinic, 6 + 2).',
      },
      {
        type: 'list',
        items: [
          'The inner `for` loop is the scan: it looks at every vertex, skips finished ones, and remembers the unfinished one with the smallest `dist`. It runs 5 times over 5 vertices, which is the 25 scans printed. On the line of 100 places it is 100 × 100.',
          'After `done.add(current)`, the relaxing loop looks at each road from `current`. `alt` is the distance to the neighbour through `current`. Only a smaller `alt` changes the table and the `previous` breadcrumb.',
          'Round 2 shows why we do not simply take the first road found: School had 4 from Plaza, but through Market it is 2 + 1 = 3, so it is updated and its `previous` becomes Market.',
          'Terminal first gets 9 (through Market, 2 + 7), then 8 when Clinic is finished. The route is read backwards from `previous`: Terminal, Clinic, School, Market, Plaza, then `reverse()`.',
          'The `if (dist[current] === Infinity) break;` line ends the loop when only unreachable vertices remain. That is why a place with no roads (the Pier) stays at `Infinity` and `shortestRoute` answers `null`.',
          'With the negative road, the guarantee fails: B is finished with distance 2 before C (3) is processed. C then lowers B to 1, but D was already given 3 through the old B and is never revisited. Dijkstra reports 3 where 2 is possible.',
        ],
      },
      { type: 'heading', text: 'Try it with AI' },
      {
        type: 'prompt',
        label: 'Trace it with a quiz',
        text: 'I am learning Dijkstra\'s algorithm. Use this weighted graph: A-B 7, A-C 2, C-B 3, B-D 1, C-D 8 (all two-way). I will write the distance table after each round, starting from A. Do not give me the table. After each of my rounds, tell me whether it is correct, and if it is wrong, ask me which unfinished vertex had the smallest distance at that moment.',
      },
      {
        type: 'prompt',
        label: 'Ask for the algorithm and the cost',
        text: 'Write Dijkstra\'s algorithm in JavaScript for a graph stored as an object of arrays of { to, km }. Use a simple scan for the smallest distance, not a priority queue. Then state its time complexity in V and E, explain exactly why it fails with a negative weight, and give three tests including an unreachable place and a graph where the fewest-roads route is not the shortest. I will predict each result first.',
      },
      {
        type: 'paragraph',
        text: 'What to look for: the complexity of the scan version should be O(V²) (or V² + E), not O(E log V), which belongs to the heap version. An AI can be confidently wrong in two familiar ways: it may use a heap-based bound for a scanning implementation, and it may say Dijkstra "works with negative weights as long as there is no negative cycle", which is true of Bellman-Ford and not of Dijkstra. Check each claim against the trace you did by hand.',
      },
      {
        type: 'takeaways',
        items: [
          'The fewest roads and the fewest km can be different routes; BFS finds the first, Dijkstra the second.',
          'Dijkstra keeps a distance table, repeatedly finishes the unfinished vertex with the smallest distance, and relaxes its roads.',
          'It is correct only when no weight is negative, because it assumes a finished vertex can never be improved.',
          'With a scan it costs O(V²) (plus E); with a binary-heap priority queue it costs O((V + E) log V).',
          'The `previous` breadcrumbs rebuild the route, and a distance that stays `Infinity` means the place cannot be reached.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: `${ID}-48-predict-output-1`,
          kind: 'predict-output',
          title: 'Relax the roads',
          prompt: 'The table `dist` holds the best known distances. Each road is relaxed once, in the order listed. Predict the line printed.',
          concept: 'relaxing an edge',
          language: 'javascript',
          code: `const dist = { A: 0, B: Infinity, C: Infinity };
const roads = [['A', 'B', 5], ['A', 'C', 2], ['C', 'B', 1]];
for (const [from, to, km] of roads) {
  if (dist[from] + km < dist[to]) {
    dist[to] = dist[from] + km;
  }
}
console.log(dist.B, dist.C);`,
          expected: '3 2',
          choices: ['3 2', '5 2', '3 Infinity', '6 2'],
          wrongNotes: {
            '5 2': 'B first gets 5 from the road A to B, but the third road gives B a better route through C: 2 + 1 = 3, and 3 is smaller than 5, so it replaces it.',
            '3 Infinity': 'C is reached by the second road, A to C, so it gets 2.',
            '6 2': 'The third road adds the road\'s km to the distance of C (2), not to the old distance of B: 2 + 1 = 3.',
          },
          hints: [
            'Go through the roads in order, writing the table after each one.',
            'After the first two roads, B is 5 and C is 2. What does the third road, C to B, offer B?',
            'dist.C + 1 is 3, and 3 is less than 5, so B becomes 3.',
          ],
          explanation: 'The first road sets B to 5, the second sets C to 2, and the third finds a better way to B: through C costs 2 + 1 = 3, which is less than 5. The table ends with B = 3 and C = 2.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: `${ID}-48-fix-bug-1`,
          kind: 'fix-bug',
          title: 'The relaxing test',
          prompt: 'The shortest route from A to C is 3 km (the direct road), but this program prints 7. Tap the buggy line, then choose the fix.',
          concept: 'relaxing an edge in Dijkstra',
          language: 'javascript',
          code: `function shortest(graph, start, target) {
  const dist = {};
  for (const v of Object.keys(graph)) {
    dist[v] = Infinity;
  }
  dist[start] = 0;
  const done = new Set();
  while (done.size < Object.keys(graph).length) {
    let current = null;
    for (const v of Object.keys(graph)) {
      if (!done.has(v) && (current === null || dist[v] < dist[current])) {
        current = v;
      }
    }
    if (dist[current] === Infinity) {
      break;
    }
    done.add(current);
    for (const { to, km } of graph[current]) {
      if (km < dist[to]) {
        dist[to] = dist[current] + km;
      }
    }
  }
  return dist[target];
}
const graph = { A: [{ to: 'B', km: 5 }, { to: 'C', km: 3 }], B: [{ to: 'C', km: 2 }], C: [] };
console.log(shortest(graph, 'A', 'C'));`,
          bugLine: 20,
          fixes: [
            { line: 'if (dist[current] + km < dist[to]) {', correct: true, why: 'The new route to a neighbour costs what it took to reach the current vertex plus the road, and it replaces the old distance only when it is smaller.' },
            { line: 'if (dist[current] + km > dist[to]) {', correct: false, why: 'This updates only when the new route is worse, so no distance ever improves from Infinity and the program prints Infinity.' },
            { line: 'if (km < dist[current]) {', correct: false, why: 'This compares a road with the current vertex\'s distance, which has nothing to do with whether the neighbour improves, and from the start (distance 0) it never updates.' },
          ],
          tests: { kind: 'output', expected: ['3'] },
          lineNote: 'The update on the next line adds `dist[current]` to `km`. Is the test above it comparing the same quantity?',
          hints: [
            'Look at what is assigned to `dist[to]` and compare it with what the `if` tests.',
            'The `if` tests only the road\'s length, but the new distance is the distance so far plus the road.',
            'Test `dist[current] + km < dist[to]`, the same sum that would be stored.',
          ],
          explanation: 'The test must compare the same value that would be stored: the distance to reach `current` plus the road. Comparing only the road lets a worse route overwrite a better one, and here B (5) replaced the direct 3 km road to C with 5 + 2 = 7.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: `${ID}-48-scenario-1`,
          kind: 'scenario',
          title: 'Which route finder?',
          prompt: 'Choose the algorithm that solves the stated problem.',
          concept: 'choosing a shortest-path algorithm',
          situation: 'A delivery app has a map of 5,000 junctions. Every road has a travel time in minutes, always a positive number, and the app must give the quickest route between two junctions.',
          options: [
            { text: 'Dijkstra\'s algorithm, ideally with a priority queue', consequence: 'It handles different positive weights and returns the route with the smallest total time. A heap keeps the cost near (V + E) log V instead of V squared.', quality: 'best' },
            { text: 'Breadth-first search', consequence: 'BFS returns the route with the fewest roads, which may be a slow one: it treats a 1-minute road and a 20-minute road as equal.', quality: 'poor' },
            { text: 'Depth-first search, stopping at the first route found', consequence: 'DFS returns whichever route it stumbles on first, with no guarantee about the number of roads or minutes.', quality: 'poor' },
          ],
          hints: [
            'Are the roads equal, or do they carry different costs?',
            'Which algorithm in this module adds weights along a route?',
            'Positive weights and a smallest-total goal point to Dijkstra.',
          ],
          explanation: 'The goal is the smallest total weight and all weights are positive, so Dijkstra applies. BFS only counts roads and DFS has no notion of cost.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: `${ID}-48-code-challenge-1`,
          kind: 'code-challenge',
          title: 'Shortest distance',
          prompt: 'Write `shortestDistance(graph, start, target)`. `graph` maps each place to an array of `{ to, km }` roads (a two-way road appears at both ends). Return the smallest total km from `start` to `target`, or -1 if the target cannot be reached. All km are positive.',
          concept: "Dijkstra's algorithm",
          language: 'javascript',
          starter: `function shortestDistance(graph, start, target) {
  // keep a distance table; repeatedly finish the closest unfinished place and relax its roads
}
`,
          solution: `function shortestDistance(graph, start, target) {
  const dist = {};
  for (const place of Object.keys(graph)) {
    dist[place] = Infinity;
  }
  dist[start] = 0;
  const done = new Set();
  while (done.size < Object.keys(graph).length) {
    let current = null;
    for (const place of Object.keys(graph)) {
      if (!done.has(place) && (current === null || dist[place] < dist[current])) {
        current = place;
      }
    }
    if (dist[current] === Infinity) {
      break;
    }
    done.add(current);
    for (const { to, km } of graph[current]) {
      if (dist[current] + km < dist[to]) {
        dist[to] = dist[current] + km;
      }
    }
  }
  return dist[target] === Infinity ? -1 : dist[target];
}
`,
          tests: {
            kind: 'function',
            fn: 'shortestDistance',
            cases: [
              {
                label: 'Plaza to Terminal',
                args: [
                  {
                    Plaza: [{ to: 'Market', km: 2 }, { to: 'School', km: 4 }],
                    Market: [{ to: 'Plaza', km: 2 }, { to: 'School', km: 1 }, { to: 'Terminal', km: 7 }],
                    School: [{ to: 'Plaza', km: 4 }, { to: 'Market', km: 1 }, { to: 'Clinic', km: 3 }],
                    Clinic: [{ to: 'School', km: 3 }, { to: 'Terminal', km: 2 }],
                    Terminal: [{ to: 'Market', km: 7 }, { to: 'Clinic', km: 2 }],
                  },
                  'Plaza',
                  'Terminal',
                ],
                expected: 8,
              },
              { label: 'the same place', args: [{ A: [{ to: 'B', km: 4 }], B: [{ to: 'A', km: 4 }] }, 'A', 'A'], expected: 0 },
              { label: 'unreachable', args: [{ A: [{ to: 'B', km: 4 }], B: [{ to: 'A', km: 4 }], C: [] }, 'A', 'C'], expected: -1 },
              { label: 'the direct road is longer', args: [{ A: [{ to: 'B', km: 10 }, { to: 'C', km: 1 }], B: [{ to: 'A', km: 10 }, { to: 'C', km: 2 }], C: [{ to: 'A', km: 1 }, { to: 'B', km: 2 }] }, 'A', 'B'], expected: 3 },
              {
                label: 'a line of 120 places, 2 km apart (hidden)',
                args: [
                  Object.fromEntries(Array.from({ length: 120 }, (_, i) => [`L${i}`, [...(i > 0 ? [{ to: `L${i - 1}`, km: 2 }] : []), ...(i < 119 ? [{ to: `L${i + 1}`, km: 2 }] : [])]])),
                  'L0',
                  'L119',
                ],
                expected: 238,
                hidden: true,
              },
              {
                label: 'a line with a slow shortcut (hidden)',
                args: [
                  Object.fromEntries(
                    Array.from({ length: 60 }, (_, i) => [
                      `M${i}`,
                      [...(i > 0 ? [{ to: `M${i - 1}`, km: 1 }] : []), ...(i < 59 ? [{ to: `M${i + 1}`, km: 1 }] : []), ...(i === 0 ? [{ to: 'M59', km: 100 }] : []), ...(i === 59 ? [{ to: 'M0', km: 100 }] : [])],
                    ]),
                  ),
                  'M0',
                  'M59',
                ],
                expected: 59,
                hidden: true,
              },
            ],
          },
          hints: [
            'Keep a `dist` object with Infinity for every place and 0 for the start.',
            'Each round, finish the unfinished place with the smallest `dist`. Then for each of its roads, replace the neighbour\'s distance if going through this place is shorter.',
            'Stop when only unreachable places are left (their distance is still Infinity), and return -1 if the target\'s distance is Infinity.',
          ],
          explanation: 'Always finishing the closest unfinished place is safe with non-negative weights, so each place\'s distance is final when it is finished. Relaxing each road lets a shorter indirect route replace a longer direct one. A target still at Infinity cannot be reached.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: `${ID}-48-match-1`,
          kind: 'match',
          title: 'Compare the costs',
          prompt: 'Match each piece of work to its cost, using V vertices and E edges.',
          concept: 'complexity of shortest-path algorithms',
          labels: { terms: 'Work', meanings: 'Cost' },
          pairs: [
            { term: 'Finding the fewest roads with BFS on an adjacency list', definition: 'O(V + E)', note: 'Each vertex and edge is handled a constant number of times.' },
            { term: 'Dijkstra\'s algorithm, scanning all vertices for the smallest distance each round', definition: 'O(V² + E)', note: 'V rounds of an O(V) scan, plus one relaxing look at each road.' },
            { term: 'Dijkstra\'s algorithm with a binary-heap priority queue', definition: 'O((V + E) log V)', note: 'Each push or pop costs O(log V) and there are about V + E of them.' },
            { term: 'One scan for the smallest unfinished distance', definition: 'O(V)', note: 'It looks at every vertex once.' },
          ],
          hints: [
            'Count how many times each piece of work repeats, and how much one repeat costs.',
            'The scan version repeats an O(V) scan V times.',
            'A heap makes finding the smallest cost O(log V), which replaces the V in the scan.',
          ],
          explanation: 'BFS touches each vertex and edge once. The scanning Dijkstra repeats an O(V) scan V times and relaxes each road once. A heap lowers the cost of each "find the smallest" from O(V) to O(log V), giving O((V + E) log V).',
        },
      },
    ],
    quiz: [
      {
        id: `${ID}-48-q1`,
        prompt: 'In each round of Dijkstra\'s algorithm, which vertex is finished next?',
        choices: [
          'The unfinished vertex with the smallest distance found so far',
          'The vertex with the fewest roads leaving it',
          'The first unfinished vertex in the list of places',
          'The unfinished vertex with the largest distance, to get it out of the way',
        ],
        answer: 0,
        explanation: 'The smallest known distance among unfinished vertices cannot be improved later (with non-negative weights), so that vertex can be finished safely.',
      },
      {
        id: `${ID}-48-q2`,
        prompt: 'Why can Dijkstra\'s algorithm give a wrong answer when a road has a negative weight?',
        choices: [
          'Because negative numbers cannot be stored as values in a JavaScript object or an array',
          'Because a finished vertex was assumed final, yet a later negative road can undercut it',
          'Because the scan for the smallest distance starts returning the largest distance instead',
          'Because it makes the graph directed, and Dijkstra only works on undirected graphs of this size',
        ],
        answer: 1,
        explanation: 'Finishing a vertex relies on "any other route can only add distance". A negative road subtracts distance, so a route found later can beat a vertex that was already finished.',
      },
      {
        id: `${ID}-48-q3`,
        prompt: 'A map has 1,000 places. About how many scan checks does the scanning version of Dijkstra make while looking for the smallest distance?',
        choices: ['About 1,000', 'About 10,000', 'About 1,000,000', 'About 10'],
        answer: 2,
        explanation: 'It does a scan of all 1,000 places in each of 1,000 rounds: 1,000 x 1,000 = 1,000,000, the V² in O(V²).',
      },
      {
        id: `${ID}-48-q4`,
        prompt: 'Every road in a graph has the same weight. Which simpler algorithm gives the same shortest paths as Dijkstra?',
        choices: ['Depth-first search', 'Kahn\'s algorithm', 'Binary search', 'Breadth-first search'],
        answer: 3,
        explanation: 'When all weights are equal, the total weight is just the number of roads times that weight, so the route with the fewest roads is the shortest. BFS finds it in O(V + E).',
      },
      {
        id: `${ID}-48-q5`,
        audience: { max: 'beginner' },
        prompt: 'Route A has 2 roads and totals 15 km. Route B has 3 roads and totals 9 km. If you want the shortest distance, which route do you take?',
        choices: ['Route A, because it has fewer roads', 'Route B, because its total is smaller', 'Either, because they are about the same', 'Neither, because both are too long'],
        answer: 1,
        explanation: 'Shortest distance means the smallest total, 9 km, so Route B wins even though it has more roads.',
      },
      {
        id: `${ID}-48-q6`,
        audience: { min: 'advanced' },
        prompt: 'A road network has 1,000,000 junctions and about 3,000,000 two-way roads. Which Dijkstra implementation is practical?',
        choices: [
          'The scanning version, which costs about V² = 10^12 checks',
          'The scanning version, because O(V²) is smaller than O(E log V) when E is large',
          'Breadth-first search, because it also handles weights',
          'The heap version, about (V + E) log V, under a hundred million steps',
        ],
        answer: 3,
        explanation: 'A road network is sparse, so E is only a few times V, and the heap version costs roughly 4 million times a logarithm of about 20, under a hundred million steps. The scanning version needs about a trillion checks, and BFS ignores weights.',
      },
    ],
    task: {
      title: 'Compare fewest roads and shortest distance',
      minutes: 20,
      steps: [
        'Copy `dijkstra`, `routeTo`, `shortestRoute` and `fewestRoads` (from lesson 46) into one file, using the barangay map in both forms (neighbours with and without km).',
        'For every pair of places, compute both routes and print the pairs where the two answers differ.',
        'Change the Market to Terminal road from 7 to 1 and run again. Which answers changed, and why?',
        'Use a counter like the one in this lesson to count scans for your map, then for a line map of 50 places, and write down how the count grew.',
      ],
    },
    taskExtra: [
      {
        audience: { max: 'beginner' },
        steps: ['Before running the code, work out Plaza to Terminal by hand using the distance table in this lesson, then run it and compare.'],
      },
      {
        audience: { min: 'advanced' },
        steps: [
          'Replace the scan with the min-heap priority queue you built in module 11, and compare the number of heap operations with the number of scans on a map of 1,000 places.',
          'Add early exit when the target is finished, and measure how many rounds you saved on a few queries.',
        ],
      },
    ],
  },
];

export const project: Project | null = {
  id: `${ID}-p10`,
  title: 'A navigation system for a neighbourhood',
  summary: 'Build a small route finder over a map of places and roads: connections, fewest roads, shortest distance, road closures and separate regions, all as functions over one graph.',
  outcome: 'A working graph project with a written explanation of why you chose each structure and algorithm, and what each query costs, that you can show as proof you can reason about graphs and review AI-written route code.',
  unlockAfterDay: 48,
  steps: [
    {
      id: `${ID}-p10-s1`,
      text: 'Design your map as plain data: at least 8 locations and 10 two-way roads in your own area or an invented town, each road with a distance in km (made-up numbers are fine). Make sure at least one place is cut off from the rest, and at least one pair of places where the fewest-roads route is not the shortest-distance route.',
    },
    {
      id: `${ID}-p10-s2`,
      text: 'Write `addRoad(graph, a, b, km)` and build an adjacency list (a `Map` or an object of arrays of `{ to, km }`) from your data. In a comment, write the V and E of your map and say how many entries a matrix would have needed against your list.',
    },
    {
      id: `${ID}-p10-s3`,
      text: 'Write `regions(graph)` that returns the connected components, and `canReach(graph, a, b)` that says whether any route exists, using a traversal with a visited set.',
    },
    {
      id: `${ID}-p10-s4`,
      text: 'Write `fewestRoads(graph, a, b)` (breadth-first search, returning the path or null) and `shortestRoute(graph, a, b)` (Dijkstra, returning `{ km, path }` or null). Use one clear convention for "no route" and keep it the same in both.',
    },
    {
      id: `${ID}-p10-s5`,
      text: 'Write `closeRoad(graph, a, b)` that removes a road at both ends. Then, with `console.log`, run at least six queries: a normal route, the same place twice, an unreachable place, a pair where `fewestRoads` and `shortestRoute` differ, and a route before and after you close the road it used.',
    },
    {
      id: `${ID}-p10-s6`,
      text: 'Add an operation counter to one search (vertices taken from the queue and roads looked at for BFS, scan checks for Dijkstra). Print the counts for one query and compare them with V and E.',
    },
    {
      id: `${ID}-p10-s7`,
      text: 'Before asking an AI anything, write down the edge cases you think your code must survive. Then ask an AI assistant to review your code and list edge cases and complexity claims, and record which of its points you checked by running or counting, which you accepted and which you rejected, and why. Do not paste anything private.',
    },
    {
      id: `${ID}-p10-s8`,
      text: 'Write your explanation (200 to 400 words): which structure you chose for the graph and why, what each function costs in V and E, why Dijkstra needs non-negative km, and what you would change if the map had a million locations.',
    },
    {
      id: `${ID}-p10-s9`,
      audience: { max: 'beginner' },
      text: 'A smaller version is fine: 6 places and 7 roads. Before you run each query, write down the answer you expect, by hand from your drawing, and compare it with what the program prints.',
    },
    {
      id: `${ID}-p10-s10`,
      audience: { min: 'advanced' },
      text: 'Support one-way roads (a directed edge) in `addRoad`, reject a negative km with a clear error, and replace the scan in Dijkstra with the min-heap priority queue from module 11. Show with operation counts, on a generated map of at least 1,000 places, how much the heap saves.',
    },
  ],
  submission: {
    kind: 'text',
    label: 'Your code and your explanation',
    placeholder: 'Paste your JavaScript (the map data, the functions, and the console.log queries with their output), then your written explanation of the structures, algorithms and costs.',
    hint: 'Include the sample map, every function, the printed results of your six or more queries, your operation counts, the edge cases you listed before using AI and what you did with its review, and your explanation of the trade-offs.',
  },
  rubric: [
    'Correctness: connections, regions, fewest roads, shortest distance and closed roads give the right answers on the sample map, including the same place twice and an unreachable place.',
    'Efficiency: the graph is an adjacency list, both searches use a visited or done structure so they cannot loop, and the costs stated for each function are correct in terms of V and E.',
    'Code organization: small, clearly named functions that take the graph as a parameter, map data kept separate from logic, and no duplicated code for building or searching.',
    'Explaining trade-offs: the explanation justifies list over matrix, BFS versus Dijkstra for their purposes, scanning versus a heap, and the non-negative weight limit, in the learner\'s own words.',
    'Testing and AI use: the edge-case list was written before the AI review, and claims taken from the AI were checked by running or counting.',
  ],
  rubricExtra: [
    {
      audience: { max: 'beginner' },
      items: ['The smaller map is acceptable, but the expected answers were written by hand before running, and at least one cost is stated in terms of V and E in the learner\'s own words.'],
    },
    {
      audience: { min: 'advanced' },
      items: [
        'Dijkstra uses a heap and measured counts show the improvement over the scan on a generated map of at least 1,000 places.',
        'One-way roads and negative km are handled explicitly, and the tests cover ties, a duplicate road and a closed bridge that disconnects part of the map.',
      ],
    },
  ],
};
