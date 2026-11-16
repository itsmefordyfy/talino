import { StyleSheet, View, Pressable } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { ListRow } from '@/components/ui/list-row';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Radius, Spacing, type ThemeColor } from '@/constants/theme';
import { useLocalized } from '@/hooks/use-strings';
import { useTheme } from '@/hooks/use-theme';
import { useTones } from '@/hooks/use-tones';

import type { Chapter, Mission, World } from '../lib/world';
import type { WorldTheme } from '../lib/world-themes';
import { adventureStrings } from '../strings';
import { WorldHeader } from './world-header';

export type WorldMapProps = {
  world: World;
  theme: WorldTheme;
  /** XP earned in this world. */
  xp: number;
  /** Whether the learner has the course; without it every mission is shown locked and only that is said. */
  owned: boolean;
  /** The review status of a project, when it has been submitted (`passed`, `needs_work`, …). */
  projectStatus?: (projectId: string) => string | undefined;
  onOpenMission: (lessonId: string) => void;
  onOpenProject: (projectId: string) => void;
};

const NODE = 36;
const NODE_CURRENT = 40;
const RAIL = 48;
/** The space between two missions; the rail's line crosses it so the path still reads as one road. */
const ROW_GAP = Spacing.two;
const LINE = 3;

/**
 * The course as a map: a vertical path of chapters and mission nodes ending in the boss challenge.
 * Done missions are mint with a check, the current one is violet with a ring (no pulse), locked ones
 * are muted with a lock and what to finish first. Meaning never rests on color alone: every node
 * also has an icon and a word.
 */
export function WorldMap({ world, theme, xp, owned, projectStatus, onOpenMission, onOpenProject }: WorldMapProps) {
  const strings = useLocalized(adventureStrings);
  return (
    <View style={styles.map}>
      <WorldHeader world={world} theme={theme} xp={xp} />
      {world.chapters.map((chapter) => (
        <ChapterView key={chapter.id} chapter={chapter} owned={owned} started={world.missionsDone > 0} onOpenMission={onOpenMission} />
      ))}
      {world.boss && <BossView boss={world.boss} owned={owned} projectStatus={projectStatus} onOpenProject={onOpenProject} title={strings.boss} />}
    </View>
  );
}

function ChapterView({ chapter, owned, started, onOpenMission }: { chapter: Chapter; owned: boolean; started: boolean; onOpenMission: (lessonId: string) => void }) {
  const strings = useLocalized(adventureStrings);
  return (
    <View style={styles.chapter}>
      <View style={styles.chapterHeader} accessible accessibilityRole="header" accessibilityLabel={`${strings.chapter(chapter.index + 1)}. ${strings.chapterTitle(chapter.title, chapter.index + 1, chapter.part)}. ${strings.chapterProgress(chapter.done, chapter.total)}`}>
        <ThemedText type="caption" themeColor="textSecondary" style={styles.eyebrow}>
          {strings.chapter(chapter.index + 1)}
        </ThemedText>
        <ThemedText type="cardTitle">{strings.chapterTitle(chapter.title, chapter.index + 1, chapter.part)}</ThemedText>
        <View style={styles.chapterProgress}>
          <View style={styles.flex}>
            <ProgressBar fraction={chapter.fraction} done={chapter.state === 'done'} accessibilityLabel={strings.chapterProgress(chapter.done, chapter.total)} />
          </View>
          <ThemedText type="caption" themeColor="textSecondary" tabular>
            {strings.chapterProgress(chapter.done, chapter.total)}
          </ThemedText>
        </View>
      </View>
      <View style={styles.missions}>
        {chapter.missions.map((mission, index) => (
          <MissionRow key={mission.lesson.id} mission={mission} first={index === 0} last={index === chapter.missions.length - 1} owned={owned} started={started} onOpen={onOpenMission} />
        ))}
      </View>
    </View>
  );
}

function MissionRow({ mission, first, last, owned, started, onOpen }: { mission: Mission; first: boolean; last: boolean; owned: boolean; started: boolean; onOpen: (lessonId: string) => void }) {
  const strings = useLocalized(adventureStrings);
  const theme = useTheme();
  const tones = useTones();
  const { lesson, state } = mission;
  // Without the course nothing opens, whatever the progress rows say.
  const visible = owned ? state : 'locked';
  const done = visible === 'done';
  const current = visible === 'current';
  const locked = visible === 'locked';
  const size = current ? NODE_CURRENT + 8 : NODE;
  const nodeBackground = done ? tones.mint.soft : current ? theme.primary : theme.backgroundSelected;
  const lineColor = done ? tones.mint.solid : theme.border;
  const stateLabel = done ? strings.missionDone : current ? strings.missionCurrent : strings.missionLocked;
  const note = locked ? (owned ? (mission.finishFirst ? strings.finishFirst(mission.finishFirst.title) : null) : strings.getCourseFirst) : null;
  const titleColor: ThemeColor = locked ? 'textSecondary' : 'text';
  const content = (
    <>
      <View style={styles.rail}>
        {!first && <View style={[styles.line, styles.lineTop, { backgroundColor: lineColor }]} />}
        {!last && <View style={[styles.line, styles.lineBottom, { backgroundColor: lineColor }]} />}
        <View style={[styles.node, { width: size, height: size, borderRadius: size / 2, backgroundColor: nodeBackground }, current && { borderWidth: 4, borderColor: theme.primarySoft }]}>
          <Icon name={done ? 'check' : current ? 'play_arrow' : 'lock'} size={current ? 22 : 20} tint={done ? tones.mint.ink : current ? theme.onPrimary : theme.textTertiary} filled={current} />
        </View>
      </View>
      <View style={styles.text}>
        <ThemedText type="bodySemiBold" themeColor={titleColor} numberOfLines={2}>
          {lesson.title}
        </ThemedText>
        <ThemedText type="secondary" themeColor="textSecondary" numberOfLines={2}>
          {note ?? `${strings.day(lesson.day)} · ${strings.minutes(lesson.minutes)}`}
        </ThemedText>
      </View>
      <ThemedText type="caption" themeColor={done ? 'statusOk' : current ? 'primaryText' : 'textTertiary'} style={styles.stateLabel}>
        {current ? (started ? strings.missionContinue : strings.missionStart) : stateLabel}
      </ThemedText>
    </>
  );
  const rowStyle = [styles.missionRow, current && { backgroundColor: theme.primarySoft }];
  const label = strings.missionLabel(lesson.day, lesson.title, note ? `${stateLabel}. ${note}` : stateLabel);
  if (locked) {
    return (
      <View accessible accessibilityRole="text" accessibilityLabel={label} accessibilityState={{ disabled: true }} style={rowStyle}>
        {content}
      </View>
    );
  }
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={() => onOpen(lesson.id)} style={({ pressed }) => [rowStyle, pressed && { backgroundColor: theme.backgroundSelected }]}>
      {content}
    </Pressable>
  );
}

function BossView({ boss, owned, projectStatus, onOpenProject, title }: { boss: NonNullable<World['boss']>; owned: boolean; projectStatus?: (projectId: string) => string | undefined; onOpenProject: (projectId: string) => void; title: string }) {
  const strings = useLocalized(adventureStrings);
  const theme = useTheme();
  const tones = useTones();
  const tone = boss.state === 'done' ? tones.mint : boss.state === 'current' ? tones.violet : tones.neutral;
  const headline = boss.state === 'done' ? strings.bossDone : boss.state === 'locked' ? strings.bossLocked : strings.bossIntro;
  return (
    <Card padded={false} style={boss.state === 'current' ? { borderColor: theme.primary, borderWidth: 2 } : undefined}>
      <View style={[styles.bossHeader, { backgroundColor: tone.soft }]} accessible accessibilityRole="header" accessibilityLabel={`${title}. ${headline}. ${strings.bossProgress(boss.passed, boss.projects.length)}`}>
        <View style={[styles.bossIcon, { backgroundColor: theme.backgroundElement }]}>
          <Icon name={boss.state === 'done' ? 'emoji_events' : 'flag'} size={24} tint={tone.ink} filled={boss.state !== 'locked'} />
        </View>
        <View style={styles.flex}>
          <ThemedText type="cardTitle" style={{ color: tone.ink }}>
            {title}
          </ThemedText>
          <ThemedText type="secondary" themeColor="textSecondary">
            {headline}
          </ThemedText>
        </View>
        <ThemedText type="caption" themeColor="textSecondary" tabular>
          {strings.bossProgress(boss.passed, boss.projects.length)}
        </ThemedText>
      </View>
      {boss.projects.map((entry) => {
        const status = projectStatus?.(entry.project.id);
        const subtitle = entry.passed ? strings.projectPassed : status === 'needs_work' ? strings.projectNeedsWork : entry.open ? entry.project.summary : strings.projectOpensAfter(entry.project.unlockAfterDay);
        return (
          <ListRow
            key={entry.project.id}
            title={entry.project.title}
            titleLines={2}
            subtitle={subtitle}
            icon={entry.passed ? 'verified' : entry.open ? 'rocket_launch' : 'lock'}
            tone={entry.passed ? 'mint' : entry.open ? 'violet' : 'neutral'}
            onPress={owned ? () => onOpenProject(entry.project.id) : undefined}
            accessibilityLabel={`${entry.project.title}. ${entry.passed ? strings.projectPassed : entry.open ? strings.projectOpenNow : strings.projectOpensAfter(entry.project.unlockAfterDay)}`}
          />
        );
      })}
    </Card>
  );
}

const styles = StyleSheet.create({
  map: {
    gap: Spacing.four,
  },
  chapter: {
    gap: Spacing.two,
  },
  chapterHeader: {
    gap: Spacing.one,
  },
  chapterProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    marginTop: Spacing.one,
  },
  eyebrow: {
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  flex: {
    flex: 1,
  },
  missionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 64,
    borderRadius: Radius.medium,
    borderCurve: 'continuous',
    // Room on both sides of the node: the current one fills its whole rail, so without a gap it touched the title, and its ring the edge of the highlight.
    gap: Spacing.three,
    paddingLeft: Spacing.two,
    paddingRight: Spacing.two,
  },
  missions: {
    gap: ROW_GAP,
  },
  rail: {
    width: RAIL,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
  },
  line: {
    position: 'absolute',
    width: LINE,
    left: (RAIL - LINE) / 2,
  },
  lineTop: {
    top: -ROW_GAP,
    bottom: '50%',
  },
  lineBottom: {
    top: '50%',
    bottom: -ROW_GAP,
  },
  node: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    flex: 1,
    paddingVertical: Spacing.two,
    paddingRight: Spacing.two,
  },
  stateLabel: {
    textAlign: 'right',
    maxWidth: 80,
  },
  bossHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    padding: Spacing.three,
    borderTopLeftRadius: Radius.card,
    borderTopRightRadius: Radius.card,
  },
  bossIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
