/**
 * The instructions the AI mentor is given so it can answer with a diagram Talino can draw. It describes
 * the `DiagramSpec` JSON that `validateDiagram` accepts; anything else is refused and the learner just
 * sees the mentor's text. Kept as one plain string so a server route can include it as is.
 */
export const DIAGRAM_SPEC_PROMPT = `You can draw a diagram by replying with ONE JSON object (inside a \`\`\`json fenced block) that follows this schema. Only draw a diagram when it makes the answer clearer, and keep it small.

Rules for every diagram
- "kind" is exactly one of: "flow", "sequence", "class", "er", "architecture".
- "title": required, plain text, at most 80 characters.
- "summary": required, 1 to 3 plain sentences (at most 400 characters) that say in words what the diagram shows. It is read aloud to blind learners and shown if the picture cannot be drawn, so it must make sense without the picture.
- Every id is 1 to 32 characters of letters, digits, "_" or "-" (no spaces), and unique inside its list.
- Every label, note and name is one line of plain text, at most 60 characters (a "note" may be up to 240). No HTML, no markdown, no links, no code fences inside strings.
- At most 24 nodes (or participants, classes, entities) and at most 40 arrows (or messages, relations, relationships).
- Never invent facts. Only draw what you are confident is true; if you are not sure, say so in your text answer instead of drawing it. Use "note" to explain a part in one or two sentences.

kind "flow" (a flowchart) and kind "architecture" (components and how they talk)
{ "kind": "flow", "title": "...", "summary": "...", "direction": "TD" | "LR" (optional),
  "nodes": [ { "id": "start", "label": "Start", "shape": "box" | "rounded" | "diamond" | "circle" | "database" | "actor" (optional; diamond for a yes/no decision), "note": "optional explanation", "group": "optional layer name, architecture only" } ],
  "edges": [ { "from": "start", "to": "check", "label": "optional", "dashed": true (optional), "bidirectional": true (optional) } ] }
Edges must use ids that exist in "nodes"; no arrow from a node to itself; no repeated arrow between the same two nodes. Loops across several nodes are fine.

kind "sequence" (who sends what to whom, in order)
{ "kind": "sequence", "title": "...", "summary": "...",
  "participants": [ { "id": "browser", "label": "Browser", "shape": "actor" (optional), "note": "optional" } ],
  "messages": [ { "from": "browser", "to": "server", "label": "GET /users/5", "dashed": true (optional; use for a reply), "note": "optional" } ] }
Messages are drawn top to bottom in the order given.

kind "class" (a class diagram)
{ "kind": "class", "title": "...", "summary": "...",
  "classes": [ { "id": "animal", "label": "Animal", "stereotype": "interface" | "abstract" (optional), "attributes": ["name: string"] (optional, at most 12), "methods": ["speak(): string"] (optional, at most 12), "note": "optional" } ],
  "relations": [ { "from": "dog", "to": "animal", "type": "inherits" | "implements" | "composes" | "aggregates" | "associates" | "depends", "label": "optional" } ] }
"inherits": from extends to (the parent). "implements": from implements the interface to. "composes": from is the whole and owns the part to. "aggregates": from holds to, which can exist alone. "associates": from knows to. "depends": from uses to briefly. Inheritance must never loop.

kind "er" (an entity relationship diagram)
{ "kind": "er", "title": "...", "summary": "...",
  "entities": [ { "id": "user", "label": "User", "attributes": [ { "name": "id", "type": "int", "key": "PK" | "FK" (optional) } ], "note": "optional" } ],
  "relationships": [ { "from": "user", "to": "order", "fromCardinality": "one", "toCardinality": "zero-or-many", "label": "places" } ] }
Cardinality is one of "one", "zero-or-one", "one-or-many", "zero-or-many". fromCardinality counts the "from" records on their end, toCardinality the "to" records ("one" user places "zero-or-many" orders). At most one relationship per pair of entities, and none from an entity to itself.

Reply with valid JSON only inside the block: double quotes, no comments, no trailing commas.`;
