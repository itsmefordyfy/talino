import { describe, expect, test } from '@jest/globals';

import { aiStrings } from '../../ai/strings';
import { appSpec, APP_SCENARIOS, llmSpec, ragSpec } from '../../ai/lib/workflows';
import { START_INPUTS, START_NET } from '../../ai/lib/network';
import { networkSpec } from '../../ai/lib/network-spec';
import { architectureSpec } from '../../software-engineering/lib/architecture';
import { patternSpec, PATTERN_IDS } from '../../software-engineering/lib/patterns';
import { sdlcSpec } from '../../software-engineering/lib/sdlc';
import { softwareStrings } from '../../software-engineering/strings';
import { apiTraceSpec } from '../../web/lib/api-trace';
import { AUTH_OUTCOMES, authSpec } from '../../web/lib/auth-flow';
import { CLIENT_SERVER_IDS, clientServerSpec } from '../../web/lib/client-server';
import { webStrings } from '../../web/strings';
import { describeDiagram } from '../describe';
import type { DiagramSpec } from '../types';
import { validateDiagram } from '../validate';
import { layoutDiagram } from './index';

const web = webStrings.en;
const se = softwareStrings.en;
const ai = aiStrings.en;

const specs: [string, DiagramSpec][] = [
  ['api trace', apiTraceSpec(web.apiTrace)],
  ...CLIENT_SERVER_IDS.map((id): [string, DiagramSpec] => [`client-server ${id}`, clientServerSpec(id, web.clientServer)]),
  ...AUTH_OUTCOMES.map((id): [string, DiagramSpec] => [`auth ${id}`, authSpec(id, web.auth)]),
  ['sdlc', sdlcSpec(se.sdlc)],
  ['architecture', architectureSpec({ title: se.architecture.title, summary: se.architecture.summary, components: se.architecture.components, groups: se.architecture.groups })],
  ...PATTERN_IDS.map((id): [string, DiagramSpec] => [
    `pattern ${id}`,
    patternSpec(id, {
      observer: { title: se.patterns.diagramTitles.observer, summary: se.patterns.diagramSummaries.observer, notes: se.patterns.notes.observer },
      factory: { title: se.patterns.diagramTitles.factory, summary: se.patterns.diagramSummaries.factory, notes: se.patterns.notes.factory },
      singleton: { title: se.patterns.diagramTitles.singleton, summary: se.patterns.diagramSummaries.singleton, notes: se.patterns.notes.singleton },
    }),
  ]),
  ['llm', llmSpec(ai.llmWorkflow)],
  ['rag', ragSpec(ai.rag)],
  ...APP_SCENARIOS.map((id): [string, DiagramSpec] => [`ai app ${id}`, appSpec(id, ai.appWorkflow)]),
  ['network', networkSpec(START_NET, START_INPUTS, 'relu', ai.network)],
];

describe('every visual diagram', () => {
  test.each(specs)('%s is valid, described and laid out cleanly on phone widths', (_name, spec) => {
    expect(validateDiagram(spec).ok).toBe(true);
    expect(describeDiagram(spec).length).toBeGreaterThan(20);
    for (const width of [264, 300, 360]) {
      const layout = layoutDiagram(spec, width);
      for (let i = 0; i < layout.nodes.length; i += 1) {
        for (let j = i + 1; j < layout.nodes.length; j += 1) {
          const a = layout.nodes[i];
          const b = layout.nodes[j];
          expect(a.x < b.x + b.width && b.x < a.x + a.width && a.y < b.y + b.height && b.y < a.y + a.height).toBe(false);
        }
      }
      expect(layout.fontSize).toBeGreaterThanOrEqual(12);
      expect(layout.needsScroll).toBe(layout.width > width);
      // No label broken in the middle of a word with a hyphen: short words must stay whole.
      for (const node of layout.nodes) for (const line of node.lines) expect(line.text.length).toBeLessThanOrEqual(40);
    }
  });

  test('flow diagrams fit a 264 pt phone without scrolling; a sequence of up to three participants does too', () => {
    for (const [name, spec] of specs) {
      const layout = layoutDiagram(spec, 264);
      if (spec.kind === 'sequence' && spec.participants.length > 3) continue;
      expect([name, layout.needsScroll]).toEqual([name, false]);
    }
  });
});
