import type { RoleplayScenario } from '../types';
import { breaksCharacter, leaksPrivate } from './guard';
import { MAX_PARTNER_CHARS, cleanText } from './sanitize';

/**
 * One turn of the partner as the model must return it (Gemini's response schema): what they say, and whether the conversation has
 * naturally concluded (a deal was reached, the partner closed it, or the learner walked away). The conversation itself lives on the
 * phone; nothing private about the partner is ever part of a turn.
 */

export const TURN_SCHEMA = {
  type: 'OBJECT',
  properties: {
    reply: { type: 'STRING' },
    end: { type: 'BOOLEAN' },
  },
  required: ['reply', 'end'],
} as const;

export type PartnerTurn = { reply: string; end: boolean };

export type ParseTurnOptions = {
  scenario: RoleplayScenario;
  /** Which learner turn this reply answers, counting from 1. */
  turn: number;
};

/**
 * The model's JSON checked for shape; null when it isn't a usable turn (unreadable, empty, a recitation of the private brief, or a break
 * of character). The reply to the last allowed learner turn always ends the conversation.
 */
export function parseTurn(text: string, { scenario, turn }: ParseTurnOptions): PartnerTurn | null {
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    return null;
  }
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) return null;
  const value = raw as Record<string, unknown>;
  const reply = cleanText(value.reply, MAX_PARTNER_CHARS)
    .replace(/^["“”]+|["“”]+$/g, '')
    .trim();
  if (!reply) return null;
  if (leaksPrivate(reply, scenario) || breaksCharacter(reply)) return null;
  return { reply, end: value.end === true || turn >= scenario.maxTurns };
}

/**
 * A turn as the phone reads it back from the route: a non-empty reply and an end flag (missing means the conversation goes on). The
 * route already checked it against the private brief; this only protects the screen from a damaged or hand-made answer.
 */
export function readPartnerTurn(value: unknown): PartnerTurn | null {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return null;
  const { reply, end } = value as Record<string, unknown>;
  const text = cleanText(reply, MAX_PARTNER_CHARS);
  return text ? { reply: text, end: end === true } : null;
}
