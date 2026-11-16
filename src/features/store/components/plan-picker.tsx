import { StyleSheet, View, type ViewProps } from 'react-native';

import { Spacing } from '@/constants/theme';
import { useLocalized } from '@/hooks/use-strings';

import { savingPercent, sortPlans, weeklyEquivalent } from '../lib/plans';
import { paywallStrings } from '../paywall-strings';
import { storeStrings } from '../strings';
import type { StoreItem } from '../types';
import { PlanOption } from './plan-option';

export type PlanPickerProps = ViewProps & {
  items: readonly StoreItem[];
  selectedId: string | null;
  onSelect: (productId: string) => void;
  /** The plan a subscriber is already on (the Plan screen): tagged "Current plan" and never a choice. */
  currentId?: string | null;
  /** The yearly plan's second line, "Just ₱38.44 a week" (the paywall; the Plan screen leaves it out). */
  showEquivalent?: boolean;
};

/** The offering's plans, best value first, each with its price and its tags (Best value, Save N%). */
export function PlanPicker({ items, selectedId, onSelect, currentId = null, showEquivalent = false, style, ...rest }: PlanPickerProps) {
  const strings = useLocalized(storeStrings);
  const extra = useLocalized(paywallStrings);
  const plans = sortPlans(items);
  return (
    <View style={[styles.plans, style]} accessibilityRole="radiogroup" {...rest}>
      {plans.map((plan) => {
        const saving = savingPercent(plan, plans);
        const current = plan.productId === currentId;
        const tags = [current ? strings.plan.current : null, plan.kind === 'yearly' ? strings.bestValue : null, saving ? strings.save(saving) : null].filter((tag): tag is string => tag !== null);
        const weekly = showEquivalent ? weeklyEquivalent(plan) : null;
        return (
          <PlanOption
            key={plan.productId}
            title={strings.plans[plan.kind]}
            detail={weekly ? extra.justPerWeek(weekly) : undefined}
            price={`${plan.priceString} ${strings.periods[plan.kind]}`}
            tags={tags}
            selected={!current && plan.productId === selectedId}
            // The plan already held isn't a choice: tapping it keeps the selection.
            onPress={() => !current && onSelect(plan.productId)}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  plans: {
    gap: Spacing.three,
    // Room for the pills that overhang the first card.
    paddingTop: Spacing.two,
  },
});
