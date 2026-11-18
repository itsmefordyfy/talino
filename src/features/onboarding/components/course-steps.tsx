import * as WebBrowser from 'expo-web-browser';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Tali } from '@/components/brand/tali';
import { OfflineNotice } from '@/components/offline-notice';
import { ThemedText } from '@/components/themed-text';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Icon, type IconName } from '@/components/ui/icon';
import { Notice } from '@/components/ui/notice';
import { Screen } from '@/components/ui/screen';
import { SkeletonBlock } from '@/components/ui/skeleton';
import { MinTouchSize, Radius, Spacing } from '@/constants/theme';
import { getCourse } from '@/features/courses/content';
import { localizedCourse } from '@/features/courses/lib/localization';
import { LEGAL, PlanPicker, ProFeatureList, storeStrings, useSubscribe, type CustomerInfo, type SubscribeMessage } from '@/features/store';
import { useLanguage, useLocalized } from '@/hooks/use-strings';
import { useTheme } from '@/hooks/use-theme';
import { tapFeedback } from '@/lib/haptics';
import { celebratePro } from '@/lib/pro-celebration';

import { onboardingCourseStrings } from '../course-strings';
import type { CourseChoice } from '../lib/course-choices';

/** A course's own words, in the learner's language when it has them. */
function useCourse(id: string) {
  const language = useLanguage();
  const course = getCourse(id);
  return course ? localizedCourse(course, language) : null;
}

export type CourseStepProps = {
  choices: readonly CourseChoice[];
  value: string | null;
  onChange: (id: string) => void;
};

/** "What do you want to learn?": the courses that match the answers so far, the best one marked, the free one always there. */
export function CourseStep({ choices, value, onChange }: CourseStepProps) {
  return (
    <View style={styles.stack} accessibilityRole="radiogroup">
      {choices.map((choice) => (
        <CoursePickCard key={choice.id} choice={choice} selected={value === choice.id} onPress={() => onChange(choice.id)} />
      ))}
    </View>
  );
}

function CoursePickCard({ choice, selected, onPress }: { choice: CourseChoice; selected: boolean; onPress: () => void }) {
  const strings = useLocalized(onboardingCourseStrings);
  const theme = useTheme();
  const course = useCourse(choice.id);
  if (!course) return null;
  const meta = [strings.lessons(course.lessons.length), strings.projects(course.projects.length)].join(' · ');
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected, checked: selected }}
      accessibilityLabel={[choice.recommended ? strings.recommended : null, course.title, course.tagline, meta].filter(Boolean).join('. ')}
      onPress={() => {
        tapFeedback();
        onPress();
      }}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: selected ? theme.primarySoft : theme.backgroundElement, borderColor: selected ? theme.primary : theme.border, borderWidth: selected ? 2 : 1 },
        pressed && styles.pressed,
      ]}>
      <View style={[styles.tile, { backgroundColor: selected ? theme.primary : theme.backgroundSelected }]}>
        <Icon name={course.icon as IconName} size={22} tint={selected ? theme.onPrimary : theme.textSecondary} />
      </View>
      <View style={styles.text}>
        {choice.recommended && <Badge label={strings.recommended} color="primaryText" background="primarySoft" />}
        <ThemedText type="cardTitle">{course.title}</ThemedText>
        <ThemedText type="secondary" themeColor="textSecondary">
          {course.tagline}
        </ThemedText>
        <ThemedText type="caption" themeColor="textTertiary">
          {meta}
        </ThemedText>
      </View>
      <View style={[styles.mark, { borderColor: selected ? theme.primary : theme.textTertiary, backgroundColor: selected ? theme.primary : 'transparent' }]}>
        {selected && <Icon name="check" size={16} tint={theme.onPrimary} />}
      </View>
    </Pressable>
  );
}

/** "Great choice: <course>": the pick confirmed (the heading is the flow's; this is the line under it). */
export function ChoiceBody({ courseId }: { courseId: string }) {
  const strings = useLocalized(onboardingCourseStrings);
  const course = useCourse(courseId);
  if (!course) return null;
  return (
    <View style={styles.stack}>
      <ThemedText type="body" themeColor="textSecondary" style={styles.center}>
        {course.tagline}
      </ThemedText>
      <ThemedText type="body" themeColor="textSecondary" style={styles.center}>
        {course.kind === 'starter' ? strings.choiceFree : strings.choicePro}
      </ThemedText>
    </View>
  );
}

/** The "Great choice: <course>" heading. */
export function ChoiceTitle({ courseId }: { courseId: string }) {
  const strings = useLocalized(onboardingCourseStrings);
  const course = useCourse(courseId);
  return (
    <ThemedText type="title" style={styles.center} accessibilityRole="header">
      {strings.choiceTitle(course?.title ?? '')}
    </ThemedText>
  );
}

export type PaywallStepProps = {
  courseId: string;
  /** The flow's top row (Back, step count, progress), so the step keeps the same header as every other. */
  header: ReactNode;
  /** The purchase went through, or the learner chose to go on without it. */
  onDone: () => void;
};

/**
 * Shown only when the learner picked a paid course they don't own: Talino Pro's plans and benefits, one Continue to subscribe, and a
 * Skip in the header that goes on with the free course. There is no free trial (Talino has none), so nothing here promises one.
 */
export function PaywallStep({ courseId, header, onDone }: PaywallStepProps) {
  const strings = useLocalized(storeStrings);
  const extra = useLocalized(onboardingCourseStrings);
  const course = useCourse(courseId);
  const sub = useSubscribe({
    onPurchased: (info: CustomerInfo) => {
      if (info.allAccess) celebratePro();
      onDone();
    },
  });
  const { items, online, plans, selected, unavailable, busy, message } = sub;

  const footer = (
    <View style={styles.footer}>
      {selected && !sub.access.allAccess && (
        <>
          <Button title={strings.continue} loading={sub.purchase.isPending} disabled={sub.restore.isPending} onPress={() => void sub.subscribe()} />
          <ThemedText type="caption" themeColor="textTertiary" style={styles.center}>
            {strings.renewal(selected.priceString, strings.periods[selected.kind])}
          </ThemedText>
        </>
      )}
      {/* With plans on offer, leaving without buying is Skip in the header; with none (already subscribed, or no store) this is the way on. */}
      {(!selected || sub.access.allAccess) && <Button title={extra.keepGoing} disabled={busy} onPress={onDone} />}
      {/* Terms and Privacy on one small line, so the pinned part stays short and the plans stay in view. */}
      <View style={styles.legal}>
        <FooterLink label={strings.terms} onPress={() => void WebBrowser.openBrowserAsync(LEGAL.terms)} />
        <FooterLink label={strings.privacy} onPress={() => void WebBrowser.openBrowserAsync(LEGAL.privacy)} />
      </View>
    </View>
  );

  return (
    <Screen variant="root" footer={footer}>
      {header}
      <View style={styles.mascot}>
        <Tali size={104} tight mood="confident" />
      </View>
      <View style={styles.stack}>
        <ThemedText type="title" style={styles.center} accessibilityRole="header">
          {extra.unlockTitle(course?.title ?? '')}
        </ThemedText>
        <ThemedText type="body" themeColor="textSecondary" style={styles.center}>
          {extra.unlockBody}
        </ThemedText>
      </View>
      {message && <PaywallMessage message={message} />}
      {sub.access.allAccess ? (
        <Notice tone="success" message={strings.subscribed} />
      ) : items.isPending && !online ? (
        <OfflineNotice feature={strings.priceList} meanwhile={strings.priceListMeanwhile} />
      ) : items.isPending ? (
        <View style={styles.stack}>
          <SkeletonBlock height={72} />
          <SkeletonBlock height={72} />
        </View>
      ) : unavailable ? (
        <Notice tone="info" message={strings.unavailableBody} />
      ) : items.isError || plans.length === 0 ? (
        <Notice tone="warning" message={strings.loadError} />
      ) : (
        <PlanPicker items={plans} selectedId={selected?.productId ?? null} onSelect={sub.select} showEquivalent />
      )}
      <ProFeatureList lead="courses" limit={4} />
    </Screen>
  );
}

function FooterLink({ label, onPress, disabled = false }: { label: string; onPress: () => void; disabled?: boolean }) {
  return (
    <Pressable accessibilityRole="button" hitSlop={10} disabled={disabled} onPress={onPress}>
      <ThemedText type="caption" themeColor="textSecondary" style={styles.link}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

function PaywallMessage({ message }: { message: SubscribeMessage }) {
  return <Notice tone={message.tone} message={message.text} />;
}

const styles = StyleSheet.create({
  stack: {
    gap: Spacing.two,
  },
  center: {
    textAlign: 'center',
  },
  mascot: {
    alignItems: 'center',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    minHeight: MinTouchSize + Spacing.three,
    paddingVertical: Spacing.three - 2,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.large,
    borderCurve: 'continuous',
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
  tile: {
    width: 40,
    height: 40,
    borderRadius: Radius.chip,
    borderCurve: 'continuous',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    flex: 1,
    gap: 2,
  },
  mark: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    gap: Spacing.one,
  },
  legal: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: Spacing.three,
    paddingVertical: Spacing.one,
  },
  link: {
    textDecorationLine: 'underline',
  },
});
