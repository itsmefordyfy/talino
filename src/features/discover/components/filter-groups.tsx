import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Icon } from '@/components/ui/icon';
import { Notice } from '@/components/ui/notice';
import { InputHeight, Radius, Spacing, Typography } from '@/constants/theme';
import { catalogFacts, facetCounts, facetValues, filterLabel, technologyLabel, type FilterDimension } from '@/features/courses';
import { useLanguage, useLocalized } from '@/hooks/use-strings';
import { useTheme } from '@/hooks/use-theme';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

import { dimensionCleared, filterToggled, selectDiscoverFilters, selectDiscoverQuery } from '../discover-slice';
import { useDiscoverTab } from '../hooks/use-discover-tab';
import { useLearnerSignals } from '../hooks/use-learner-signals';
import { browseStrings } from '../browse-strings';
import { progressStatusOf } from '../lib/learner';
import { scopeFacts } from '../lib/tabs';
import { discoverStrings } from '../strings';
import { FilterChip } from './filter-chip';

/** The order of the groups: level first, since it is what a beginner needs most, then the AI tools Talino is about. */
// Category is not a group here: the tabs under the search box are the category control, and the filters combine with the chosen tab.
const GROUPS: readonly FilterDimension[] = ['levels', 'tools', 'access', 'progress', 'durations', 'types', 'technologies', 'goals'];
/** How many technologies show before "Show all": the owner's named ones lead the list. */
const TECHNOLOGIES_SHOWN = 12;

export type FilterGroupsProps = {
  /** Hide the dimmed-options explanation (a screen that shows it elsewhere). */
  hideNote?: boolean;
};

/**
 * Every filter group, read from and written to the Discover state, so the sheet and the wide side column are the same
 * control. Each option shows how many courses it would give (given the search text and the other groups) and is dimmed,
 * never removed, when that is none.
 */
export function FilterGroups({ hideNote = false }: FilterGroupsProps) {
  const strings = useLocalized(discoverStrings);
  const browse = useLocalized(browseStrings);
  const dispatch = useAppDispatch();
  const filters = useAppSelector(selectDiscoverFilters);
  const learner = useLearnerSignals();
  const context = { progressOf: progressStatusOf(learner.signals) };
  const text = useAppSelector(selectDiscoverQuery);
  const { tab } = useDiscoverTab();
  // Counts are for the courses the tab covers (and the whole catalog while searching), so "Show N courses" is what the list will show.
  const facts = scopeFacts(catalogFacts(), tab, text);
  const query = { text, filters };

  const titles: Record<FilterDimension, string> = {
    levels: browse.levelMeaning,
    tools: browse.toolsFilter,
    access: browse.accessFilter,
    progress: browse.progressFilter,
    types: strings.filterGroupTypes,
    categories: strings.filterGroupCategories,
    technologies: strings.filterGroupTechnologies,
    goals: strings.filterGroupGoals,
    durations: strings.filterGroupDurations,
  };

  const groups = GROUPS.map((dimension) => {
    const counts = facetCounts(facts, query, dimension, context);
    const chosen = (filters[dimension] ?? []) as readonly string[];
    const values = facetValues(facts, dimension) as string[];
    return { dimension, counts: counts as Map<string, number>, chosen, values };
  });

  const anyDimmed = groups.some(({ counts, chosen, values }) => values.some((value) => (counts.get(value) ?? 0) === 0 && !chosen.includes(value)));

  return (
    <View style={styles.groups}>
      {!hideNote && anyDimmed && <Notice tone="info" message={strings.dimmedNote} />}
      {groups.map(({ dimension, counts, chosen, values }) => (
        <View key={dimension} style={styles.group}>
          <View style={styles.groupHeader}>
            <ThemedText type="cardTitle" accessibilityRole="header" style={styles.groupTitle}>
              {titles[dimension]}
            </ThemedText>
            {chosen.length > 0 && (
              <Pressable accessibilityRole="button" accessibilityLabel={`${strings.clearGroup} ${titles[dimension]}`} hitSlop={12} onPress={() => dispatch(dimensionCleared(dimension))}>
                <ThemedText type="secondarySemiBold" themeColor="primaryText">
                  {strings.clearGroup}
                </ThemedText>
              </Pressable>
            )}
          </View>
          {dimension === 'technologies' ? (
            <TechnologyOptions values={values} counts={counts} chosen={chosen} />
          ) : (
            <View style={styles.wrap}>
              {values.map((value) => (
                <Option key={value} dimension={dimension} value={value} counts={counts} chosen={chosen} />
              ))}
            </View>
          )}
        </View>
      ))}
    </View>
  );
}

type OptionProps = { dimension: FilterDimension; value: string; counts: Map<string, number>; chosen: readonly string[] };

function Option({ dimension, value, counts, chosen }: OptionProps) {
  const strings = useLocalized(discoverStrings);
  const language = useLanguage();
  const dispatch = useAppDispatch();
  const count = counts.get(value) ?? 0;
  const selected = chosen.includes(value);
  const label = filterLabel(dimension, value as never, language);
  return (
    <FilterChip
      label={label}
      count={count}
      selected={selected}
      accessibilityLabel={count === 0 && !selected ? `${strings.optionCount(label, 0)}, ${strings.optionUnavailable}` : strings.optionCount(label, count)}
      onPress={() => dispatch(filterToggled({ dimension, value }))}
    />
  );
}

/** Technologies: the named ones first, a "Show all" expander, and a small search inside the list once it is open. */
function TechnologyOptions({ values, counts, chosen }: { values: string[]; counts: Map<string, number>; chosen: readonly string[] }) {
  const strings = useLocalized(discoverStrings);
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);
  const [search, setSearch] = useState('');
  const needle = search.trim().toLowerCase();
  // `facetValues` already lists only technologies some course lists, the named ones first; the ones already chosen always show.
  const sorted = values;
  const shown = expanded ? sorted.filter((id) => !needle || technologyLabel(id).toLowerCase().includes(needle)) : [...sorted.slice(0, TECHNOLOGIES_SHOWN), ...sorted.slice(TECHNOLOGIES_SHOWN).filter((id) => chosen.includes(id))];
  const hidden = sorted.length - shown.length;
  return (
    <View style={styles.techs}>
      {expanded && (
        <View style={[styles.search, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
          <Icon name="search" size={18} color="textSecondary" />
          <TextInput
            accessibilityLabel={strings.searchTechnologies}
            placeholder={strings.searchTechnologies}
            placeholderTextColor={theme.textTertiary}
            selectionColor={theme.primary}
            value={search}
            onChangeText={setSearch}
            autoCapitalize="none"
            autoCorrect={false}
            style={[styles.searchInput, { color: theme.text }]}
          />
        </View>
      )}
      <View style={styles.wrap}>
        {shown.map((value) => (
          <Option key={value} dimension="technologies" value={value} counts={counts} chosen={chosen} />
        ))}
      </View>
      {expanded && shown.length === 0 && (
        <ThemedText type="secondary" themeColor="textSecondary">
          {strings.noTechnology}
        </ThemedText>
      )}
      {(hidden > 0 || expanded) && sorted.length > TECHNOLOGIES_SHOWN && (
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ expanded }}
          onPress={() => {
            setExpanded((open) => !open);
            setSearch('');
          }}
          style={styles.expander}
          hitSlop={8}>
          <ThemedText type="secondarySemiBold" themeColor="primaryText">
            {expanded ? strings.showFewerTechnologies : strings.showAllTechnologies(sorted.length)}
          </ThemedText>
          <Icon name={expanded ? 'expand_less' : 'expand_more'} size={18} color="primary" />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  groups: {
    gap: Spacing.four,
  },
  group: {
    gap: Spacing.two,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.three,
  },
  groupTitle: {
    flexShrink: 1,
  },
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  techs: {
    gap: Spacing.two,
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    minHeight: InputHeight,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.input,
    borderCurve: 'continuous',
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    alignSelf: 'stretch',
    fontFamily: Typography.body.fontFamily,
    fontSize: Typography.body.fontSize,
    includeFontPadding: false,
  },
  expander: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    minHeight: 44,
    alignSelf: 'flex-start',
  },
});
