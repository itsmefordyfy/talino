import type { ClassBox, DiagramSpec } from './types';
import { diagramStrings } from './strings';

type Text = (typeof diagramStrings)['en']['describe'];

/**
 * The spoken description of a diagram's structure, for screen readers and as a plain-text fallback:
 * "Flowchart with 5 steps: Start to Check, Check to Home (yes)." Built from the spec only; the words come from `t`
 * (English unless the caller passes the learner's language).
 */
export function describeDiagram(spec: DiagramSpec, t: Text = diagramStrings.en.describe): string {
  switch (spec.kind) {
    case 'flow':
    case 'architecture': {
      const names = new Map(spec.nodes.map((node) => [node.id, node.label] as const));
      const name = (id: string) => names.get(id) ?? id;
      const head = spec.kind === 'flow' ? t.flowHead(spec.nodes.length) : t.architectureHead(spec.nodes.length);
      if (spec.edges.length === 0) return `${head}: ${spec.nodes.map((node) => node.label).join(', ')}.`;
      const links = spec.edges.map((edge) => {
        const arrow = edge.bidirectional ? t.linkAnd : t.linkTo;
        return `${name(edge.from)} ${arrow} ${name(edge.to)}${edge.bidirectional ? ` (${t.bothWays})` : ''}${edge.label ? ` (${edge.label})` : ''}`;
      });
      return `${head}: ${links.join(', ')}.`;
    }
    case 'sequence': {
      const names = new Map(spec.participants.map((participant) => [participant.id, participant.label] as const));
      const name = (id: string) => names.get(id) ?? id;
      const head = t.sequenceHead(spec.participants.length, spec.participants.map((participant) => participant.label).join(', '));
      const lines = spec.messages.map((message, index) => `${index + 1}, ${name(message.from)} ${message.dashed ? t.replies : t.sends} ${name(message.to)}: ${message.label}.`);
      return `${head} ${t.messagesInOrder} ${lines.join(' ')}`;
    }
    case 'class': {
      const names = new Map(spec.classes.map((box: ClassBox) => [box.id, box.label] as const));
      const name = (id: string) => names.get(id) ?? id;
      const head = t.classHead(spec.classes.length, spec.classes.map((box) => box.label).join(', '));
      if (spec.relations.length === 0) return head;
      const relations = spec.relations.map((relation) => `${name(relation.from)} ${t.relations[relation.type]} ${name(relation.to)}${relation.label ? ` (${relation.label})` : ''}`);
      return `${head} ${t.relationsHead} ${relations.join('; ')}.`;
    }
    case 'er': {
      const names = new Map(spec.entities.map((entity) => [entity.id, entity.label] as const));
      const name = (id: string) => names.get(id) ?? id;
      const head = t.erHead(spec.entities.length, spec.entities.map((entity) => entity.label).join(', '));
      if (spec.relationships.length === 0) return head;
      const relationships = spec.relationships.map(
        (relationship) => `${name(relationship.from)} (${t.cardinality[relationship.fromCardinality]}) ${relationship.label} ${name(relationship.to)} (${t.cardinality[relationship.toCardinality]})`,
      );
      return `${head} ${t.relationshipsHead} ${relationships.join('; ')}.`;
    }
  }
}
