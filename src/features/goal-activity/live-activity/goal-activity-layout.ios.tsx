import { HStack, Image, ProgressView, Spacer, Text, VStack } from '@expo/ui/swift-ui';
import {
  activityBackgroundTint,
  aspectRatio,
  font,
  foregroundStyle,
  frame,
  kerning,
  lineLimit,
  minimumScaleFactor,
  monospacedDigit,
  padding,
  progressViewStyle,
  resizable,
  textCase,
  tint,
} from '@expo/ui/swift-ui/modifiers';
import type { LiveActivityEnvironment, LiveActivityLayout } from 'expo-widgets';

import type { GoalActivityProps } from '../lib/goal-state';

/**
 * The daily goal's Live Activity (Lock Screen banner and Dynamic Island): the title, the minutes to go, a line that follows the progress, a
 * slim bar with "3 of 5 min", and the coach on the right (Tali or Tala, as the learner chose). The words are Talino's own
 * (`goal-state.ts`). It only shows; the app keeps the numbers (`goal-activity.ios.ts`). A tap opens Talino (the activity's link).
 *
 * A `'widget'` function runs in the widget's own process: only Expo UI's SwiftUI views and modifiers, its props and its environment, so
 * helpers live inside it, the words arrive in props and the colors are literals (the dark card `primarySoft`, `primaryText` and white ink
 * of `constants/theme.ts`: the card is dark in both modes, as the reference's). No array destructuring (Babel would compile it to a helper
 * that process doesn't have).
 */
export const GoalActivityLayout = (props: GoalActivityProps, _environment: LiveActivityEnvironment): LiveActivityLayout => {
  'widget';
  const card = '#2B2850';
  const ink = '#FFFFFF';
  const muted = 'rgba(255,255,255,0.7)';
  const accent = '#9F8AFF';

  // The coach's picture when it could be copied into the shared folder, an icon when not (an older build, no App Group).
  const coach = (size: number) =>
    props.image ? (
      <Image uiImage={props.image} modifiers={[resizable(), aspectRatio({ contentMode: 'fit' }), frame({ width: size, height: size })]} />
    ) : (
      <Image systemName={props.reached ? 'checkmark.circle.fill' : 'timer'} size={size * 0.5} color={accent} />
    );

  const figure = (size: number) => (
    <Text modifiers={[font({ size, weight: 'bold' }), monospacedDigit(), foregroundStyle(ink), lineLimit(1), minimumScaleFactor(0.6)]}>{props.value}</Text>
  );
  const caption = <Text modifiers={[font({ size: 15, weight: 'medium' }), foregroundStyle(muted), lineLimit(1)]}>{props.caption}</Text>;
  const bar = <ProgressView value={props.fraction} modifiers={[progressViewStyle('linear'), tint(accent)]} />;

  return {
    banner: (
      <VStack alignment="leading" spacing={10} modifiers={[padding({ horizontal: 18, vertical: 16 }), activityBackgroundTint(card)]}>
        <HStack alignment="center" spacing={12}>
          <VStack alignment="leading" spacing={4}>
            <Text modifiers={[font({ size: 12, weight: 'semibold' }), textCase('uppercase'), kerning(0.6), foregroundStyle(muted), lineLimit(1)]}>{props.title}</Text>
            <HStack alignment="lastTextBaseline" spacing={6}>
              {figure(40)}
              {caption}
            </HStack>
          </VStack>
          <Spacer />
          {coach(68)}
        </HStack>
        <Text modifiers={[font({ size: 17, weight: 'semibold' }), foregroundStyle(ink), lineLimit(1), minimumScaleFactor(0.7)]}>{props.headline}</Text>
        <VStack alignment="leading" spacing={6}>
          {bar}
          <HStack>
            <Spacer />
            <Text modifiers={[font({ size: 13, weight: 'regular' }), monospacedDigit(), foregroundStyle(muted)]}>{props.progressText}</Text>
          </HStack>
        </VStack>
      </VStack>
    ),
    compactLeading: coach(22),
    compactTrailing: (
      <Text modifiers={[font({ size: 14, weight: 'bold' }), monospacedDigit(), foregroundStyle(accent), lineLimit(1)]}>{props.reached ? '✓' : props.value + 'm'}</Text>
    ),
    minimal: coach(22),
    expandedLeading: (
      <VStack alignment="leading" spacing={4} modifiers={[padding({ leading: 6 })]}>
        <Text modifiers={[font({ size: 11, weight: 'semibold' }), textCase('uppercase'), kerning(0.5), foregroundStyle(muted), lineLimit(1)]}>{props.title}</Text>
        <HStack alignment="lastTextBaseline" spacing={4}>
          {figure(30)}
          {caption}
        </HStack>
      </VStack>
    ),
    expandedTrailing: <HStack modifiers={[padding({ trailing: 6 })]}>{coach(48)}</HStack>,
    expandedBottom: (
      <VStack alignment="leading" spacing={8} modifiers={[padding({ horizontal: 6, top: 4 })]}>
        <Text modifiers={[font({ size: 15, weight: 'semibold' }), foregroundStyle(ink), lineLimit(1), minimumScaleFactor(0.7)]}>{props.headline}</Text>
        {bar}
        <HStack>
          <Spacer />
          <Text modifiers={[font({ size: 12, weight: 'regular' }), monospacedDigit(), foregroundStyle(muted)]}>{props.progressText}</Text>
        </HStack>
      </VStack>
    ),
  };
};
