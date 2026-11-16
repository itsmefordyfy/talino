import { defineStrings } from '@/lib/i18n';

import type { Cardinality, RelationType } from './types';

const en = {
  tapHint: 'Tap a part of the diagram to read about it.',
  scrollHint: 'Swipe sideways to see the whole diagram.',
  fallbackTitle: "This diagram can't be shown",
  fallbackBody: 'It is not valid, so here is what it was meant to show.',
  fallbackEmpty: 'Nothing to show.',
  messageNumber: (n: number) => `Step ${n}`,
  selectedNode: (label: string) => `${label}.`,
  nodeButton: (label: string) => `${label}, part of the diagram`,
  messageButton: (n: number, label: string) => `Message ${n}: ${label}`,
  selectedPart: 'Selected part',
  expand: 'Full screen',
  expandLabel: (title: string) => `Open the diagram “${title}” full screen`,
  close: 'Close',
  zoomIn: 'Zoom in',
  zoomOut: 'Zoom out',
  zoomLevel: (percent: number) => `${percent}%`,
  fitWidth: 'Fit to screen',
  fullScreenHint: 'Swipe in any direction to move around. Tap a part to read about it.',
  /** The spoken description of a diagram's structure (`describeDiagram`), read by screen readers. */
  describe: {
    cardinality: { one: 'exactly one', 'zero-or-one': 'zero or one', 'one-or-many': 'one or many', 'zero-or-many': 'zero or many' } as Record<Cardinality, string>,
    relations: { inherits: 'inherits from', implements: 'implements', composes: 'is made of', aggregates: 'holds', associates: 'is linked to', depends: 'depends on' } as Record<RelationType, string>,
    flowHead: (count: number) => `Flowchart with ${count} ${count === 1 ? 'step' : 'steps'}`,
    architectureHead: (count: number) => `Architecture diagram with ${count} ${count === 1 ? 'component' : 'components'}`,
    linkTo: 'to',
    linkAnd: 'and',
    bothWays: 'both ways',
    sequenceHead: (count: number, names: string) => `Sequence diagram with ${count} ${count === 1 ? 'participant' : 'participants'}: ${names}.`,
    messagesInOrder: 'Messages in order:',
    replies: 'replies to',
    sends: 'sends to',
    classHead: (count: number, names: string) => `Class diagram with ${count} ${count === 1 ? 'class' : 'classes'}: ${names}.`,
    relationsHead: 'Relations:',
    erHead: (count: number, names: string) => `Entity relationship diagram with ${count} ${count === 1 ? 'entity' : 'entities'}: ${names}.`,
    relationshipsHead: 'Relationships:',
  },
};

const fil: typeof en = {
  tapHint: 'I-tap ang isang bahagi ng diagram para mabasa ang tungkol dito.',
  scrollHint: 'I-swipe pakaliwa o pakanan para makita ang buong diagram.',
  fallbackTitle: 'Hindi maipakita ang diagram na ito',
  fallbackBody: 'Hindi ito valid, kaya ito ang dapat sana nitong ipinapakita.',
  fallbackEmpty: 'Walang maipapakita.',
  messageNumber: (n: number) => `Step ${n}`,
  selectedNode: (label: string) => `${label}.`,
  nodeButton: (label: string) => `${label}, bahagi ng diagram`,
  messageButton: (n: number, label: string) => `Message ${n}: ${label}`,
  selectedPart: 'Napili',
  expand: 'Full screen',
  expandLabel: (title: string) => `Buksan ang diagram na “${title}” sa full screen`,
  close: 'Isara',
  zoomIn: 'Zoom in',
  zoomOut: 'Zoom out',
  zoomLevel: (percent: number) => `${percent}%`,
  fitWidth: 'Fit sa screen',
  fullScreenHint: 'I-swipe sa kahit anong direksyon para gumalaw. I-tap ang isang bahagi para mabasa ang tungkol dito.',
  describe: {
    cardinality: { one: 'eksaktong isa', 'zero-or-one': 'zero o isa', 'one-or-many': 'isa o marami', 'zero-or-many': 'zero o marami' } as Record<Cardinality, string>,
    relations: { inherits: 'nag-i-inherit sa', implements: 'implements', composes: 'binubuo ng', aggregates: 'may hawak', associates: 'konektado sa', depends: 'umaasa sa' } as Record<RelationType, string>,
    flowHead: (count: number) => `Flowchart na may ${count} hakbang`,
    architectureHead: (count: number) => `Architecture diagram na may ${count} component`,
    linkTo: 'sa',
    linkAnd: 'at',
    bothWays: 'two-way',
    sequenceHead: (count: number, names: string) => `Sequence diagram na may ${count} participant: ${names}.`,
    messagesInOrder: 'Mga message ayon sa pagkakasunod:',
    replies: 'sumasagot sa',
    sends: 'padala sa',
    classHead: (count: number, names: string) => `Class diagram na may ${count} class: ${names}.`,
    relationsHead: 'Mga relation:',
    erHead: (count: number, names: string) => `Entity relationship diagram na may ${count} entity: ${names}.`,
    relationshipsHead: 'Mga relationship:',
  },
};

export const diagramStrings = defineStrings({ en, fil });

export type DiagramStrings = (typeof diagramStrings)['en'];
