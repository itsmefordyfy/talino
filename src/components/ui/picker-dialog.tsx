import { useEffect, useState, type ReactNode } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, View, type LayoutChangeEvent } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { Radius, Spacing } from '@/constants/theme';
import { useStrings } from '@/hooks/use-strings';
import { useTheme } from '@/hooks/use-theme';
import { tapFeedback } from '@/lib/haptics';

import { Button } from './button';
import { useModalPadding } from './modal-safe-area';

export type PickerDialogProps = {
  visible: boolean;
  /** The picker: the app's calendar or the time wheels. */
  children: ReactNode;
  onDone: () => void;
  onCancel: () => void;
};

const FADE_IN_MS = 220;
/**
 * The card stays invisible this long once mounted, so the calendar or time wheels finish their first layout
 * (they measure their width, then redraw) before anything shows: opening is then one clean fade, the same on every platform.
 */
const SETTLE_MS = 80;
const FADE_OUT_MS = 160;

/**
 * The card a date or time is picked in, drawn by the app so iPhone and Android are the same
 * (owner's call, 2026-10-17): centred over a dimmed screen (it can't open away from its field),
 * with Cancel and Done side by side, the same size. Nothing changes until Done.
 *
 * The fade is the app's, not the Modal's: the backdrop and the card fade as one layer, and the
 * Modal (with its content) stays mounted until the fade-out has finished. Closing used to hide the
 * Modal at once while its own fade ran and the picker inside had already unmounted, so the card
 * emptied, jumped and the dim cut out on its own timing. Reopening mid-fade turns the same fade
 * back up, so nothing flickers or blocks touches. While it fades out, it takes no touches.
 */
export function PickerDialog({ visible, children, onDone, onCancel }: PickerDialogProps) {
  const strings = useStrings();
  const theme = useTheme();
  const reduceMotion = useReducedMotion();
  // Mounted from opening until the fade-out ends; `visible` alone decides where the fade is heading.
  const [mounted, setMounted] = useState(visible);
  const opacity = useSharedValue(0);
  const fade = useAnimatedStyle(() => ({ opacity: opacity.get() }));
  // The card scrolls only when the picker is taller than the room (a short window). Otherwise a scroll view
  // that can't move still competed with the time wheels' own scrolling for the touch, and a wheel sometimes froze.
  const [viewport, setViewport] = useState(0);
  const [content, setContent] = useState(0);
  const scrollable = content > viewport + 1 && viewport > 0;
  if (visible && !mounted) setMounted(true);
  useEffect(() => {
    if (visible) opacity.set(withDelay(reduceMotion ? 0 : SETTLE_MS, withTiming(1, { duration: reduceMotion ? 0 : FADE_IN_MS })));
    else
      opacity.set(
        withTiming(0, { duration: reduceMotion ? 0 : FADE_OUT_MS }, (finished) => {
          // An interrupted fade (reopened) leaves it mounted.
          if (finished) scheduleOnRN(setMounted, false);
        }),
      );
  }, [visible, reduceMotion, opacity]);
  return (
    <Modal visible={mounted} transparent animationType="none" statusBarTranslucent navigationBarTranslucent onRequestClose={onCancel}>
      {/* A Modal is its own root on Android: gestures inside it (the calendar's swipe) need their own handler root. */}
      <GestureHandlerRootView style={StyleSheet.absoluteFill}>
        {/* One layer: Android otherwise fades the card and each of its children on its own. */}
        <Animated.View style={[StyleSheet.absoluteFill, fade]} pointerEvents={visible ? 'auto' : 'none'} needsOffscreenAlphaCompositing renderToHardwareTextureAndroid>
          <Pressable accessibilityRole="button" accessibilityLabel={strings.common.cancel} onPress={onCancel} style={[StyleSheet.absoluteFill, { backgroundColor: theme.overlay }]} />
          <DialogFrame>
            <View accessibilityViewIsModal style={[styles.card, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
              {/* In a short window (an iPhone on its side, the Duo's open screen) the picker scrolls and Cancel / Done stay in view. */}
              <ScrollView
                bounces={false}
                showsVerticalScrollIndicator={false}
                scrollEnabled={scrollable}
                onLayout={(event: LayoutChangeEvent) => setViewport(event.nativeEvent.layout.height)}
                onContentSizeChange={(_width, height) => setContent(height)}
                style={styles.picker}>
                {children}
              </ScrollView>
              <View style={styles.actions}>
                <Button title={strings.common.cancel} variant="secondary" onPress={onCancel} style={styles.action} />
                <Button
                  title={strings.common.done}
                  // Solid, not glass: the card fades in from transparent, and iOS doesn't draw a glass
                  // effect created under a parent at opacity 0 (Done was invisible).
                  material="solid"
                  onPress={() => {
                    tapFeedback();
                    onDone();
                  }}
                  style={styles.action}
                />
              </View>
            </View>
          </DialogFrame>
        </Animated.View>
      </GestureHandlerRootView>
    </Modal>
  );
}

/** Centres the card inside the window's safe area, with at least `Spacing.three` of air on each side. */
function DialogFrame({ children }: { children: ReactNode }) {
  const padding = useModalPadding(Spacing.three);
  return (
    <View style={[styles.center, padding]} pointerEvents="box-none">
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
  },
  card: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: 380,
    flexShrink: 1,
    padding: Spacing.three,
    gap: Spacing.three,
    borderRadius: Radius.large,
    borderCurve: 'continuous',
    borderWidth: StyleSheet.hairlineWidth,
    boxShadow: '0 12px 36px rgba(0, 0, 0, 0.18)',
  },
  picker: {
    flexGrow: 0,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  action: {
    flex: 1,
  },
});
