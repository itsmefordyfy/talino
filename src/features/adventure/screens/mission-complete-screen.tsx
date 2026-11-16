import { router, Stack } from 'expo-router';

import { Screen } from '@/components/ui/screen';
import { LoadingState, NotFoundState } from '@/components/ui/state-view';
import { badgeDefinitions, COURSES, findLesson, getCourse, useLearning } from '@/features/courses/data';
import { lessonCompleteLine } from '@/features/companion/lib/messages';
import { selectLearnerName } from '@/features/settings/settings-slice';
import { useLanguage, useLocalized } from '@/hooks/use-strings';
import { useAppSelector } from '@/store/hooks';

import { useGame, useMissionXp } from '../hooks/use-game';
import { badgesEarnedDuring, summaryChanges } from '../lib/summary';
import { nextAfter } from '../lib/world';
import { adventureStrings } from '../strings';
import { CompletionSummary, type SummaryAchievement } from '../components/completion-summary';

/** The summary after a mission: XP and its breakdown, achievements, level reached, concepts, and the next mission. */
export function MissionCompleteScreen({ lessonId }: { lessonId: string }) {
  const strings = useLocalized(adventureStrings);
  const language = useLanguage();
  const learning = useLearning();
  const game = useGame();
  const name = useAppSelector(selectLearnerName);
  const mission = useMissionXp(lessonId);
  const found = findLesson(lessonId);
  if (!found || !getCourse(found.course.id)) return <NotFoundState icon="school" title={strings.notFound} />;
  if (learning.isPending || game.isPending || mission.isPending) return <LoadingState />;

  const { course, lesson } = found;
  const row = learning.lessonRow(lessonId);
  const definitions = new Map(badgeDefinitions(COURSES, language).map((badge) => [badge.id, badge]));
  const unlockedIds = badgesEarnedDuring(learning.badges, row?.completed_at);
  const achievements: SummaryAchievement[] = unlockedIds.flatMap((id) => {
    const badge = definitions.get(id);
    return badge ? [{ id, title: badge.title, description: badge.description, icon: badge.icon, tone: badge.tone }] : [];
  });
  const changes = summaryChanges({ totalXp: game.xp, missionXp: mission.xp.total, newAchievements: unlockedIds, language });
  const world = game.worldFor(course.id);
  const following = world ? nextAfter(world, lessonId) : null;
  const next = following ? { kind: following.kind, title: following.kind === 'mission' ? following.lesson.title : following.project.title } : null;
  const labels = lesson.skills.flatMap((id) => course.skills.find((skill) => skill.id === id)?.label ?? []);

  return (
    <Screen>
      <Stack.Screen options={{ title: '' }} />
      <CompletionSummary
        title={lesson.title}
        message={lessonCompleteLine({ name, lessonTitle: lesson.title, xp: mission.xp.total, perfect: mission.xp.quizBonus > 0, nextTitle: next?.title ?? null, lessonsDone: learning.progressFor(course.id)?.lessonsDone ?? 0, courseLessons: course.lessons.length, courseDone: !!learning.progressFor(course.id)?.complete, language })}
        xp={mission.xp}
        concepts={labels}
        achievements={achievements}
        levelUp={changes.levelUp}
        next={next}
        onNext={
          following
            ? () => {
                if (following.kind === 'mission') router.replace({ pathname: '/lesson/[id]', params: { id: following.lesson.id } });
                else router.replace({ pathname: '/project/[id]', params: { id: following.project.id } });
              }
            : undefined
        }
        onDone={() => router.replace({ pathname: '/course/[id]', params: { id: course.id } })}
      />
    </Screen>
  );
}
