import { createContext, use, useEffect, useRef, type ReactNode } from 'react';
import { BackHandler, Pressable, ScrollView, StyleSheet, View, type HostInstance } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scheduleOnRN } from 'react-native-worklets';

import { HeaderIconButton } from '@/components/header-icon-button';
import { SheetHeaderBar } from '@/components/sheet-header';
import { SheetCornerRadius, SheetMaxWidth, Spacing } from '@/constants/theme';
import { useKeyboardOverlap } from '@/components/ui/use-keyboard-overlap';
import { useStrings } from '@/hooks/use-strings';
import { useTheme } from '@/hooks/use-theme';
import { closeScreen } from '@/lib/navigation';
import { useViewport } from '@/hooks/use-viewport';

/** Closes the enclosing sheet the way its X does (sliding away), for a Save or a Remove inside it. */
const SheetCloseContext = createContext<(() => void) | null>(null);

export function useSheetClose(): () => void {
  return use(SheetCloseContext) ?? closeScreen;
}

export type SheetContentProps = {
  title: string;
  children: ReactNode;
};

const IN_MS = 260;
const OUT_MS = 200;
/** A drag down past this, or a flick faster than this, closes the sheet; less springs it back. */
const CLOSE_DRAG = 80;
const CLOSE_VELOCITY = 800;

/**
 * The app's short sheet, the body of a `contentSheet` route (app/_layout, a transparent modal):
 * as tall as what it shows, full width and down to the screen's bottom edge on both platforms
 * (owner's call, 2026-10-21: iOS 26 floats every short system sheet inset from the edges, with no
 * way to turn that off, so the app draws this one). The app's one sheet header (SheetHeaderBar:
 * the X, the title centered), rounded top corners, the home indicator's room inside. It slides up
 * over a dimmed screen and closes with the X, a tap on the dimmed part, a drag down or Back,
 * sliding away first (no slide with Reduce Motion).
 */
export function SheetContent({ title, children }: SheetContentProps) {
  const strings = useStrings();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const reduceMotion = useReducedMotion();
  const { height: screenHeight } = useViewport();
  // A field in the sheet (Set budget): the sheet rides up on the keyboard, whose height iOS reports and Android is measured against.
  const measure = useRef<HostInstance>(null);
  const keyboard = useKeyboardOverlap(measure, { ios: true, reachesBottom: true });
  // 0 hidden, 1 shown; the sheet's height until it's measured is the screen's, so it starts off screen.
  const progress = useSharedValue(0);
  const height = useSharedValue(screenHeight);
  const drag = useSharedValue(0);
  const closing = useSharedValue(false);

  useEffect(() => {
    progress.set(withTiming(1, { duration: reduceMotion ? 0 : IN_MS }));
  }, [progress, reduceMotion]);

  const close = () => {
    if (closing.get()) return;
    closing.set(true);
    progress.set(
      withTiming(0, { duration: reduceMotion ? 0 : OUT_MS }, (finished) => {
        if (finished) scheduleOnRN(closeScreen);
      }),
    );
  };

  // Android's Back slides it away too, rather than the route vanishing at once.
  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      close();
      return true;
    });
    return () => subscription.remove();
  });

  const pan = Gesture.Pan()
    .onChange((event) => {
      drag.set(Math.max(0, drag.get() + event.changeY));
    })
    .onEnd((event) => {
      if (drag.get() > CLOSE_DRAG || event.velocityY > CLOSE_VELOCITY) scheduleOnRN(close);
      else drag.set(withSpring(0));
    });

  const backdrop = useAnimatedStyle(() => ({ opacity: progress.get() }));
  const sheet = useAnimatedStyle(() => ({ transform: [{ translateY: drag.get() + (1 - progress.get()) * height.get() }] }));

  return (
    <GestureHandlerRootView style={[styles.root, { paddingLeft: insets.left, paddingRight: insets.right, paddingBottom: keyboard }]}>
      <View ref={measure} pointerEvents="none" collapsable={false} style={StyleSheet.absoluteFill} />
      <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: theme.overlay }, backdrop]}>
        <Pressable accessibilityRole="button" accessibilityLabel={strings.common.close} onPress={close} style={StyleSheet.absoluteFill} />
      </Animated.View>
      <GestureDetector gesture={pan}>
        <Animated.View
          accessibilityViewIsModal
          onLayout={(event) => height.set(event.nativeEvent.layout.height)}
          style={[styles.sheet, { backgroundColor: theme.background, paddingBottom: keyboard > 0 ? Spacing.two : insets.bottom + Spacing.two, maxHeight: screenHeight - insets.top - Spacing.four - keyboard }, sheet]}>
          <SheetHeaderBar title={title} left={<HeaderIconButton icon="close" accessibilityLabel={strings.common.close} onPress={close} />} />
          {/* In a short window (a phone on its side) a tall sheet scrolls under its header instead of running off the screen. */}
          <ScrollView bounces={false} keyboardShouldPersistTaps="handled" style={styles.scroll} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
            <SheetCloseContext value={close}>{children}</SheetCloseContext>
          </ScrollView>
        </Animated.View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  sheet: {
    width: '100%',
    // A wide window (the Duo's open screen, an iPad) keeps the sheet a phone's width, centered, not stretched edge to edge.
    maxWidth: SheetMaxWidth,
    borderTopLeftRadius: SheetCornerRadius,
    borderTopRightRadius: SheetCornerRadius,
    borderCurve: 'continuous',
    overflow: 'hidden',
    paddingTop: Spacing.two,
  },
  scroll: {
    flexGrow: 0,
  },
  body: {
    gap: Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.two,
  },
});
