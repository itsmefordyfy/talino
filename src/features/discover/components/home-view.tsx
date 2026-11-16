import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ErrorState } from '@/components/ui/state-view';
import { Icon } from '@/components/ui/icon';
import { IconTile } from '@/components/ui/icon-tile';
import { Tali } from '@/components/brand/tali';
import { Notice } from '@/components/ui/notice';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Section } from '@/components/ui/section';
import { useScreenPadding } from '@/components/ui/screen';
import { SkeletonBlock } from '@/components/ui/skeleton';
import { Spacing } from '@/constants/theme';
import { LevelSuggestionCard, UpdateInterestsButton } from '@/features/onboarding';
import { catalogFacts, categoryLabel, CourseCard, isNewCourse, learningLevelLabel, LEARNING_PATHS, pathText, type CourseFacts, type DiscoverySections, type Recommendation } from '@/features/courses';
import { discoverNewGroundLine } from '@/features/companion/lib/messages';
import { useLanguage, useLocalized } from '@/hooks/use-strings';
import { useAppDispatch } from '@/store/hooks';

import { browseStrings } from '../browse-strings';
import { categorySelected, exploreAllChanged, sortChanged } from '../discover-slice';
import { useCourseOffers } from '../hooks/use-course-offers';
import { useDiscoverySections } from '../hooks/use-discovery-sections';
import { useLearnerSignals } from '../hooks/use-learner-signals';
import { pathSummaries, shortCourses } from '../lib/browse';
import { discoverStrings } from '../strings';
import { AiPathCard } from './ai-path-card';
import { CategoryGrid, LevelTiles, ToolChips } from './browse-blocks';
import { CardCarousel, useTileWidth } from './card-carousel';
import { PathList } from './path-list';
import { PathSteps } from './path-steps';
import { openPaywall } from '@/features/store';

/** Most steps of the learner's path shown on the home; the path screen has them all. */
const PATH_STEPS_SHOWN = 4;
/** Paths listed before "Show all". */
const PATHS_SHOWN = 4;
/** Short courses in their carousel. */
const SHORT_SHOWN = 8;

/**
 * The Discover home (the Courses tab): a "For you" block holding only the personal blocks that have something to show
 * (continue, recommended, your path, interests, improve your skills, your next level, first steps, new ground), then the same
 * catalog for everyone: new courses, browse by level, featured learning paths, AI tools, short courses, browse by category and
 * Explore all. Every block is a way in, never a gate: the whole catalog stays one tap away whatever the learner answered.
 * Home is the guided journey; this is free exploration, so nothing here repeats the journey map.
 */
export function HomeView() {
  const strings = useLocalized(discoverStrings);
  const browseText = useLocalized(browseStrings);
  const language = useLanguage();
  const dispatch = useAppDispatch();
  const home = useDiscoverySections();
  const learner = useLearnerSignals();
  const { offerFor, allAccess } = useCourseOffers();
  const tileWidth = useTileWidth();
  const padding = useScreenPadding('tab');
  // Sideways lists run to the screen's edge (inside the safe area) so the next card peeks in.
  const bleed = Math.min(padding.paddingLeft, padding.paddingRight);
  const facts = catalogFacts();

  if (home.isError) return <ErrorState onRetry={home.refetch} />;
  if (home.isPending) {
    return (
      <View style={styles.stack}>
        <SkeletonBlock height={72} />
        <SkeletonBlock height={220} />
        <SkeletonBlock height={220} />
      </View>
    );
  }

  const { sections } = home;
  const tile = (course: CourseFacts, reason: string | null = null) => {
    const offer = offerFor(course.id);
    return <CourseCard key={course.id} variant="tile" course={course.course} facts={course} progress={offer.progress} owned={offer.owned} reason={reason} style={{ width: tileWidth }} />;
  };
  const recommendationTile = (entry: Recommendation) => tile(entry.facts, home.reasonOf(entry));
  const browse = (sort: 'recommended' | 'newest' | 'shortest') => {
    dispatch(sortChanged(sort));
    dispatch(exploreAllChanged(true));
  };
  const discoverNew = sections.discoverNew ?? [];
  const hasBand = !!(sections.continueLearning || sections.recommended || sections.yourPath || sections.exploreInterests || sections.improveSkills || sections.nextLevel || home.startHere.length > 0 || discoverNew.length > 0);
  // The catalog part is the same for everyone: published after launch (new), and short courses straight from the catalog.
  const newCourses = facts.filter((fact) => isNewCourse(fact)).sort((a, b) => (a.published < b.published ? 1 : a.published > b.published ? -1 : 0));
  const short = shortCourses(facts).slice(0, SHORT_SHOWN);
  const nextLevelLabel = sections.nextLevel ? learningLevelLabel(sections.nextLevel.level) : '';

  return (
    <View style={styles.stack}>
      {!home.personalized && (
        <Card onPress={() => router.push('/learning-profile')} accessibilityLabel={`${strings.personalizeTitle}. ${strings.personalizeBody}`}>
          <View style={styles.personalize}>
            <View style={styles.flex}>
              <ThemedText type="cardTitle">{strings.personalizeTitle}</ThemedText>
              <ThemedText type="secondary" themeColor="textSecondary">
                {strings.personalizeBody}
              </ThemedText>
            </View>
            <Icon name="chevron_right" size={20} color="textTertiary" />
          </View>
          <Button title={strings.personalizeCta} icon="tune" variant="secondary" size="small" onPress={() => router.push('/learning-profile')} style={styles.personalizeButton} />
        </Card>
      )}

      {/* Only appears with real evidence (completed courses with good quiz results, or a skill check); never a gate, and it can be dismissed. */}
      <LevelSuggestionCard />

      {hasBand && (
        <ForYouBand>
          {sections.continueLearning && (
            <Section title={strings.continueTitle}>
              <CardCarousel tileWidth={tileWidth} bleed={bleed} accessibilityLabel={strings.continueTitle}>
                {sections.continueLearning.slice(0, 6).map((item) => tile(item.facts))}
              </CardCarousel>
            </Section>
          )}
          {sections.recommended && (
            <Section title={strings.recommendedTitle} actionLabel={sections.recommended.length > 1 ? strings.seeAll : undefined} onAction={() => browse('recommended')}>
              <CardCarousel tileWidth={tileWidth} bleed={bleed} accessibilityLabel={strings.recommendedTitle}>
                {sections.recommended.map(recommendationTile)}
              </CardCarousel>
            </Section>
          )}
          {sections.yourPath && <YourPathCard plan={sections.yourPath} />}
          {sections.exploreInterests && (
            <Section title={browseText.interestsTitle}>
              <CardCarousel tileWidth={tileWidth} bleed={bleed} accessibilityLabel={browseText.interestsTitle}>
                {sections.exploreInterests.map(recommendationTile)}
              </CardCarousel>
            </Section>
          )}
          {sections.improveSkills && (
            <Section title={browseText.improveTitle}>
              <ThemedText type="secondary" themeColor="textSecondary">
                {browseText.improveBody}
              </ThemedText>
              <CardCarousel tileWidth={tileWidth} bleed={bleed} accessibilityLabel={browseText.improveTitle}>
                {sections.improveSkills.map((entry) => tile(entry.facts, browseText.improveReason(categoryLabel(entry.facts.category, language), Math.round(entry.quizAverage * 100))))}
              </CardCarousel>
            </Section>
          )}
          {sections.nextLevel && (
            <Section title={browseText.nextLevelTitle(nextLevelLabel)}>
              <ThemedText type="secondary" themeColor="textSecondary">
                {browseText.nextLevelBody(nextLevelLabel)}
              </ThemedText>
              <CardCarousel tileWidth={tileWidth} bleed={bleed} accessibilityLabel={browseText.nextLevelTitle(nextLevelLabel)}>
                {sections.nextLevel.courses.map(recommendationTile)}
              </CardCarousel>
            </Section>
          )}
          {home.startHere.length > 0 && (
            <Section title={strings.startHereTitle}>
              <CardCarousel tileWidth={tileWidth} bleed={bleed} accessibilityLabel={strings.startHereTitle}>
                {home.startHere.map((course) => tile(course))}
              </CardCarousel>
            </Section>
          )}
          {discoverNew.length > 0 && (
            <Section title={strings.newGroundTitle}>
              <ThemedText type="secondary" themeColor="textSecondary">
                {discoverNewGroundLine({ categories: discoverNew.length, language }).text}
              </ThemedText>
              {discoverNew.map((group) => (
                <View key={group.category} style={styles.group}>
                  <View style={styles.groupHeader}>
                    <ThemedText type="cardTitle" accessibilityRole="header" style={styles.flex}>
                      {categoryLabel(group.category, language)}
                    </ThemedText>
                    {/* Nothing more to see in a category with one course here. */}
                    {group.courses.length > 1 && <Button title={strings.seeAll} variant="ghost" size="small" accessibilityLabel={strings.seeAllIn(categoryLabel(group.category, language))} onPress={() => dispatch(categorySelected(group.category))} />}
                  </View>
                  <CardCarousel tileWidth={tileWidth} bleed={bleed} accessibilityLabel={categoryLabel(group.category, language)}>
                    {group.courses.map((entry) => tile(entry.facts, strings.newGroundReason(categoryLabel(group.category, language))))}
                  </CardCarousel>
                </View>
              ))}
            </Section>
          )}
        </ForYouBand>
      )}

      {newCourses.length > 0 && (
        <Section title={browseText.newTitle} actionLabel={newCourses.length > 1 ? strings.seeAll : undefined} onAction={() => browse('newest')}>
          <CardCarousel tileWidth={tileWidth} bleed={bleed} accessibilityLabel={browseText.newTitle}>
            {newCourses.slice(0, 8).map((course) => tile(course))}
          </CardCarousel>
        </Section>
      )}

      <Section title={browseText.levelsTitle}>
        <ThemedText type="secondary" themeColor="textSecondary">
          {browseText.levelsBody}
        </ThemedText>
        <LevelTiles facts={facts} />
      </Section>

      <Section title={browseText.pathsTitle}>
        <ThemedText type="secondary" themeColor="textSecondary">
          {browseText.pathsBody}
        </ThemedText>
        <PathList summaries={pathSummaries(LEARNING_PATHS, facts, learner.signals.completed)} initial={PATHS_SHOWN} />
      </Section>

      <Section title={browseText.toolsTitle}>
        <ThemedText type="secondary" themeColor="textSecondary">
          {browseText.toolsBody}
        </ThemedText>
        <ToolChips facts={facts} />
      </Section>

      <AiPathCard />

      {short.length > 0 && (
        <Section title={browseText.shortTitle} actionLabel={strings.seeAll} onAction={() => browse('shortest')}>
          <ThemedText type="secondary" themeColor="textSecondary">
            {browseText.shortBody}
          </ThemedText>
          <CardCarousel tileWidth={tileWidth} bleed={bleed} accessibilityLabel={browseText.shortTitle}>
            {short.map((course) => tile(course))}
          </CardCarousel>
        </Section>
      )}

      <Section title={browseText.categoriesTitle}>
        <CategoryGrid facts={facts} />
      </Section>

      <View style={styles.exploreAll}>
        <Button title={strings.exploreAll} icon="explore" variant="outline" onPress={() => dispatch(exploreAllChanged(true))} />
        <ThemedText type="caption" themeColor="textSecondary" style={styles.centered}>
          {strings.exploreAllNote(facts.length)}
        </ThemedText>
      </View>

      <Section title={strings.moreTitle}>
        {allAccess ? (
          <Notice tone="success" message={strings.haveAllAccess} />
        ) : (
          <Card>
            <ThemedText type="cardTitle">{strings.allAccessTitle}</ThemedText>
            <ThemedText type="secondary" themeColor="textSecondary" style={styles.allAccessBody}>
              {strings.allAccessBody}
            </ThemedText>
            <Button title={strings.allAccessCta} variant="secondary" size="small" onPress={() => void openPaywall('courses')} />
          </Card>
        )}
        <Card onPress={() => router.push('/concept-lab')} accessibilityLabel={strings.labTitle}>
          <View style={styles.lab}>
            <IconTile icon="science" tone="indigo" />
            <View style={styles.flex}>
              <ThemedText type="cardTitle">{strings.labTitle}</ThemedText>
              <ThemedText type="secondary" themeColor="textSecondary">
                {strings.labBody}
              </ThemedText>
            </View>
          </View>
        </Card>
      </Section>
    </View>
  );
}

/**
 * The learner's own picks, set apart from the neutral catalog below by Tali's "For you" header and the reason lines, on the
 * plain screen background (owner's call: no tinted band or card behind it).
 */
function ForYouBand({ children }: { children: ReactNode }) {
  const strings = useLocalized(discoverStrings);
  return (
    <View style={styles.band}>
      <View style={styles.bandTop}>
        {/* Only the words are one accessible header; the button below stays its own control. */}
        <View style={styles.bandHeader} accessible accessibilityRole="header" accessibilityLabel={`${strings.forYou}. ${strings.forYouNote}`}>
          {/* Tali introduces the picks: the one place on Discover the coach appears, so it stays meaningful. */}
          <Tali size={52} mood="happy" tight />
          <View style={styles.flex}>
            <ThemedText type="section">{strings.forYou}</ThemedText>
            <ThemedText type="secondary" themeColor="textSecondary">
              {strings.forYouNote}
            </ThemedText>
          </View>
        </View>
        <UpdateInterestsButton />
      </View>
      {children}
    </View>
  );
}

/** The learning path that suits the learner best, with how far they are and the next course. */
function YourPathCard({ plan }: { plan: NonNullable<DiscoverySections['yourPath']> }) {
  const strings = useLocalized(discoverStrings);
  const pathTitle = pathText(plan.path, useLanguage()).title;
  return (
    <Section title={strings.pathTitle}>
      <Card onPress={() => router.push({ pathname: '/path/[id]', params: { id: plan.path.id } })} accessibilityLabel={`${pathTitle}. ${strings.pathProgress(plan.done, plan.total)}`}>
        <View style={styles.pathHeader}>
          <ThemedText type="cardTitle" style={styles.flex} numberOfLines={2}>
            {pathTitle}
          </ThemedText>
          <Icon name="chevron_right" size={20} color="textTertiary" />
        </View>
        <View style={styles.pathProgress}>
          <ProgressBar fraction={plan.total === 0 ? 0 : plan.done / plan.total} done={plan.done === plan.total} accessibilityLabel={strings.pathProgress(plan.done, plan.total)} />
          <ThemedText type="caption" themeColor="textSecondary" tabular>
            {strings.pathProgress(plan.done, plan.total)}
            {plan.nextStep ? ` · ${strings.pathNext(plan.nextStep.facts.course.title)}` : ''}
          </ThemedText>
        </View>
        <PathSteps steps={plan.steps} limit={PATH_STEPS_SHOWN} />
        <Button title={strings.pathOpen} variant="secondary" size="small" onPress={() => router.push({ pathname: '/path/[id]', params: { id: plan.path.id } })} style={styles.pathButton} />
      </Card>
    </Section>
  );
}

const styles = StyleSheet.create({
  stack: {
    gap: Spacing.four,
  },
  flex: {
    flex: 1,
  },
  personalize: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  personalizeButton: {
    alignSelf: 'flex-start',
    marginTop: Spacing.three,
  },
  band: {
    gap: Spacing.four,
  },
  bandTop: {
    gap: Spacing.one,
  },
  bandHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  group: {
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  pathHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  pathProgress: {
    gap: Spacing.one,
    marginVertical: Spacing.three,
  },
  pathButton: {
    alignSelf: 'flex-start',
    marginTop: Spacing.two,
  },
  exploreAll: {
    gap: Spacing.two,
  },
  allAccessBody: {
    marginTop: Spacing.one,
    marginBottom: Spacing.three,
  },
  lab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  centered: {
    textAlign: 'center',
  },
});
