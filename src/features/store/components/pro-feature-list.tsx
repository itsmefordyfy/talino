import { StyleSheet, View, type ViewProps } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Icon, type IconName } from '@/components/ui/icon';
import { Radius, Spacing, type ThemeColor } from '@/constants/theme';
import { useLocalized } from '@/hooks/use-strings';
import { useTheme } from '@/hooks/use-theme';

import { orderedFeatures, type PaywallFeature } from '../lib/paywall-content';
import { paywallStrings } from '../paywall-strings';

/** Each benefit's icon in its own coloured well, so the list scans at a glance. */
const LOOKS: Record<PaywallFeature, { icon: IconName; color: ThemeColor; background: ThemeColor }> = {
  courses: { icon: 'school', color: 'primary', background: 'primarySoft' },
  reviews: { icon: 'workspace_premium', color: 'statusWarn', background: 'statusWarnSoft' },
  coach: { icon: 'forum', color: 'statusOk', background: 'statusOkSoft' },
  resume: { icon: 'description', color: 'primary', background: 'primarySoft' },
  kit: { icon: 'folder_special', color: 'statusWarn', background: 'statusWarnSoft' },
  backup: { icon: 'cloud_done', color: 'statusOk', background: 'statusOkSoft' },
};

export type ProFeatureListProps = ViewProps & {
  /** What the learner reached for: listed first. */
  lead?: PaywallFeature | null;
};

/** What Pro adds, each with what it means for the learner. */
export function ProFeatureList({ lead = null, style, ...rest }: ProFeatureListProps) {
  const { features } = useLocalized(paywallStrings);
  const theme = useTheme();
  return (
    <View style={[styles.list, style]} {...rest}>
      {orderedFeatures(lead).map((key) => {
        const look = LOOKS[key];
        return (
          <View key={key} style={styles.row}>
            <View style={[styles.iconWell, { backgroundColor: theme[look.background] }]}>
              <Icon name={look.icon} size={18} color={look.color} />
            </View>
            <View style={styles.text}>
              <ThemedText type="cardTitle">{features[key].title}</ThemedText>
              <ThemedText type="secondary" themeColor="textSecondary">
                {features[key].hint}
              </ThemedText>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: Spacing.three,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.three,
  },
  iconWell: {
    width: 36,
    height: 36,
    borderRadius: Radius.medium,
    borderCurve: 'continuous',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    flex: 1,
    gap: Spacing.half,
  },
});
