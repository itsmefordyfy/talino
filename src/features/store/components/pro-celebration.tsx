import { useEffect } from 'react';
import { Modal, StyleSheet, View } from 'react-native';

import { CelebrationCard } from '@/components/celebration-card';
import { ConfettiFall } from '@/components/confetti-fall';
import { Spacing } from '@/constants/theme';
import { useLocalized } from '@/hooks/use-strings';
import { useTheme } from '@/hooks/use-theme';
import { useViewport } from '@/hooks/use-viewport';
import { successFeedback } from '@/lib/haptics';
import { endProCelebration, useProCelebration } from '@/lib/pro-celebration';

import { storeStrings } from '../strings';

/**
 * Happy Tali once Talino Pro is on, after a purchase: a card in a dimmed modal over the screen beneath the paywall, which closes
 * first (`celebrateProAfterClose`; copied from Pawfetti's `ProCelebrationHost`, owner's request 2026-11-15). No entrance animation:
 * the confetti falling, over the card and never in the way of a tap, is the movement. Shown only once the purchase has come back
 * with the entitlement, never on the tap alone. Mounted once in the app's hosts; `celebratePro()` opens it.
 */
export function ProCelebrationHost() {
  const celebration = useProCelebration();
  return (
    <Modal visible={celebration > 0} transparent animationType="fade" statusBarTranslucent onRequestClose={endProCelebration}>
      {/* Keyed by the celebration, so each one gets a fresh fall of confetti. */}
      {celebration > 0 && <Celebration key={celebration} onDone={endProCelebration} />}
    </Modal>
  );
}

function Celebration({ onDone }: { onDone: () => void }) {
  const c = useLocalized(storeStrings).celebration;
  const theme = useTheme();
  const { height } = useViewport();
  useEffect(() => {
    successFeedback();
  }, []);
  return (
    <View style={[styles.backdrop, { backgroundColor: theme.overlay }]}>
      <CelebrationCard mood="celebrating" eyebrow={c.eyebrow} title={c.title} message={c.message} actionLabel={c.done} actionIcon="menu_book" onAction={onDone} announcement={`${c.title} ${c.message}`} />
      {/* After the card, so it falls over it: on top of everything, but never in the way of a tap. */}
      <ConfettiFall height={height} />
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.four,
  },
});
