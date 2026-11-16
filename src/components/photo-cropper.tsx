import { Image } from 'expo-image';
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import { useEffect, useEffectEvent, useState } from 'react';
import { ActivityIndicator, StyleSheet, View, type LayoutRectangle } from 'react-native';
import { GestureDetector, usePanGesture, usePinchGesture, useSimultaneousGestures } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { HeroInk, PhotoBackdrop, Radius, Spacing } from '@/constants/theme';
import { useLocalized, useStrings } from '@/hooks/use-strings';
import type { CroppedPhoto, CropRequest } from '@/lib/crop-request';
import { clampOffset, clampZoom, coverScale, cropRect, frameSize, holePath } from '@/lib/crop-math';
import { reportError } from '@/lib/monitoring';

import { photoCropperStrings } from './photo-cropper-strings';

export type PhotoCropperProps = Pick<CropRequest, 'uri' | 'aspect' | 'shape'> & {
  onCancel: () => void;
  /** The photo couldn't be read or cut: the caller says so. */
  onFail: () => void;
  onApply: (photo: CroppedPhoto) => void;
};

/** The working copy's longest side: plenty to crop from, light enough to move at 60 fps. */
const WORKING_SIDE = 2400;
/** The cropped photo's width at most; the profile picture is shrunk much further anyway. */
const OUTPUT_WIDTH = 1080;
/** Dims the photo outside the frame; fixed, the cropper is dark in both themes. */
const SHADE = 'rgba(0, 0, 0, 0.6)';

type Prepared = { uri: string; width: number; height: number };

/**
 * One decoded copy, upright and at most WORKING_SIDE: what's shown and what's cropped are the same pixels, so a photo's
 * rotation flag can never put the crop somewhere else.
 */
async function prepare(uri: string): Promise<Prepared> {
  const original = await ImageManipulator.manipulate(uri).renderAsync();
  const factor = Math.min(1, WORKING_SIDE / Math.max(original.width, original.height));
  const image = factor < 1 ? await ImageManipulator.manipulate(original).resize({ width: Math.round(original.width * factor) }).renderAsync() : original;
  const saved = await image.saveAsync({ format: SaveFormat.JPEG, compress: 0.92 });
  return { uri: saved.uri, width: saved.width, height: saved.height };
}

/**
 * Move and zoom a photo inside a frame of the shape it will be shown in, then Done. The frame is the preview: what's
 * inside it is what's kept, and the rest is dimmed. The photo always covers the frame, so a crop is never stretched or
 * left with an empty edge. Black in both themes, like a camera; chrome in fixed light ink. The system pickers' own crop
 * isn't used: on iPhone it swaps the instant photo picker for a slow legacy one.
 */
export function PhotoCropper({ uri, aspect, shape, onCancel, onFail, onApply }: PhotoCropperProps) {
  const strings = useStrings();
  const c = useLocalized(photoCropperStrings);
  const insets = useSafeAreaInsets();
  const [prepared, setPrepared] = useState<Prepared | null>(null);
  const [area, setArea] = useState<LayoutRectangle | null>(null);
  const [applying, setApplying] = useState(false);
  const zoom = useSharedValue(1);
  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const start = useSharedValue({ zoom: 1, x: 0, y: 0 });
  // The photo's size at zoom 1 and the frame's, for the gestures (on the UI thread, so not read from a render's closure).
  const geometry = useSharedValue({ baseWidth: 0, baseHeight: 0, frameWidth: 0, frameHeight: 0 });

  const fail = useEffectEvent(onFail);

  useEffect(() => {
    let current = true;
    prepare(uri)
      .then((result) => {
        if (current) setPrepared(result);
      })
      .catch((error: unknown) => {
        reportError(error, 'career', { step: 'crop_prepare' });
        if (current) fail();
      });
    return () => {
      current = false;
    };
  }, [uri]);

  const frame = frameSize(area, aspect, Spacing.four);
  const fit = prepared ? coverScale(prepared, frame) : 1;
  const baseWidth = (prepared?.width ?? 0) * fit;
  const baseHeight = (prepared?.height ?? 0) * fit;

  useEffect(() => {
    geometry.value = { baseWidth, baseHeight, frameWidth: frame.width, frameHeight: frame.height };
  }, [geometry, baseWidth, baseHeight, frame.width, frame.height]);

  const pan = usePanGesture({
    onBegin: () => {
      'worklet';
      start.value = { zoom: zoom.value, x: x.value, y: y.value };
    },
    onUpdate: (event) => {
      'worklet';
      const g = geometry.value;
      x.value = clampOffset(start.value.x + event.translationX, zoom.value, g.baseWidth, g.frameWidth);
      y.value = clampOffset(start.value.y + event.translationY, zoom.value, g.baseHeight, g.frameHeight);
    },
  });
  const pinch = usePinchGesture({
    onBegin: () => {
      'worklet';
      start.value = { zoom: zoom.value, x: x.value, y: y.value };
    },
    onUpdate: (event) => {
      'worklet';
      const g = geometry.value;
      zoom.value = clampZoom(start.value.zoom * event.scale);
      // Zooming out can uncover an edge: the photo slides back to cover the frame.
      x.value = clampOffset(x.value, zoom.value, g.baseWidth, g.frameWidth);
      y.value = clampOffset(y.value, zoom.value, g.baseHeight, g.frameHeight);
    },
  });
  const gesture = useSimultaneousGestures(pan, pinch);

  // Drawn clamped, so a new frame (a rotation, a resized window) can never leave an edge uncovered; `cropRect` clamps the same way.
  const photoStyle = useAnimatedStyle(() => {
    const g = geometry.value;
    return { transform: [{ translateX: clampOffset(x.value, zoom.value, g.baseWidth, g.frameWidth) }, { translateY: clampOffset(y.value, zoom.value, g.baseHeight, g.frameHeight) }, { scale: zoom.value }] };
  });

  const apply = async () => {
    if (!prepared || applying) return;
    setApplying(true);
    try {
      const rect = cropRect({ image: prepared, frame, zoom: zoom.value, x: x.value, y: y.value });
      const cropped = await ImageManipulator.manipulate(prepared.uri).crop(rect).resize({ width: Math.min(OUTPUT_WIDTH, rect.width) }).renderAsync();
      const saved = await cropped.saveAsync({ format: SaveFormat.JPEG, compress: 0.9 });
      onApply({ uri: saved.uri, width: saved.width });
    } catch (error) {
      reportError(error, 'career', { step: 'crop_apply' });
      onFail();
    }
  };

  const ready = prepared !== null && area !== null && frame.width > 0;
  // A round frame for a profile picture; a plain rounded rectangle for anything else.
  const radius = shape === 'circle' ? Math.min(frame.width, frame.height) / 2 : Radius.large;
  return (
    <View style={[styles.root, { paddingTop: insets.top + Spacing.two, paddingBottom: insets.bottom + Spacing.two }]}>
      <ThemedText type="cardTitle" style={styles.title} accessibilityRole="header">
        {c.title}
      </ThemedText>
      <GestureDetector gesture={gesture}>
        <View style={styles.area} onLayout={(event) => setArea(event.nativeEvent.layout)} accessibilityLabel={c.frameLabel}>
          {!ready ? (
            <ActivityIndicator color={HeroInk.text} />
          ) : (
            <>
              <Animated.View style={[{ width: baseWidth, height: baseHeight }, photoStyle]}>
                <Image source={{ uri: prepared.uri }} style={StyleSheet.absoluteFill} contentFit="fill" accessibilityIgnoresInvertColors />
              </Animated.View>
              <View pointerEvents="none" style={StyleSheet.absoluteFill}>
                <Svg width={area.width} height={area.height}>
                  <Path d={holePath(area, frame, radius)} fill={SHADE} fillRule="evenodd" />
                </Svg>
                <View
                  style={[styles.frame, { top: (area.height - frame.height) / 2, left: (area.width - frame.width) / 2, width: frame.width, height: frame.height, borderRadius: radius }]}
                />
              </View>
            </>
          )}
        </View>
      </GestureDetector>
      <ThemedText type="caption" style={styles.message}>
        {c.hint}
      </ThemedText>
      <View style={styles.actions}>
        <Button title={strings.common.cancel} variant="secondary" material="solid" onPress={onCancel} style={styles.action} />
        <Button title={strings.common.done} icon="check" material="solid" loading={applying} disabled={!ready} onPress={() => void apply()} style={styles.action} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: PhotoBackdrop,
    gap: Spacing.three,
  },
  title: {
    color: HeroInk.text,
    textAlign: 'center',
  },
  area: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  frame: {
    position: 'absolute',
    borderWidth: 1.5,
    borderColor: HeroInk.text,
    borderCurve: 'continuous',
  },
  message: {
    color: HeroInk.muted,
    textAlign: 'center',
    paddingHorizontal: Spacing.four,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.three,
    paddingHorizontal: Spacing.three,
  },
  action: {
    flex: 1,
  },
});
