import { StyleSheet, View } from 'react-native';

import { Screen } from '@/components/ui/screen';
import { SkeletonBlock } from '@/components/ui/skeleton';
import { Radius, Spacing } from '@/constants/theme';
import { useSplitView } from '@/hooks/use-split-view';
import { useStrings } from '@/hooks/use-strings';
import { useTheme } from '@/hooks/use-theme';
import { useTwoUp } from '@/hooks/use-two-up';

export type TabSkeletonProps = {
  /** Which tab's shape to show, so the real content lands where its placeholder was. */
  variant: 'home' | 'courses' | 'career' | 'me';
};

/** A tab title (with a line under it when the tab has one) and the settings button beside it. */
function Header({ subtitle = true }: { subtitle?: boolean }) {
  return (
    <View style={styles.row}>
      <View style={styles.grow}>
        <SkeletonBlock width={subtitle ? 210 : 140} height={30} radius={Radius.small} />
        {subtitle && <SkeletonBlock width={140} height={14} radius={Radius.small} />}
      </View>
      <SkeletonBlock width={44} height={44} radius={Radius.pill} />
    </View>
  );
}

/** A section heading and the card under it, at about their real sizes. */
function Section({ height }: { height: number }) {
  return (
    <View style={styles.section}>
      <SkeletonBlock width={140} height={20} radius={Radius.small} />
      <SkeletonBlock height={height} radius={Radius.card} />
    </View>
  );
}

function Tiles({ count }: { count: number }) {
  return (
    <View style={styles.row}>
      {Array.from({ length: count }, (_, index) => (
        <SkeletonBlock key={index} height={84} radius={Radius.card} style={styles.grow} />
      ))}
    </View>
  );
}

function ListCard({ rows }: { rows: number }) {
  const theme = useTheme();
  return (
    <View style={[styles.list, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
      {Array.from({ length: rows }, (_, index) => (
        <View key={index} style={styles.row}>
          <SkeletonBlock width={40} height={40} radius={Radius.medium} />
          <View style={styles.grow}>
            <SkeletonBlock width="60%" height={14} radius={Radius.small} />
            <SkeletonBlock width="35%" height={11} radius={Radius.small} />
          </View>
          <SkeletonBlock width={48} height={14} radius={Radius.small} />
        </View>
      ))}
    </View>
  );
}

function Home({ split }: { split: boolean }) {
  const summary = <SkeletonBlock height={190} radius={Radius.card} />;
  const map = (
    <View style={styles.stack}>
      <SkeletonBlock height={96} radius={Radius.card} />
      <SkeletonBlock height={96} radius={Radius.card} />
      <SkeletonBlock height={96} radius={Radius.card} />
    </View>
  );
  if (split) {
    return (
      <View style={styles.columns}>
        <View style={[styles.stack, styles.side]}>
          <Header />
          {summary}
        </View>
        <View style={styles.grow}>{map}</View>
      </View>
    );
  }
  return (
    <>
      <Header />
      {summary}
      {map}
    </>
  );
}

function Courses() {
  return (
    <>
      <Header subtitle={false} />
      <SkeletonBlock height={48} radius={Radius.pill} />
      <View style={styles.row}>
        {[88, 72, 96, 80].map((width, index) => (
          <SkeletonBlock key={index} width={width} height={36} radius={Radius.pill} />
        ))}
      </View>
      <SkeletonBlock height={72} radius={Radius.card} />
      <SkeletonBlock height={220} radius={Radius.card} />
    </>
  );
}

function Career({ wide }: { wide: boolean }) {
  const left = (
    <View style={styles.stack}>
      <Tiles count={4} />
      <Section height={140} />
      <Section height={120} />
    </View>
  );
  const right = (
    <View style={styles.stack}>
      <Section height={120} />
      <Section height={160} />
    </View>
  );
  return (
    <>
      <Header />
      {wide ? (
        <View style={styles.columns}>
          <View style={styles.grow}>{left}</View>
          <View style={styles.grow}>{right}</View>
        </View>
      ) : (
        <>
          {left}
          {right}
        </>
      )}
    </>
  );
}

function Me({ wide }: { wide: boolean }) {
  const hero = (
    <View style={styles.stack}>
      <SkeletonBlock height={120} radius={Radius.card} />
      <Tiles count={4} />
    </View>
  );
  const rest = (
    <View style={styles.stack}>
      <Section height={140} />
      <ListCard rows={3} />
    </View>
  );
  return (
    <>
      <Header subtitle={false} />
      {wide ? (
        <View style={styles.columns}>
          <View style={styles.grow}>{hero}</View>
          <View style={styles.grow}>{rest}</View>
        </View>
      ) : (
        <>
          {hero}
          {rest}
        </>
      )}
    </>
  );
}

/**
 * A tab's shape while its data loads, and for the moment the iPhone Duo is folded or opened: the header, cards and rows at
 * their real sizes (in two columns where the real tab uses them), instead of a few bare blocks under the title. Same idea as
 * CarMind's skeletons (owner's request, 2026-11-16). The wide shapes follow the same width rules as the screens
 * (`useTwoUp`, `useSplitView`), so the placeholder already has the layout the content is about to have. Read by screen
 * readers as "Loading".
 */
export function TabSkeleton({ variant }: TabSkeletonProps) {
  const wide = useTwoUp();
  const split = useSplitView();
  const loading = useStrings().common.loading;
  return (
    <Screen variant="tab" wide={wide} scrollEnabled={false} accessible accessibilityLabel={loading}>
      {variant === 'home' && <Home split={split} />}
      {variant === 'courses' && <Courses />}
      {variant === 'career' && <Career wide={wide} />}
      {variant === 'me' && <Me wide={wide} />}
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  grow: {
    flex: 1,
    gap: Spacing.two,
  },
  stack: {
    gap: Spacing.three,
  },
  side: {
    width: 320,
  },
  section: {
    gap: Spacing.two,
  },
  columns: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.three,
  },
  list: {
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: Radius.card,
    borderCurve: 'continuous',
    borderWidth: StyleSheet.hairlineWidth,
  },
});
