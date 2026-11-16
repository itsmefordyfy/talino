import { View } from 'react-native';

import { tapFeedback } from '@/lib/haptics';

import { Icon, type IconName } from './icon';
import { ListRow } from './list-row';
import { SettingsGroup } from './settings-group';

export type Option<T extends string> = {
  value: T;
  title: string;
  subtitle?: string;
  icon?: IconName;
};

export type OptionListProps<T extends string> = {
  options: readonly Option<T>[];
  value: T;
  onChange: (value: T) => void;
  title?: string;
  footer?: string;
};

/**
 * One choice from a short list, as a settings page (Language, Appearance): a row each, a check on
 * the chosen one, applied the moment it's tapped. Screen readers hear which one is selected.
 */
export function OptionList<T extends string>({ options, value, onChange, title, footer }: OptionListProps<T>) {
  return (
    <SettingsGroup title={title} footer={footer}>
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <View key={option.value}>
            <ListRow
              icon={option.icon}
              title={option.title}
              subtitle={option.subtitle}
              showChevron={false}
              accessibilityLabel={[option.title, option.subtitle].filter(Boolean).join(', ')}
              selected={selected}
              onPress={() => {
                if (selected) return;
                tapFeedback();
                onChange(option.value);
              }}
              trailing={selected ? <Icon name="check" size={18} color="primary" /> : null}
            />
          </View>
        );
      })}
    </SettingsGroup>
  );
}
