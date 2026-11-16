import { useState } from 'react';
import { StyleSheet, View, type GestureResponderEvent } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

import { resamplePeaks } from '../audio/lesson-audio';

const BAR = 2.5;
const GAP = 1.5;

export type WaveformProps = {
  /** Loudness 0 to 1 across the recording; without it the bars are an even, quiet row. */
  peaks: readonly number[] | null;
  /** How far through the recording, 0 to 1. */
  progress: number;
  /** Where each section of the lesson begins (0 to 1), shown as small marks under the bars. */
  marks?: readonly number[];
  onSeek: (fraction: number) => void;
  accessibilityLabel: string;
  accessibilityValue: string;
  /** Screen-reader steps: forward or back by this many seconds. */
  onAdjust: (direction: 1 | -1) => void;
  /** The bars' height; the whole control is a little taller for the playhead and the marks. */
  height?: number;
};

/**
 * The recording as bars, played ones in the brand violet and the rest quiet, with a small mark where each section
 * of the lesson begins (no playhead line: the colour change is the position). Tap or drag to jump; a screen
 * reader can step it forward and back.
 */
export function Waveform({ peaks, progress, marks = [], onSeek, accessibilityLabel, accessibilityValue, onAdjust, height = 36 }: WaveformProps) {
  const theme = useTheme();
  const [width, setWidth] = useState(0);
  const [scrub, setScrub] = useState<number | null>(null);
  const count = Math.max(0, Math.floor((width + GAP) / (BAR + GAP)));
  const bars = peaks ? resamplePeaks(peaks, count) : Array.from({ length: count }, () => 0.3);
  const shown = scrub ?? progress;
  const at = (event: GestureResponderEvent) => (width > 0 ? Math.min(1, Math.max(0, event.nativeEvent.locationX / width)) : 0);

  return (
    <View
      accessible
      accessibilityRole="adjustable"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{ text: accessibilityValue }}
      accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
      onAccessibilityAction={(event) => onAdjust(event.nativeEvent.actionName === 'increment' ? 1 : -1)}
      onLayout={(event) => setWidth(Math.floor(event.nativeEvent.layout.width))}
      onStartShouldSetResponder={() => true}
      onResponderGrant={(event) => setScrub(at(event))}
      onResponderMove={(event) => setScrub(at(event))}
      onResponderRelease={(event) => {
        onSeek(at(event));
        setScrub(null);
      }}
      onResponderTerminate={() => setScrub(null)}
      style={[styles.root, { height: height + 22 }]}>
      {/* The bars and marks ignore touches, so every touch lands on this whole control: a touch's position is measured from the view it lands on, and from a single bar it would always read as the very start. */}
      <View pointerEvents="none" style={[styles.bars, { height }]}>
        {bars.map((level, index) => (
          <View key={index} style={[styles.bar, { height: Math.max(3, level * height), backgroundColor: (index + 0.5) / Math.max(1, count) <= shown ? theme.primary : `${theme.primary}33` }]} />
        ))}
      </View>
      <View pointerEvents="none" style={styles.markRow}>
        {marks.map((mark) => (
          <View key={mark} style={[styles.mark, { left: `${mark * 100}%`, backgroundColor: theme.textTertiary }]} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    justifyContent: 'center',
  },
  bars: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bar: {
    width: BAR,
    borderRadius: BAR / 2,
  },
  markRow: {
    height: 8,
    marginTop: 2,
  },
  mark: {
    position: 'absolute',
    top: 2,
    width: 5,
    height: 5,
    marginLeft: -2.5,
    borderRadius: 2.5,
  },
});
