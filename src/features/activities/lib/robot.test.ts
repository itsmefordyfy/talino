import { describe, expect, test } from '@jest/globals';

import type { RobotWorld } from '../types';
import { recordRobotCommands, robotPrelude, simulateRobot, validateWorld } from './robot';

const world: RobotWorld = {
  width: 5,
  height: 3,
  start: { x: 0, y: 0 },
  goal: { x: 4, y: 2 },
  walls: [{ x: 3, y: 1 }],
  items: [{ x: 2, y: 0 }],
  commands: ['moveRight', 'moveLeft', 'moveUp', 'moveDown', 'pickUp'],
};

describe('simulateRobot', () => {
  test('a full solution reaches the goal with the star', () => {
    const sim = simulateRobot(world, ['R', 'R', 'P', 'D', 'D', 'R', 'R']);
    expect(sim.position).toEqual({ x: 4, y: 2 });
    expect(sim.reachedGoal).toBe(true);
    expect(sim.itemsLeft).toBe(0);
    expect(sim.stop).toBeNull();
    expect(sim.path).toHaveLength(7);
    expect(sim.collected).toEqual([{ x: 2, y: 0 }]);
  });
  test('stops at the edge', () => {
    const sim = simulateRobot(world, ['L', 'R']);
    expect(sim.stop).toEqual({ index: 1, reason: 'wall' });
    expect(sim.position).toEqual({ x: 0, y: 0 });
    expect(sim.stoppedAt).toBe(1);
  });
  test('stops at a wall', () => {
    const sim = simulateRobot(world, ['R', 'R', 'R', 'D']);
    expect(sim.stop).toEqual({ index: 4, reason: 'wall' });
    expect(sim.position).toEqual({ x: 3, y: 0 });
  });
  test('stops when picking up nothing, and cannot pick the same star twice', () => {
    expect(simulateRobot(world, ['P']).stop).toEqual({ index: 1, reason: 'nothing' });
    expect(simulateRobot(world, ['R', 'R', 'P', 'P']).stop).toEqual({ index: 4, reason: 'nothing' });
  });
  test('missing the star or the goal is reported', () => {
    const sim = simulateRobot(world, ['R', 'R']);
    expect(sim.itemsLeft).toBe(1);
    expect(sim.reachedGoal).toBe(false);
  });
  test('ignores unknown command codes', () => {
    expect(simulateRobot(world, ['X', 'R']).position).toEqual({ x: 1, y: 0 });
  });
});

describe('recordRobotCommands', () => {
  test('records the commands a program calls, loops included', () => {
    const run = recordRobotCommands('for (let i = 0; i < 2; i++) { moveRight(); }\npickUp();\nmoveDown();', world);
    expect(run).toEqual({ ok: true, commands: ['R', 'R', 'P', 'D'], output: [] });
  });
  test('an empty program records nothing', () => {
    expect(recordRobotCommands('// nothing', world)).toEqual({ ok: true, commands: [], output: [] });
  });
  test('keeps the learner console.log lines apart from the recording', () => {
    const run = recordRobotCommands('console.log("hi"); moveRight();', world);
    expect(run).toEqual({ ok: true, commands: ['R'], output: ['hi'] });
  });
  test('reports an error with the learner own line number', () => {
    const run = recordRobotCommands('moveRight();\nmoveDiagonal();', world);
    expect(run.ok).toBe(false);
    if (!run.ok) {
      expect(run.error.line).toBe(2);
      expect(run.error.message).toMatch(/moveDiagonal/);
    }
  });
  test('only the world commands exist', () => {
    const small: RobotWorld = { ...world, commands: ['moveRight'] };
    expect(recordRobotCommands('moveLeft();', small).ok).toBe(false);
    expect(robotPrelude(small)).not.toMatch(/moveLeft/);
  });
  test('a runaway loop is stopped and capped', () => {
    const run = recordRobotCommands('while (true) { moveRight(); }', world);
    expect(run.ok).toBe(false);
  });
  test('a syntax error is an error, not a crash', () => {
    expect(recordRobotCommands('moveRight(', world).ok).toBe(false);
  });
});

describe('validateWorld', () => {
  test('a good world has no problems', () => {
    expect(validateWorld(world)).toEqual([]);
  });
  test('finds out-of-grid cells, walls on start, and missing commands', () => {
    expect(validateWorld({ ...world, goal: { x: 9, y: 0 } }).join(' ')).toMatch(/goal is outside/);
    expect(validateWorld({ ...world, walls: [{ x: 0, y: 0 }] }).join(' ')).toMatch(/wall sits on the start/);
    expect(validateWorld({ ...world, walls: [{ x: 4, y: 2 }] }).join(' ')).toMatch(/goal/);
    expect(validateWorld({ ...world, items: [{ x: 3, y: 1 }] }).join(' ')).toMatch(/item sits on a wall/);
    expect(validateWorld({ ...world, commands: [] }).join(' ')).toMatch(/no commands/);
    expect(validateWorld({ ...world, commands: ['moveRight'] }).join(' ')).toMatch(/pickUp/);
    expect(validateWorld({ ...world, width: 20 }).join(' ')).toMatch(/larger than 10/);
  });
});
