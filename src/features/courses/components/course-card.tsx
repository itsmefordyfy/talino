import { router } from 'expo-router';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Radius, Spacing, type Tone } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useLanguage, useLocalized } from '@/hooks/use-strings';

import type { Course } from '../content/types';
import { useBestFor } from '../hooks/use-best-for';
import { browseStrings } from '@/features/discover/browse-strings';

import { factsFor, formatDuration, isNewCourse, type CourseFacts } from '../lib/catalog-facts';
import { categoryLabel } from '../content/catalog/catalog-text';
import { courseTypeLabel, learningLevelLabel } from '../lib/discovery/filters';
import type { CourseProgress } from '../lib/progress';
import { courseHasLanguage, localizedCourse } from '../lib/localization';
import { courseStrings } from '../strings';
import { CourseCover } from './course-cover';

export type CourseCardProps = {
  course: Course;
  progress: CourseProgress | null;
  owned: boolean;
  /**
   * `default`: the catalog card (cover 128). `discovery`: the compact Discover card: title, tagline and one line of facts
   * (level, lessons, time). `tile`: the same on a shorter cover, for a sideways list (give it a width).
   */
  variant?: 'default' | 'discovery' | 'tile';
  /** Why this course is shown ("Because you want to become a software engineer"); discovery cards only. */
  reason?: string | null;
  /** The course's catalog facts, when the caller already has them (looked up by id otherwise). */
  facts?: CourseFacts;
  /** Name the course's category in a brand-coloured pill first (search and All results, which mix categories). */
  showCategory?: boolean;
  style?: StyleProp<ViewStyle>;
};

export const COURSE_TONES: Record<Course['kind'], Tone> = { starter: 'indigo', career: 'violet', mini: 'teal', path: 'sky', standard: 'indigo' };

/** How tall a card's cover is: enough for Tali and the scene to read at a glance, short enough for a long catalog. */
const COVER_HEIGHT = 128;
const DISCOVERY_COVER_HEIGHT = 88;
const TILE_COVER_HEIGHT = 96;

/** A course in the catalog: its cover, what it is, and where the learner stands with it. */
export function CourseCard({ course: englishCourse, progress, owned, variant = 'default', reason, facts, showCategory = false, style }: CourseCardProps) {
  const strings = useLocalized(courseStrings);
  const browse = useLocalized(browseStrings);
  const language = useLanguage();
  // The title, tagline and counts come from the course in the learner's language; an untranslated one stays English and says so.
  const course = localizedCourse(englishCourse, language);
  const notTranslated = !courseHasLanguage(englishCourse.id, language);
  const theme = useTheme();
  const started = !!progress?.started;
  const free = course.kind === 'starter';
  const compact = variant !== 'default';
  const info = compact ? (facts ?? factsFor(course.id)) : undefined;
  const meta = [course.level ? strings.levels[course.level] : null, strings.lessons(course.lessons.length), strings.projects(course.projects.length)].filter(Boolean).join(' · ');
  const compactMeta = info ? [categoryLabel(info.category, language), strings.lessons(info.lessonCount), formatDuration(info.minutes)].join(' · ') : '';
  const typeLabel = info ? courseTypeLabel(info.primaryType, language) : null;
  // The four learning levels (Beginner to Expert), the course's difficulty, not who it suits.
  const levelLabel = info ? learningLevelLabel(info.learningLevel) : null;
  const isNew = !!info && isNewCourse(info);
  // One clear next step: what tapping the card will lead to.
  const action = progress?.complete ? browse.cardReview : started ? browse.cardContinue : !owned && !free ? browse.cardView : browse.cardStart;
  const bestFor = useBestFor(info?.level ?? 'beginner', course.id).text;
  const label = compact
    ? [isNew ? browse.cardNew : null, course.title, course.tagline, typeLabel, levelLabel, bestFor, compactMeta, reason, started && progress ? strings.lessonsDone(progress.lessonsDone, progress.lessonsTotal) : null, action].filter(Boolean).join('. ')
    : [course.title, course.tagline, meta].filter(Boolean).join('. ');
  return (
    <Card padded={false} onPress={() => router.push({ pathname: '/course/[id]', params: { id: course.id } })} accessibilityLabel={label} style={style}>
      <CourseCover course={course} height={variant === 'tile' ? TILE_COVER_HEIGHT : compact ? DISCOVERY_COVER_HEIGHT : COVER_HEIGHT} />
      <View style={styles.body}>
        {/* Only where categories are mixed (search, All): a quiet eyebrow, not a pill, so the title stays the first thing read. */}
        {compact && (isNew || (showCategory && info)) && (
          <ThemedText type="caption" themeColor="primaryText" numberOfLines={1} style={styles.eyebrow}>
            {[isNew ? browse.cardNew : null, showCategory && info ? categoryLabel(info.category, language) : null].filter(Boolean).join(' · ')}
          </ThemedText>
        )}
        <View style={styles.titleRow}>
          <ThemedText type="cardTitle" numberOfLines={2} style={styles.title}>
            {course.title}
          </ThemedText>
        </View>
        <ThemedText type="secondary" themeColor="textSecondary" numberOfLines={2}>
          {course.tagline}
        </ThemedText>
        {/* One line of facts: level, lessons, time. Type, who it suits and the category are on the course page (and read out by screen readers). */}
        <ThemedText type="caption" themeColor="textTertiary" numberOfLines={1} tabular style={styles.meta}>
          {compact && info ? [levelLabel, strings.lessons(info.lessonCount), formatDuration(info.minutes)].filter(Boolean).join(' · ') : meta}
        </ThemedText>
        {/* Said only when it matters: a course that is still English while the app is in Tagalog. */}
        {language === 'fil' && notTranslated && (
          <View style={styles.pills}>
            <Pill label={strings.notInTagalogBadge} />
          </View>
        )}
        {started && progress && (
          <View style={styles.progress}>
            <ProgressBar fraction={progress.fraction} done={progress.complete} accessibilityLabel={strings.lessonsDone(progress.lessonsDone, progress.lessonsTotal)} />
            {!compact && (
              <ThemedText type="caption" themeColor="textSecondary" tabular>
                {strings.lessonsDone(progress.lessonsDone, progress.lessonsTotal)}
              </ThemedText>
            )}
          </View>
        )}
        {/* The whole card is the button; this line only says where it leads (and, once started, how far along). */}
        {compact && (
          <View style={styles.action} importantForAccessibility="no-hide-descendants" accessibilityElementsHidden>
            <ThemedText type="secondarySemiBold" themeColor="primaryText" numberOfLines={1} style={styles.actionLabel}>
              {action}
            </ThemedText>
            {started && progress && !progress.complete && (
              <ThemedText type="caption" themeColor="textSecondary" tabular numberOfLines={1}>
                {strings.lessonsDone(progress.lessonsDone, progress.lessonsTotal)}
              </ThemedText>
            )}
            <Icon name="arrow_forward" size={16} color="primary" />
          </View>
        )}
      </View>
      {compact && reason && (
        <View style={[styles.reason, { backgroundColor: theme.primarySoft }]}>
          <Icon name="auto_awesome" size={14} color="primary" />
          <ThemedText type="caption" themeColor="primaryText" style={styles.reasonText} numberOfLines={2}>
            {reason}
          </ThemedText>
        </View>
      )}
    </Card>
  );
}

/** A small neutral pill for a note on a card. */
function Pill({ label, tone = 'neutral' }: { label: string; tone?: 'neutral' | 'primary' }) {
  const theme = useTheme();
  return (
    <View style={[styles.pill, { backgroundColor: tone === 'primary' ? theme.primarySoft : theme.backgroundSelected }]}>
      <ThemedText type="caption" themeColor={tone === 'primary' ? 'primaryText' : 'textSecondary'} numberOfLines={1}>
        {label}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    padding: Spacing.three + Spacing.one,
    gap: Spacing.half,
    // Cards in a row all stretch to the tallest one: the body takes the extra height, so the reason strip under it stays flush with the card's bottom edge instead of floating over a blank band.
    flexGrow: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.two,
  },
  title: {
    flex: 1,
  },
  progress: {
    marginTop: Spacing.two,
    gap: Spacing.one,
  },
  eyebrow: {
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: Spacing.half,
  },
  meta: {
    marginTop: Spacing.one,
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  actionLabel: {
    flex: 1,
  },
  pills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.one,
    marginTop: Spacing.one,
  },
  pill: {
    maxWidth: '100%',
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
    borderRadius: Radius.pill,
  },
  // A strip under the card's body, inside its rounded corners (the card has no clipping, so the strip rounds its own).
  reason: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.three + Spacing.one,
    paddingVertical: Spacing.two,
    borderBottomLeftRadius: Radius.card - 1,
    borderBottomRightRadius: Radius.card - 1,
    borderCurve: 'continuous',
  },
  reasonText: {
    flex: 1,
  },
});
