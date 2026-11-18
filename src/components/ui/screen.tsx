import { createContext, use, useEffect, useImperativeHandle, useRef, useState, type ReactNode, type Ref } from 'react';
import { ScrollView, StyleSheet, TextInput, View, type ScrollViewProps, type StyleProp, type ViewStyle, type HostInstance, type ScrollViewInstance } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BottomTabInset, FloatingTaliDock, FloatingTaliSize, MaxContentWidth, Spacing, WideContentMaxWidth } from '@/constants/theme';
import { ContentWidthContext } from '@/components/content-width';
import { useChromeLayout } from '@/hooks/use-chrome-layout';
import { useTabBarOnTop } from '@/hooks/use-tab-bar-on-top';
import { followPlace, followTarget, type FollowPlace } from '@/lib/follow-zone';
import { useTopCovered } from '@/lib/top-cover';
import { useTheme } from '@/hooks/use-theme';

import { useKeyboardOverlap } from './use-keyboard-overlap';

export type ScreenVariant = 'stack' | 'tab' | 'root';

export type ScreenProps = Omit<ScrollViewProps, 'contentContainerStyle'> & {
  children: ReactNode;
  /**
   * `stack`: below a native header, which supplies the top inset.
   * `tab`: a tab root with no header, so pad for the status bar and tab bar.
   * `root`: no header and no tab bar (onboarding): pad for the status bar and the home indicator only.
   */
  variant?: ScreenVariant;
  /**
   * Lets the content take `WideContentMaxWidth` instead of `MaxContentWidth` (an iPad, where a tab lays out two columns). Harmless
   * on a phone: the content is never wider than the screen.
   */
  wide?: boolean;
  /** Content pinned below the scroll area, e.g. a form's Save button. */
  footer?: ReactNode;
  contentStyle?: StyleProp<ViewStyle>;
  /** Told the scroll offset as the content scrolls (a lesson pins its audio player once the full one has scrolled out of sight). */
  onScrollOffset?: (y: number) => void;
  /** What a form can ask of its screen: bring a field into view (the first invalid one, on Save). */
  ref?: Ref<ScreenHandle>;
};

export type ScreenHandle = {
  /** Scrolls so `view` sits in the upper part of what's visible. */
  reveal: (view: HostInstance | null) => void;
  /** Back to the top (a screen that swaps its content, like a lesson moving to its quiz). */
  scrollToTop: () => void;
  /** To an exact place in the content (the learning journey returning to where the learner was). */
  scrollTo: (y: number, animated?: boolean) => void;
  /**
   * Keeps `view` where it reads comfortably while something moves through the content (a lesson being listened to): with `scroll` it is
   * brought to a little above the middle unless it is already comfortable; without, it is only measured. `done` is told where it was.
   */
  follow: (view: HostInstance | null, options: { scroll: boolean; animated: boolean }, done?: (place: FollowPlace) => void) => void;
};

const RevealContext = createContext<ScreenHandle['reveal'] | null>(null);

/** The enclosing Screen's `reveal`, for a field whose content grows under it (suggestions) and must be scrolled into view; null outside a Screen. */
export function useScreenReveal(): ScreenHandle['reveal'] | null {
  return use(RevealContext);
}

/**
 * Lets the scroll area finish shrinking above the keyboard before the focused field is measured;
 * then once more, after Android's own scroll to the focused field, which measured mid-way left the
 * field under Save (New record's Name or product).
 */
const KEYBOARD_SCROLL_DELAYS_MS = [80, 450];

/**
 * Standard scrolling screen. Uses the native header's automatic content insets on iOS and keeps
 * content readable on tablets via a max width.
 */
export function Screen({ children, footer, variant = 'stack', wide = false, contentStyle, onScrollOffset, ref, ...rest }: ScreenProps) {
  const theme = useTheme();
  const padding = useScreenPadding(variant, !!footer);
  const scrollRef = useRef<ScrollViewInstance>(null);
  const rootRef = useRef<HostInstance>(null);
  const offset = useRef(0);
  const viewportHeight = useRef(0);
  // Measured here (not the window's width) so layouts that adapt to width follow an iPad's sidebar too.
  const [width, setWidth] = useState<number | null>(null);
  // Room for the keyboard: it lifts the footer (Save) above the keyboard and shrinks the scroll
  // area to what's still visible. Android page sheets need it whatever the screen (the system
  // can't move them out of the way); on iOS only a screen with a footer, which nothing else moves:
  // the scroll view's own keyboard inset left Save under the keyboard on every iPhone form.
  const keyboardOverlap = useKeyboardOverlap(rootRef, { ios: !!footer, reachesBottom: true });

  const reveal = (view: HostInstance | null) => {
    if (!view) return;
    rootRef.current?.measureInWindow((_x, rootY) => {
      view.measureInWindow((_viewX, viewY) => {
        // A quarter down the visible area: clear of a header drawn over the content (iOS).
        const target = offset.current + viewY - rootY - viewportHeight.current / 4;
        scrollRef.current?.scrollTo({ y: Math.max(0, target), animated: true });
      });
    });
  };
  const follow: ScreenHandle['follow'] = (view, { scroll, animated }, done) => {
    if (!view) return;
    rootRef.current?.measureInWindow((_x, rootY) => {
      view.measureInWindow((_viewX, viewY, _width, viewHeight) => {
        const height = viewportHeight.current;
        if (height <= 0) return;
        const box = { top: viewY - rootY, bottom: viewY - rootY + viewHeight, height };
        const place = followPlace(box);
        done?.(place);
        if (scroll && place !== 'comfortable') scrollRef.current?.scrollTo({ y: followTarget({ ...box, offset: offset.current }), animated });
      });
    });
  };
  useImperativeHandle(ref, () => ({ reveal, follow, scrollToTop: () => scrollRef.current?.scrollTo({ y: 0, animated: false }), scrollTo: (y, animated = false) => scrollRef.current?.scrollTo({ y: Math.max(0, y), animated }) }));

  // Once the scroll area has shrunk above the keyboard, bring the field being typed in into view
  // (a full-screen page gets this from the system; a sheet doesn't).
  useEffect(() => {
    if (keyboardOverlap === 0) return;
    const reveal = () => {
      const input = TextInput.State.currentlyFocusedInput();
      rootRef.current?.measureInWindow((_x, rootY) => {
        const visibleBottom = rootY + viewportHeight.current;
        input?.measureInWindow((_inputX, inputY, _inputWidth, inputHeight) => {
          const hidden = inputY + inputHeight + Spacing.three - visibleBottom;
          // Above the top: an earlier measurement, taken while the sheet was still sliding in, scrolled too far.
          const above = rootY + Spacing.three - inputY;
          if (hidden > 0) scrollRef.current?.scrollTo({ y: offset.current + hidden, animated: true });
          else if (above > 0) scrollRef.current?.scrollTo({ y: Math.max(0, offset.current - above), animated: true });
        });
      });
    };
    const timers = KEYBOARD_SCROLL_DELAYS_MS.map((ms) => setTimeout(reveal, ms));
    return () => timers.forEach(clearTimeout);
  }, [keyboardOverlap]);

  return (
    <ContentWidthContext value={width}>
    <View
      ref={rootRef}
      onLayout={(event) => setWidth((previous) => (previous === Math.round(event.nativeEvent.layout.width) ? previous : Math.round(event.nativeEvent.layout.width)))}
      style={[styles.root, { backgroundColor: theme.background, paddingBottom: keyboardOverlap }]}>
      <ScrollView
        ref={scrollRef}
        onScroll={(event) => {
          offset.current = event.nativeEvent.contentOffset.y;
          onScrollOffset?.(offset.current);
        }}
        onLayout={(event) => {
          viewportHeight.current = event.nativeEvent.layout.height;
        }}
        scrollEventThrottle={32}
        contentInsetAdjustmentBehavior={variant === 'stack' ? 'automatic' : 'never'}
        keyboardShouldPersistTaps="handled"
        // Android page sheets: lets the sheet see this scroll, so dragging down scrolls back up
        // through the form and only closes the sheet once it's at the top (as on iOS). Without
        // it the sheet takes every downward drag and closes mid-form.
        nestedScrollEnabled
        // iOS: scroll the focused field above the keyboard instead of typing behind it. A screen
        // with a footer is shrunk above the keyboard instead (above), and an inset as well would
        // leave a keyboard's height of blank space under the form.
        automaticallyAdjustKeyboardInsets={!footer}
        keyboardDismissMode="interactive"
        contentContainerStyle={[styles.content, wide && styles.wide, { paddingTop: padding.paddingTop, paddingBottom: padding.paddingBottom, paddingLeft: padding.paddingLeft, paddingRight: padding.paddingRight }, contentStyle]}
        {...rest}>
        <RevealContext value={reveal}>{children}</RevealContext>
      </ScrollView>
      {footer && (
        <View
          style={[
            styles.footer,
            wide && styles.wide,
            {
              // Over the keyboard, the home-indicator room below the button isn't needed.
              paddingBottom: keyboardOverlap > 0 ? Spacing.two : padding.footerBottom,
              paddingLeft: padding.paddingLeft,
              paddingRight: padding.paddingRight,
              backgroundColor: theme.background,
              borderColor: theme.border,
            },
          ]}>
          {footer}
        </View>
      )}
    </View>
    </ContentWidthContext>
  );
}

/** Content padding for scrollable screens and lists, shared so FlatList screens match `Screen`. */
export function useScreenPadding(variant: ScreenVariant, hasFooter = false) {
  const insets = useSafeAreaInsets();
  const covered = useTopCovered();
  const chrome = useChromeLayout();
  // An iPad's tab bar floats at the top and the safe area's top inset already includes it (measured on the iPad Air, 2026-11-16).
  const barOnTop = useTabBarOnTop();
  // A tab bar along the side or across the top takes no room at the bottom, and Tali's button doesn't rise out of it.
  const bottomChrome = variant === 'tab' && !chrome.vertical && !barOnTop ? BottomTabInset : 0;
  return {
    paddingTop: variant !== 'stack' ? Math.max(0, insets.top - covered) + Spacing.three : Spacing.three,
    paddingBottom: hasFooter ? Spacing.four : insets.bottom + bottomChrome + Spacing.five,
    // A tab screen's footer (the chat box) also clears the part of Tali's button that rises above the bar.
    footerBottom: insets.bottom + Spacing.two + (variant === 'tab' && !chrome.vertical && !barOnTop ? FloatingTaliSize - FloatingTaliDock : 0),
    // The sides' own insets (iPhone Duo, 2026-10-25: its vertical status bar takes 84 pt of the
    // right edge, and the two sides are never assumed equal). Zero on a phone held upright.
    paddingLeft: insets.left + Spacing.three,
    paddingRight: insets.right + Spacing.three,
  };
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    gap: Spacing.four,
    padding: Spacing.three,
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
  },
  wide: {
    maxWidth: WideContentMaxWidth,
  },
  footer: {
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.two,
    borderTopWidth: StyleSheet.hairlineWidth,
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
  },
});
