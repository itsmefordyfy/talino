import { runJs, runnerStrings, type RunnerText } from '@/features/code-runner';

import type { RobotCommand, RobotOutcome, RobotWorld } from '../types';

/**
 * The guided "robot" challenges. The learner's JavaScript calls action commands; the sandbox only
 * records them (`R`, `L`, `U`, `D`, `P`) and this module then plays the recording on the grid, so the
 * rules of the world live here in plain, tested TypeScript, and the program runs in the same sandbox
 * as every other challenge. The prelude sits on the first line of the program, so line numbers in
 * error messages stay the learner's own.
 */

const CODES: Record<RobotCommand, string> = { moveRight: 'R', moveLeft: 'L', moveUp: 'U', moveDown: 'D', pickUp: 'P' };
const MARKER = '__ROBOT__';
/** More commands than any lesson needs: a runaway loop stops being drawn here. */
export const MAX_ROBOT_COMMANDS = 500;

export function robotPrelude(world: RobotWorld): string {
  const defs = world.commands.map((name) => `function ${name}(){__c.push('${CODES[name]}');}`).join('');
  return `var __c=[];${defs}`;
}

export type RobotRun = { ok: true; commands: string[]; output: string[] } | { ok: false; error: { message: string; line: number | null }; output: string[] };

/** Runs the learner's program and returns the commands it gave the robot. */
export function recordRobotCommands(source: string, world: RobotWorld, text: RunnerText = runnerStrings.en): RobotRun {
  const program = `${robotPrelude(world)}${source}\n;console.log('${MARKER}'+__c.join(','));`;
  const result = runJs(program, undefined, text);
  const lines = result.output.filter((line) => !line.startsWith(MARKER));
  if (!result.ok || result.error) {
    return { ok: false, error: { message: result.error?.message ?? text.programStopped, line: result.error?.line ?? null }, output: lines };
  }
  const marker = [...result.output].reverse().find((line) => line.startsWith(MARKER));
  const list = marker === undefined ? '' : marker.slice(MARKER.length);
  const commands = list === '' ? [] : list.split(',');
  return { ok: true, commands: commands.slice(0, MAX_ROBOT_COMMANDS), output: lines };
}

const MOVES: Record<string, { dx: number; dy: number }> = { R: { dx: 1, dy: 0 }, L: { dx: -1, dy: 0 }, U: { dx: 0, dy: -1 }, D: { dx: 0, dy: 1 } };

const same = (a: { x: number; y: number }, b: { x: number; y: number }) => a.x === b.x && a.y === b.y;

/** What was wrong when the robot stopped early. */
export type RobotStop = { index: number; reason: 'wall' | 'nothing' };

export type RobotSimulation = RobotOutcome & { stop: RobotStop | null; itemsLeft: number; commandCount: number };

/** Plays a list of commands in a world. The robot stops at the first illegal move or empty pick-up. */
export function simulateRobot(world: RobotWorld, commands: readonly string[]): RobotSimulation {
  let position = { ...world.start };
  const path = [{ ...position }];
  const collected: { x: number; y: number }[] = [];
  let stop: RobotStop | null = null;

  for (let index = 0; index < commands.length; index += 1) {
    const command = commands[index];
    if (command === 'P') {
      const item = world.items.find((candidate) => same(candidate, position) && !collected.some((c) => same(c, candidate)));
      if (!item) {
        stop = { index: index + 1, reason: 'nothing' };
        break;
      }
      collected.push({ ...item });
      continue;
    }
    const move = MOVES[command];
    if (!move) continue;
    const next = { x: position.x + move.dx, y: position.y + move.dy };
    const outside = next.x < 0 || next.y < 0 || next.x >= world.width || next.y >= world.height;
    if (outside || world.walls.some((wall) => same(wall, next))) {
      stop = { index: index + 1, reason: 'wall' };
      break;
    }
    position = next;
    path.push({ ...position });
  }

  return {
    position,
    collected,
    path,
    stoppedAt: stop ? stop.index : null,
    reachedGoal: same(position, world.goal),
    stop,
    itemsLeft: world.items.length - collected.length,
    commandCount: commands.length,
  };
}

/** Whether the world's own rules are well formed (inside the grid, nothing on a wall); returns the problems. */
export function validateWorld(world: RobotWorld): string[] {
  const problems: string[] = [];
  const inside = (p: { x: number; y: number }) => Number.isInteger(p.x) && Number.isInteger(p.y) && p.x >= 0 && p.y >= 0 && p.x < world.width && p.y < world.height;
  if (!(world.width >= 2 && world.height >= 1)) problems.push('The robot world needs at least a 2x1 grid.');
  if (world.width > 10 || world.height > 10) problems.push('The robot world is larger than 10x10.');
  const named: [string, { x: number; y: number }][] = [['start', world.start], ['goal', world.goal], ...world.walls.map((w, i): [string, { x: number; y: number }] => [`wall ${i + 1}`, w]), ...world.items.map((w, i): [string, { x: number; y: number }] => [`item ${i + 1}`, w])];
  for (const [name, point] of named) if (!inside(point)) problems.push(`The robot world's ${name} is outside the grid.`);
  for (const wall of world.walls) {
    if (same(wall, world.start)) problems.push('A wall sits on the start cell.');
    if (same(wall, world.goal)) problems.push('A wall sits on the goal.');
    if (world.items.some((item) => same(item, wall))) problems.push('An item sits on a wall.');
  }
  if (world.commands.length === 0) problems.push('The robot world has no commands.');
  if (world.items.length > 0 && !world.commands.includes('pickUp')) problems.push('The world has items but no pickUp command.');
  return problems;
}
