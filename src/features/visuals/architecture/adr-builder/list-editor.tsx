import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { IconButton } from '@/components/ui/icon-button';
import { TextField } from '@/components/ui/text-field';
import { Spacing } from '@/constants/theme';
import { tapFeedback } from '@/lib/haptics';

export type ListEditorProps = {
  /** A heading above the rows; leave out when the section above already names them. */
  label?: string;
  items: readonly string[];
  onChange: (items: string[]) => void;
  max: number;
  itemMax: number;
  placeholder: string;
  addLabel: string;
  /** The accessibility name of row `n` (1-based) and of its remove button. */
  itemLabel: (n: number) => string;
  removeLabel: (n: number) => string;
};

/** A short list the learner builds line by line: one text row each, a remove button on every row and an add button until `max`. Empty rows are allowed while typing; the checks and the Markdown ignore them. */
export function ListEditor({ label, items, onChange, max, itemMax, placeholder, addLabel, itemLabel, removeLabel }: ListEditorProps) {
  return (
    <View style={styles.stack}>
      {label ? (
        <ThemedText type="secondarySemiBold" themeColor="textSecondary">
          {label}
        </ThemedText>
      ) : null}
      {items.map((item, index) => (
        <View key={index} style={styles.row}>
          <TextField
            style={styles.field}
            label={itemLabel(index + 1)}
            labelHidden
            value={item}
            placeholder={placeholder}
            maxLength={itemMax}
            onChangeText={(next) => onChange(items.map((current, at) => (at === index ? next : current)))}
          />
          <IconButton
            icon="close"
            color="textSecondary"
            background="backgroundSelected"
            accessibilityLabel={removeLabel(index + 1)}
            onPress={() => {
              tapFeedback();
              onChange(items.filter((_, at) => at !== index));
            }}
          />
        </View>
      ))}
      {items.length < max ? (
        <Button
          size="small"
          variant="outline"
          icon="add"
          title={addLabel}
          style={styles.add}
          onPress={() => {
            tapFeedback();
            onChange([...items, '']);
          }}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: Spacing.two },
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.two },
  field: { flex: 1 },
  add: { alignSelf: 'flex-start' },
});
