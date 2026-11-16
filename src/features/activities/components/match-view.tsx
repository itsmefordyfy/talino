import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Pressable, StyleSheet, View, type HostInstance } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Icon } from '@/components/ui/icon';
import { ProgressBar } from '@/components/ui/progress-bar';
import { useScreenReveal } from '@/components/ui/screen';
import { MinTouchSize, Spacing } from '@/constants/theme';
import { useLocalized } from '@/hooks/use-strings';
import { useTheme } from '@/hooks/use-theme';
import { tapFeedback } from '@/lib/haptics';

import type { ActivitySession } from '../hooks/use-activity-session';
import { matchDefinitionOrder } from '../lib/arrange';
import { useActivityDraft } from '../lib/draft';
import { stripInlineMarkup } from '../lib/text';
import { activityStrings } from '../strings';
import type { MatchActivity } from '../types';
import { ActivityFrame } from './activity-frame';
import { ChoiceBadge, ChoiceCard, ChoiceTint, choiceSurface, type ChoiceState } from './choice-card';
import { RichText } from './rich-text';

export type MatchViewProps = { activity: MatchActivity; session: ActivitySession };

const letter = (index: number) => String.fromCharCode(65 + (index % 26));

/**
 * Every card carries its own question: tap a card (a moment, a term) and its choices open right under it, so there is never a
 * second list to scroll to and the card you are answering stays in front of you. A right choice locks in and closes the card,
 * showing the match on it; a wrong one is marked, explained on the card, and can't be guessed again for that card.
 * What is picked survives leaving for the lesson and coming back (`useActivityDraft`).
 */
export function MatchView({ activity, session }: MatchViewProps) {
  const { text, done } = session;
  const id = activity.id;
  const [pairs, setPairs] = useActivityDraft<Record<number, number>>(id, 'pairs', {});
  const [open, setOpen] = useActivityDraft<number | null>(id, 'open', null);
  // Choices already refused, per card: the learner reads why and picks again, instead of tapping through the list.
  const [rejected, setRejected] = useActivityDraft<Record<number, number[]>>(id, 'rejected', {});
  const [order] = useState(() => matchDefinitionOrder(activity));
  const total = activity.pairs.length;
  const matched = Object.keys(pairs).length;
  const termsLabel = activity.labels?.terms ?? text.terms;
  const meaningsLabel = activity.labels?.meanings ?? text.meanings;

  const choose = async (term: number, definition: number) => {
    if (done) return;
    const result = await session.check({ kind: 'match', pairs: { ...pairs, [term]: definition } });
    if (!result) return;
    if (term === definition) {
      setPairs((current) => ({ ...current, [term]: definition }));
      setOpen(null);
    } else {
      setRejected((current) => ({ ...current, [term]: [...(current[term] ?? []), definition] }));
    }
  };

  const step = done ? text.matchAllDone : open !== null ? text.matchChooseFor(letter(open)) : text.matchPickCard;

  return (
    <ActivityFrame session={session} feedback="inline">
      <View style={styles.group}>
        <View style={styles.progressRow} accessibilityLiveRegion="polite">
          <View style={styles.stepText}>
            <ThemedText type="secondary" themeColor="textSecondary">
              {termsLabel}
            </ThemedText>
            <ThemedText type="bodySemiBold" themeColor="primaryText">
              {step}
            </ThemedText>
          </View>
          <ThemedText type="secondarySemiBold" themeColor="textSecondary" tabular>
            {text.matchCount(matched, total)}
          </ThemedText>
        </View>
        <ProgressBar fraction={total === 0 ? 0 : matched / total} done={matched === total} accessibilityLabel={text.matchProgress(matched, total)} />
      </View>

      <View style={styles.cards}>
        {activity.pairs.map((pair, index) => {
          const locked = pairs[index] === index;
          return (
            <MatchMoment
              key={index}
              badge={letter(index)}
              term={pair.term}
              matchedWith={locked ? pair.definition : null}
              isOpen={open === index && !locked && !done}
              disabled={locked || done}
              onToggle={() => setOpen(open === index ? null : index)}>
              <ThemedText type="caption" themeColor="textSecondary" style={styles.eyebrow}>
                {meaningsLabel}
              </ThemedText>
              <View style={styles.choices}>
                {order.map((definition) => {
                  const taken = pairs[definition] === definition;
                  const refused = (rejected[index] ?? []).includes(definition);
                  const state: ChoiceState = taken ? 'correct' : refused ? 'incorrect' : 'idle';
                  return (
                    <ChoiceCard
                      key={definition}
                      mode="action"
                      badge={taken ? letter(definition) : undefined}
                      title={activity.pairs[definition].definition}
                      // Why not, on the choice that was refused, where the learner is looking: the meaning's own note, else a nudge.
                      detail={refused ? `${text.matchNotThis}. ${activity.pairs[definition].note ?? text.matchTryAgain}` : undefined}
                      state={state}
                      muted={taken}
                      disabled={taken || refused || done}
                      accessibilityLabel={`${stripInlineMarkup(activity.pairs[definition].definition)}${taken ? `, ${text.matchedWith(letter(definition))}` : refused ? `, ${text.matchNotThis}` : ''}`}
                      onPress={() => void choose(index, definition)}
                    />
                  );
                })}
              </View>
            </MatchMoment>
          );
        })}
      </View>
    </ActivityFrame>
  );
}

type MatchMomentProps = {
  badge: string;
  term: string;
  /** The meaning this card is matched with, once it is. */
  matchedWith: string | null;
  isOpen: boolean;
  disabled: boolean;
  onToggle: () => void;
  /** The choices, drawn only while the card is open. */
  children: ReactNode;
};

/** One card of the first group: its words, its state (waiting, open, matched) and, when open, the choices under it. */
function MatchMoment({ badge, term, matchedWith, isOpen, disabled, onToggle, children }: MatchMomentProps) {
  const theme = useTheme();
  const text = useLocalized(activityStrings);
  const reveal = useScreenReveal();
  const ref = useRef<HostInstance>(null);
  const locked = matchedWith !== null;
  const state: ChoiceState = locked ? 'correct' : isOpen ? 'selected' : 'idle';

  // Opening a card can push its choices below the fold: bring the card up after it has laid out.
  useEffect(() => {
    if (!isOpen || !reveal) return;
    const timer = setTimeout(() => reveal(ref.current), 90);
    return () => clearTimeout(timer);
  }, [isOpen, reveal]);

  return (
    <View ref={ref} style={[...choiceSurface(theme), styles.moment]}>
      <ChoiceTint state={state} />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${badge}: ${stripInlineMarkup(term)}${locked ? `, ${text.matchPicked(badge, stripInlineMarkup(matchedWith))}` : ''}`}
        accessibilityHint={disabled ? undefined : text.matchOpenHint}
        accessibilityState={{ expanded: isOpen, disabled, selected: isOpen }}
        disabled={disabled}
        onPress={() => {
          tapFeedback();
          onToggle();
        }}
        style={({ pressed }) => [styles.header, pressed && styles.pressed]}>
        <ChoiceBadge label={badge} state={state} />
        <RichText type="bodySemiBold" text={term} style={styles.termText} />
        {locked ? <Icon name="check_circle" size={22} color="statusOk" filled /> : <Icon name={isOpen ? 'expand_less' : 'expand_more'} size={24} color={isOpen ? 'primary' : 'textSecondary'} />}
      </Pressable>
      {locked && (
        <View style={styles.tag} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
          <Icon name="link" size={18} color="statusOk" />
          <RichText type="bodySemiBold" text={matchedWith} style={[styles.termText, { color: theme.statusOk }]} />
        </View>
      )}
      {isOpen && <View style={styles.open}>{children}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  group: { gap: Spacing.two },
  progressRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: Spacing.three },
  stepText: { flex: 1, gap: 2 },
  cards: { gap: Spacing.two },
  moment: { gap: Spacing.three },
  header: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three, minHeight: MinTouchSize },
  termText: { flex: 1 },
  tag: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two, paddingLeft: Spacing.three + 28 },
  open: { gap: Spacing.three },
  eyebrow: { textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 700 },
  choices: { gap: Spacing.two },
  pressed: { opacity: 0.85 },
});
