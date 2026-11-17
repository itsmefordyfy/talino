import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { Tali } from '@/components/brand/tali';
import { ProfileAvatar } from '@/components/profile-avatar';
import { SettingsButton } from '@/components/settings-button';
import { TabHeader } from '@/components/tab-header';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Icon } from '@/components/ui/icon';
import { ListRow } from '@/components/ui/list-row';
import { ProgressBar } from '@/components/ui/progress-bar';
import { TwoColumns } from '@/components/two-columns';
import { Screen } from '@/components/ui/screen';
import { Section } from '@/components/ui/section';
import { ErrorState } from '@/components/ui/state-view';
import { TabSkeleton } from '@/components/tab-skeleton';
import { Radius, Spacing } from '@/constants/theme';
import { useDbQuery } from '@/db/use-db-query';
import { useGame, XpCard } from '@/features/adventure';
import { JOURNEY_CERTIFICATE_ID, JOURNEY_CERTIFICATE_TITLE, readCertificates } from '@/features/certificates';
import { badgeDefinitions, CAREER_COURSES, COURSES, courseStrings, getCourse, localizedCourse, ProgressRing, useLearning } from '@/features/courses';
import { useLearningPlan } from '@/features/onboarding';
import { profileCompleteness, profileStrings, useProfilePhoto, useResumeProfile } from '@/features/resume';
import { selectGoal, selectLearnerName } from '@/features/settings/settings-slice';
import { lessonsThisWeek, WeekCard } from '@/features/today';
import { useLanguage, useLocalized } from '@/hooks/use-strings';
import { useTabWarmup } from '@/hooks/use-tab-warmup';
import { useViewportSettling } from '@/hooks/use-viewport-settling';
import { useTheme } from '@/hooks/use-theme';
import { useTones } from '@/hooks/use-tones';
import { formatDate, todayISO } from '@/lib/dates';
import { useAppSelector } from '@/store/hooks';

import { meExtraStrings } from '../me-extra-strings';
import { meStrings } from '../strings';

/** Me: who I am in Talino, my courses' progress, badges, certificates, and the extras. */
export function MeTab() {
  const strings = useLocalized(meStrings);
  const extra = useLocalized(meExtraStrings);
  const profileText = useLocalized(profileStrings);
  const profile = useResumeProfile();
  const photo = useProfilePhoto();
  const language = useLanguage();
  const courseText = useLocalized(courseStrings);
  const theme = useTheme();
  const tones = useTones();
  const name = useAppSelector(selectLearnerName);
  const goal = useAppSelector(selectGoal);
  const learning = useLearning();
  const { plan } = useLearningPlan();
  const settling = useViewportSettling();
  const warming = useTabWarmup();
  const game = useGame();
  const certificates = useDbQuery(['certificates'], readCertificates);
  const journeyCertificate = certificates.data?.find((row) => row.course_id === JOURNEY_CERTIFICATE_ID) ?? null;
  const definitions = badgeDefinitions(COURSES, language);
  const earned = new Set(learning.badges.map((badge) => badge.badge_id));
  // The ones earned come first, so the grid shows what you have done before what is left.
  const orderedBadges = [...definitions.filter((badge) => earned.has(badge.id)), ...definitions.filter((badge) => !earned.has(badge.id))];
  const lessons = learning.progress.reduce((sum, entry) => sum + entry.lessonsDone, 0);
  // Courses in progress first, finished ones after.
  const started = learning.progress.filter((entry) => entry.started).sort((a, b) => Number(a.fraction >= 1) - Number(b.fraction >= 1));
  const masterReady = CAREER_COURSES.every((course) => learning.progressFor(course.id)?.complete);

  const header = <TabHeader title={strings.title} accessory={<SettingsButton />} />;
  const completeness = profileCompleteness({
    name,
    headline: profile.data?.headline ?? '',
    summary: profile.data?.summary ?? '',
    email: profile.data?.email ?? '',
    location: profile.data?.location ?? '',
    website: profile.data?.website ?? '',
    linkedin: profile.data?.linkedin ?? '',
    github: profile.data?.github ?? '',
  });
  const tagline = profile.data?.headline?.trim() || (goal ? strings.goals[goal] : '');
  if (learning.isError) {
    return (
      <Screen variant="tab">
        {header}
        <ErrorState onRetry={() => void learning.refetch()} />
      </Screen>
    );
  }
  if (learning.isPending || settling || warming) return <TabSkeleton variant="me" />;

  const stats = [
    { label: strings.stats.streak, value: learning.streak.current, icon: 'local_fire_department' as const },
    { label: strings.stats.lessons, value: lessons, icon: 'menu_book' as const },
    { label: strings.stats.badges, value: earned.size, icon: 'military_tech' as const },
    { label: strings.stats.certificates, value: certificates.data?.length ?? 0, icon: 'workspace_premium' as const },
  ];

  return (
    <Screen variant="tab" wide>
      {header}
      <TwoColumns
        primary={
          <>
            <Card style={styles.hero}>
              <View style={styles.who}>
                <ProfileAvatar name={name} photo={photo.data ?? null} size={64} />
                <View style={styles.whoText}>
                  <ThemedText type="section" numberOfLines={1}>
                    {name || strings.noName}
                  </ThemedText>
                  {tagline !== '' && (
                    <ThemedText type="secondary" themeColor="textSecondary" numberOfLines={2}>
                      {tagline}
                    </ThemedText>
                  )}
                </View>
              </View>
              <ProgressBar fraction={completeness.percent / 100} accessibilityLabel={profileText.complete(completeness.percent)} done={completeness.percent === 100} />
              <ThemedText type="secondary" themeColor="textSecondary">
                {completeness.missing[0] ? `${profileText.complete(completeness.percent)}. ${profileText.next(profileText.missing[completeness.missing[0]])}` : profileText.allDone}
              </ThemedText>
              <Button title={extra.editProfile} icon="edit" variant="secondary" size="small" onPress={() => router.push('/resume/profile')} />
            </Card>

            {/* The daily streak and the week at a glance, as Today had them (owner, 2026-11-17). */}
            <WeekCard
              days={learning.data?.days ?? []}
              streak={learning.streak.current}
              best={learning.streak.best}
              doneToday={learning.streak.doneToday}
              lessonsDone={lessonsThisWeek(learning.data?.lessons ?? [], todayISO())}
              target={plan?.schedule.lessonsPerWeek ?? 5}
            />

            {!game.isPending && <XpCard xp={game.xp} levelTitle={game.levelTitle} progress={game.progressToNext} />}

            <View style={styles.stats}>
              {stats.map((stat) => (
                <View key={stat.label} style={[styles.stat, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]} accessible accessibilityLabel={`${stat.value} ${stat.label}`}>
                  <Icon name={stat.icon} size={20} color="primaryText" />
                  <ThemedText type="statSmall" tabular>
                    {stat.value}
                  </ThemedText>
                  <ThemedText type="caption" themeColor="textSecondary" numberOfLines={1}>
                    {stat.label}
                  </ThemedText>
                </View>
              ))}
            </View>
            <Section title={strings.certificatesTitle}>
              {(certificates.data?.length ?? 0) === 0 && !masterReady ? (
                <ThemedText type="secondary" themeColor="textSecondary">
                  {strings.noCertificates}
                </ThemedText>
              ) : (
                <Card padded={false}>
                  {/* Talino's highest certificate comes first. */}
                  {journeyCertificate && (
                    <ListRow
                      title={JOURNEY_CERTIFICATE_TITLE}
                      subtitle={formatDate(journeyCertificate.issued_at.slice(0, 10))}
                      icon="workspace_premium"
                      tone="amber"
                      onPress={() => router.push({ pathname: '/certificate/[courseId]', params: { courseId: JOURNEY_CERTIFICATE_ID } })}
                    />
                  )}
                  {masterReady && <ListRow title={strings.masterReady} icon="emoji_events" tone="amber" onPress={() => router.push({ pathname: '/certificate/[courseId]', params: { courseId: 'master' } })} />}
                  {(certificates.data ?? [])
                    .filter((row) => row.course_id !== 'master' && row.course_id !== JOURNEY_CERTIFICATE_ID)
                    .map((row) => (
                      <ListRow
                        key={row.id}
                        title={localizedCourse(getCourse(row.course_id), language)?.title ?? row.course_id}
                        subtitle={formatDate(row.issued_at.slice(0, 10))}
                        icon={row.verify_id ? 'verified' : 'workspace_premium'}
                        tone="violet"
                        onPress={() => router.push({ pathname: '/certificate/[courseId]', params: { courseId: row.course_id } })}
                      />
                    ))}
                </Card>
              )}
            </Section>
          </>
        }
        secondary={
          <>
            <Section title={strings.progressTitle}>
              {started.length === 0 ? (
                <Card>
                  <EmptyState illustration={<Tali size={128} mood="learning" tight />} title={strings.noCourses} action={<Button title={strings.startStarter} onPress={() => router.push({ pathname: '/course/[id]', params: { id: 'starter' } })} />} />
                </Card>
              ) : (
                <Card padded={false}>
                  {started.map((entry) => {
                    const course = localizedCourse(getCourse(entry.courseId), language);
                    if (!course) return null;
                    return (
                      <ListRow
                        key={entry.courseId}
                        title={course.title}
                        subtitle={`${courseText.lessonsDone(entry.lessonsDone, entry.lessonsTotal)} · ${entry.projectsPassed}/${courseText.projects(entry.projectsTotal)}`}
                        leading={<ProgressRing fraction={entry.fraction} size={44} stroke={5} accessibilityLabel={`${Math.round(entry.fraction * 100)}%`} />}
                        onPress={() => router.push({ pathname: '/course/[id]', params: { id: course.id } })}
                      />
                    );
                  })}
                </Card>
              )}
            </Section>

            <Section title={strings.badgesTitle} actionLabel={strings.seeAllBadges} onAction={() => router.push('/badges')}>
              <ThemedText type="caption" themeColor="textSecondary">
                {extra.earnedOf(earned.size, definitions.length)}
              </ThemedText>
              <View style={styles.badges}>
                {orderedBadges.slice(0, 8).map((badge) => {
                  const has = earned.has(badge.id);
                  return (
                    <Pressable
                      key={badge.id}
                      accessibilityRole="button"
                      accessibilityLabel={`${badge.title}. ${has ? '' : strings.locked}`}
                      onPress={() => router.push({ pathname: '/badge/[id]', params: { id: badge.id } })}
                      style={({ pressed }) => [styles.badge, pressed && styles.badgePressed]}>
                      <View style={[styles.badgeCircle, { backgroundColor: has ? tones[badge.tone].soft : theme.backgroundSelected }]}>
                        <Icon name={badge.icon} size={24} tint={has ? tones[badge.tone].ink : theme.textTertiary} filled={has} />
                      </View>
                      <ThemedText type="caption" themeColor={has ? 'text' : 'textTertiary'} numberOfLines={2} style={styles.badgeLabel}>
                        {badge.title}
                      </ThemedText>
                    </Pressable>
                  );
                })}
              </View>
            </Section>
          </>
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    gap: Spacing.three,
  },
  who: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  whoText: {
    flex: 1,
    gap: Spacing.half,
  },
  stats: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
    gap: Spacing.half,
    paddingVertical: Spacing.three,
    borderRadius: Radius.large,
    borderCurve: 'continuous',
    borderWidth: StyleSheet.hairlineWidth,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: Spacing.three,
  },
  badge: {
    width: '25%',
    alignItems: 'center',
    gap: Spacing.one,
    paddingHorizontal: Spacing.one,
  },
  badgeCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgePressed: {
    opacity: 0.6,
  },
  badgeLabel: {
    textAlign: 'center',
  },
});
