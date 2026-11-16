import { ScrollView, StyleSheet, View } from 'react-native';

import { Icon, type IconName } from '@/components/ui/icon';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useTones } from '@/hooks/use-tones';
import { useLocalized } from '@/hooks/use-strings';

import { activityStrings } from '../strings';
import type { RobotOutcome, RobotWorld } from '../types';

export type RobotGridProps = {
  world: RobotWorld;
  /** Where the robot ended after a run; the start position until then. */
  outcome?: RobotOutcome | null;
};

const CELL = 38;

/** The robot's world: walls, stars, the flag, the robot, and the cells it passed through. Read aloud as one summary. */
export function RobotGrid({ world, outcome }: RobotGridProps) {
  const theme = useTheme();
  const tones = useTones();
  const strings = useLocalized(activityStrings);
  const position = outcome?.position ?? world.start;
  const visited = new Set((outcome?.path ?? []).map((p) => `${p.x},${p.y}`));
  const collected = new Set((outcome?.collected ?? []).map((p) => `${p.x},${p.y}`));
  const summary = [
    strings.robotCell(strings.robotKinds.robot, position.x, position.y),
    strings.robotCell(strings.robotKinds.goal, world.goal.x, world.goal.y),
    ...world.items.map((item) => strings.robotCell(collected.has(`${item.x},${item.y}`) ? strings.robotKinds.collected : strings.robotKinds.item, item.x, item.y)),
    ...world.walls.map((wall) => strings.robotCell(strings.robotKinds.wall, wall.x, wall.y)),
  ].join('. ');

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} accessible accessibilityLabel={`${strings.robotGrid}. ${summary}`}>
      <View style={[styles.grid, { borderColor: theme.border, backgroundColor: theme.backgroundElement }]}>
        {Array.from({ length: world.height }, (_, y) => (
          <View key={y} style={styles.row}>
            {Array.from({ length: world.width }, (_, x) => {
              const key = `${x},${y}`;
              const isRobot = position.x === x && position.y === y;
              const isGoal = world.goal.x === x && world.goal.y === y;
              const isWall = world.walls.some((w) => w.x === x && w.y === y);
              const isItem = world.items.some((w) => w.x === x && w.y === y) && !collected.has(key);
              let icon: IconName | null = null;
              let color: string = theme.text;
              if (isWall) icon = 'block';
              else if (isRobot) {
                icon = 'smart_toy';
                color = theme.primaryText;
              } else if (isItem) {
                icon = 'star';
                color = tones.amber.ink;
              } else if (isGoal) {
                icon = 'flag';
                color = theme.statusOk;
              }
              const background = isWall ? theme.backgroundSelected : isRobot ? theme.primarySoft : visited.has(key) ? theme.statusOkSoft : theme.backgroundElement;
              return (
                <View key={x} style={[styles.cell, { backgroundColor: background, borderColor: theme.border }]}>
                  {icon && <Icon name={icon} size={22} tint={color} />}
                  {isGoal && isRobot && <Icon name="flag" size={12} tint={theme.statusOk} style={styles.corner} />}
                </View>
              );
            })}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  grid: { borderWidth: 1, borderRadius: Radius.small, overflow: 'hidden', alignSelf: 'flex-start', margin: Spacing.half },
  row: { flexDirection: 'row' },
  cell: { width: CELL, height: CELL, alignItems: 'center', justifyContent: 'center', borderWidth: StyleSheet.hairlineWidth },
  corner: { position: 'absolute', top: 2, right: 2 },
});
